import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reservations, events } from "@/db/schema";
import { eq, and, ilike, or } from "drizzle-orm";
import { verifyStaffToken } from "@/lib/staff-jwt";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization") ?? "";
        const token = authHeader.replace("Bearer ", "").trim();
        const payload = token ? verifyStaffToken(token) : null;

        if (!payload || payload.role !== "STAFF") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const search = req.nextUrl.searchParams;
        const eventIdParam = search.get("eventId");
        const q = search.get("q")?.trim();

        if (!eventIdParam) {
            return NextResponse.json(
                { error: "eventId is required" },
                { status: 400 },
            );
        }

        const eventId = Number(eventIdParam);
        if (!eventId || Number.isNaN(eventId)) {
            return NextResponse.json({ error: "Invalid eventId" }, { status: 400 });
        }

        // Ensure event exists and is not archived (optional)
        const [eventRow] = await db
            .select({
                id: events.id,
                title: events.title,
            })
            .from(events)
            .where(eq(events.id, eventId));

        if (!eventRow) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const whereBase = eq(reservations.eventId, eventId);
        const where =
            q && q.length
                ? and(
                    whereBase,
                    or(
                        ilike(reservations.name, `%${q}%`),
                        ilike(reservations.email, `%${q}%`),
                        ilike(reservations.phone, `%${q}%`),
                    ),
                )
                : whereBase;
        console.log({
            re: reservations.eventId,
            eventId,
        })

        const rows = await db
            .select({
                id: reservations.id,
                name: reservations.name,
                email: reservations.email,
                phone: reservations.phone,
                partySize: reservations.partySize,
                status: reservations.status,
                createdAt: reservations.createdAt,
            })
            .from(reservations)
            .where(where);

        return NextResponse.json({
            event: {
                id: eventRow.id,
                title: eventRow.title,
            },
            reservations: rows,
        });
    } catch (e) {
        console.error("Staff event guests error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
