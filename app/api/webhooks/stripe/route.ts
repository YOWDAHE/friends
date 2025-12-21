import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import {
    reservations,
    reservationTickets,
    tickets,
    payments,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const config = {
    api: {
        bodyParser: false,
    },
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const sig = req.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        const rawBody = await req.text();
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
        console.error("Stripe webhook signature error", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            const metadata = session.metadata ?? {};

            const eventId = Number(metadata.eventId);
            const ticketId = Number(metadata.ticketId);
            const qty = Number(metadata.qty);

            if (!eventId || !ticketId || !qty || qty <= 0) {
                console.error("Missing metadata in checkout.session.completed", {
                    eventId,
                    ticketId,
                    qty,
                });
                return NextResponse.json({ received: true });
            }

            const paymentIntentId = session.payment_intent?.toString() ?? null;
            if (!paymentIntentId) {
                console.error("Missing payment_intent on session", session.id);
                return NextResponse.json({ received: true });
            }

            // ✅ IDEMPOTENCY: skip if this payment already processed
            const existingPayments = await db
                .select()
                .from(payments)
                .where(eq(payments.providerPaymentId, paymentIntentId));

            if (existingPayments.length > 0) {
                console.log(
                    "Payment already processed, skipping duplicate webhook",
                    paymentIntentId,
                );
                return NextResponse.json({ received: true });
            }

            // Load ticket to get name, capacity, etc.
            const [ticketRow] = await db
                .select()
                .from(tickets)
                .where(eq(tickets.id, ticketId));

            if (!ticketRow) {
                console.error("Ticket not found for webhook:", ticketId);
                return NextResponse.json({ received: true });
            }

            // Capacity re-check
            const remaining =
                ticketRow.capacity != null
                    ? Math.max(ticketRow.capacity - ticketRow.sold, 0)
                    : null;

            if (remaining !== null && qty > remaining) {
                console.error(
                    "Over-capacity in webhook, qty:",
                    qty,
                    "remaining:",
                    remaining,
                );
                return NextResponse.json({ received: true });
            }

            // Stripe actual charged amount (incl. tax)
            if (!session.amount_total) {
                console.error("Missing amount_total on session", session.id);
                return NextResponse.json({ received: true });
            }

            const actualAmountCharged = session.amount_total / 100; // e.g. 42.00
            const subtotalFromMeta = metadata.subtotal
                ? Number(metadata.subtotal)
                : Number(ticketRow.price) * qty;
            const unitPrice = (subtotalFromMeta / qty).toFixed(2); // 20.00
            const totalPrice = actualAmountCharged.toFixed(2); // 42.00

            console.log("Webhook amounts:", {
                metadataSubtotal: metadata.subtotal,
                metadataTax: metadata.tax,
                metadataTotal: metadata.total,
                stripeCharged: actualAmountCharged,
                unitPrice,
                totalPrice,
            });

            // Basic customer info from Stripe (backup)
            const customerEmail =
                typeof session.customer_details?.email === "string"
                    ? session.customer_details?.email
                    : null;
            const customerName =
                typeof session.customer_details?.name === "string"
                    ? session.customer_details?.name
                    : null;

            const metaName =
                metadata.name && metadata.name.trim().length
                    ? metadata.name
                    : undefined;
            const metaEmail =
                metadata.email && metadata.email.trim().length
                    ? metadata.email
                    : undefined;
            const metaPhone =
                metadata.phone && metadata.phone.trim().length
                    ? metadata.phone
                    : undefined;
            const metaNotes =
                metadata.notes && metadata.notes.trim().length
                    ? metadata.notes
                    : undefined;

            // 1) Create ONE reservation with partySize = qty
            const [reservationRow] = await db
                .insert(reservations)
                .values({
                    eventId,
                    name: metaName ?? customerName ?? "Unknown user",
                    email: metaEmail ?? customerEmail ?? "unknown@example.com",
                    phone: metaPhone ?? "",
                    partySize: qty,
                    notes: metaNotes ?? "Created via online payment",
                    status: "CONFIRMED",
                })
                .returning();

            // 2) ONE ticket line with quantity = qty
            await db.insert(reservationTickets).values({
                reservationId: reservationRow.id,
                ticketId,
                quantity: qty,
                unitPrice, // "20.00" pre-tax per ticket for reference
                totalPrice, // "42.00" actual charged incl. tax
            });

            // 3) Increment ticket sold count
            await db
                .update(tickets)
                .set({ sold: sql`${tickets.sold} + ${qty}` })
                .where(eq(tickets.id, ticketId));

            // 4) Record payment with actual Stripe amount
            await db.insert(payments).values({
                reservationId: reservationRow.id,
                eventId,
                amount: totalPrice, // "42.00"
                currency: session.currency?.toUpperCase() ?? "USD",
                status: "SUCCEEDED",
                provider: "stripe",
                providerPaymentId: paymentIntentId,
                providerClientSecret: null,
                source: "online",
                description: `Stripe Checkout – ${ticketRow.name}`,
            });
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error("Error handling Stripe webhook", err);
        return NextResponse.json({ error: "Webhook error" }, { status: 500 });
    }
}
