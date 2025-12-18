import { NextResponse } from "next/server";
import { db } from "@/db";
import { reservations, events } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { createReservationSchema } from "@/lib/validation/reservationsValidation";

export async function GET(req: Request) {
    try {
        await requireAdminUser();

        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get("status");

        // base select
        let whereClause:
            | ReturnType<typeof eq<typeof reservations.status>>
            | undefined;

        if (statusFilter) {
            whereClause = eq(reservations.status, statusFilter);
        }

        const rows = await db
            .select({
                reservation: reservations,
                event: events,
            })
            .from(reservations)
            .leftJoin(events, eq(reservations.eventId, events.id))
            .where(whereClause ?? undefined)
            .orderBy(desc(reservations.createdAt));

        return NextResponse.json({ reservations: rows });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await requireAdminUser();

        const json = await req.json();
        const parsed = createReservationSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const data = parsed.data;

        const [row] = await db
            .insert(reservations)
            .values({
                eventId: data.eventId ?? null,
                name: data.name,
                email: data.email,
                phone: data.phone,
                partySize: data.partySize,
                notes: data.notes ?? null,
            })
            .returning();

        return NextResponse.json({ reservation: row }, { status: 201 });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
