// app/api/admin/events/[id]/reservations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events, reservations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await requireAdminUser();

        console.log("ID: ", (await params).id)
        const eventId = Number((await params).id);
        if (!eventId || Number.isNaN(eventId)) {
            return NextResponse.json({ error: "Invalid event id" }, { status: 400 });
        }

        const [eventRow] = await db
            .select({ id: events.id })
            .from(events)
            .where(eq(events.id, eventId));

        if (!eventRow) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const rows = await db
            .select({
                id: reservations.id,
                name: reservations.name,
                email: reservations.email,
                phone: reservations.phone,
                partySize: reservations.partySize,
                createdAt: reservations.createdAt,
            })
            .from(reservations)
            .where(eq(reservations.eventId, eventId));

        return NextResponse.json({ reservations: rows });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("Admin event reservations error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
