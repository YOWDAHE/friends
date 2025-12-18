import { NextResponse } from "next/server";
import { db } from "@/db";
import { reservationTickets, tickets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { addReservationTicketSchema } from "@/lib/validation/reservationsValidation";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
    try {
        await requireAdminUser();
        const reservationId = Number(params.id);

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

export async function POST(req: Request, { params }: Params) {
    try {
        await requireAdminUser();
        const reservationId = Number(params.id);

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

        return NextResponse.json({ ticketLine: row }, { status: 201 });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
