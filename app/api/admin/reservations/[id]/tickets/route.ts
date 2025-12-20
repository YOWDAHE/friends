import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { reservationTickets, tickets } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { addReservationTicketSchema } from "@/lib/validation/reservationsValidation";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
    try {
        await requireAdminUser();
        const { id } = await params;
        const reservationId = Number(id);

        const rows = await db
            .select({
                line: reservationTickets,
                ticket: tickets,
            })
            .from(reservationTickets)
            .leftJoin(tickets, eq(reservationTickets.ticketId, tickets.id))
            .where(eq(reservationTickets.reservationId, reservationId));

        return NextResponse.json({ tickets: rows });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: RouteContext) {
    try {
        await requireAdminUser();
        const { id } = await params;
        const reservationId = Number(id);

        const json = await req.json();
        const parsed = addReservationTicketSchema.safeParse({
            ...json,
            reservationId,
        });

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const data = parsed.data;
        const total = (
            Number(data.unitPrice) * Number(data.quantity)
        ).toFixed(2);

        const [row] = await db
            .insert(reservationTickets)
            .values({
                reservationId: data.reservationId,
                ticketId: data.ticketId,
                quantity: data.quantity,
                unitPrice: data.unitPrice,
                totalPrice: total,
            })
            .returning();

        await db
            .update(tickets)
            .set({ sold: sql`${tickets.sold} + ${data.quantity}` })
            .where(eq(tickets.id, data.ticketId));

        return NextResponse.json({ ticketLine: row }, { status: 201 });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
