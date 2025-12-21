import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { events, tickets } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const { eventId, ticketId, qty, name, email, phone, notes } =
            (await req.json()) as {
                eventId: number;
                ticketId: number;
                qty: number;
                name?: string;
                email?: string;
                phone?: string;
                notes?: string;
            };


        if (!eventId || !ticketId || !qty || qty <= 0) {
            return NextResponse.json(
                { error: "Invalid checkout payload" },
                { status: 400 },
            );
        }

        // load event
        const [event] = await db
            .select()
            .from(events)
            .where(eq(events.id, eventId));

        if (!event || !event.isPublished || !event.isPaidEvent) {
            return NextResponse.json(
                { error: "Event not available" },
                { status: 400 },
            );
        }

        // load ticket
        const [ticket] = await db
            .select()
            .from(tickets)
            .where(eq(tickets.id, ticketId));

        if (!ticket || !ticket.isActive || ticket.eventId !== event.id) {
            return NextResponse.json(
                { error: "Ticket not available" },
                { status: 400 },
            );
        }

        // capacity check
        const remaining =
            ticket.capacity != null ? Math.max(ticket.capacity - ticket.sold, 0) : null;

        if (remaining !== null && (remaining <= 0 || qty > remaining)) {
            return NextResponse.json(
                { error: "Not enough tickets available" },
                { status: 400 },
            );
        }

        // compute totals
        const priceNumber = Number(ticket.price);
        if (Number.isNaN(priceNumber) || priceNumber <= 0) {
            return NextResponse.json(
                { error: "Invalid ticket price" },
                { status: 400 },
            );
        }

        const subtotal = priceNumber * qty;
        const tax = subtotal * 0.05;
        const total = subtotal + tax;

        // Stripe expects amount in cents
        const amountInCents = Math.round(total * 100);

        const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_BASE_URL ?? "";

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            customer_email: email || undefined,
            line_items: [
                {
                    quantity: qty,
                    price_data: {
                        currency: "usd",
                        unit_amount: amountInCents / qty, // per ticket incl. tax
                        product_data: {
                            name: `${event.title} – ${ticket.name}`,
                            description: event.subtitle ?? undefined,
                        },
                    },
                },
            ],
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout/cancel`,
            metadata: {
                eventId: String(event.id),
                ticketId: String(ticket.id),
                qty: String(qty),
                name: name ?? "",
                email: email ?? "",
                phone: phone ?? "",
                notes: notes ?? "",
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (e) {
        console.error("Error creating checkout session", e);
        return NextResponse.json(
            { error: "Error creating checkout session" },
            { status: 500 },
        );
    }
}
