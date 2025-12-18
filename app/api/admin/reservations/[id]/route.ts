import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import {
    reservations,
    events,
    reservationTickets,
    tickets,
    payments,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { updateReservationStatusSchema } from "@/lib/validation/reservationsValidation";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
    try {
        await requireAdminUser();
        const { id: idParam } = await params;
        const id = Number(idParam);

        const [reservationRow] = await db
            .select({
                reservation: reservations,
                event: events,
            })
            .from(reservations)
            .leftJoin(events, eq(reservations.eventId, events.id))
            .where(eq(reservations.id, id))
            .limit(1);

        if (!reservationRow) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const ticketLines = await db
            .select({
                line: reservationTickets,
                ticket: tickets,
            })
            .from(reservationTickets)
            .leftJoin(tickets, eq(reservationTickets.ticketId, tickets.id))
            .where(eq(reservationTickets.reservationId, id));

        const paymentRows = await db
            .select()
            .from(payments)
            .where(eq(payments.reservationId, id));

        return NextResponse.json({
            reservation: reservationRow,
            tickets: ticketLines,
            payments: paymentRows,
        });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
    try {
        await requireAdminUser();
        const { id: idParam } = await params;
        const id = Number(idParam);

        const json = await req.json();
        const parsed = updateReservationStatusSchema.safeParse({ ...json, id });

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const data = parsed.data;

        const [row] = await db
            .update(reservations)
            .set({ status: data.status })
            .where(eq(reservations.id, id))
            .returning();

        if (!row) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ reservation: row });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
    try {
        await requireAdminUser();
        const { id: idParam } = await params;
        const id = Number(idParam);

        await db.delete(reservations).where(eq(reservations.id, id));

        return NextResponse.json({ ok: true });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
