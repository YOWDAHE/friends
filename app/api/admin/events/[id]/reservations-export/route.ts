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

        const eventId = Number((await params).id);
        if (!eventId || Number.isNaN(eventId)) {
            return NextResponse.json({ error: "Invalid event id" }, { status: 400 });
        }

        // ensure event exists
        const [eventRow] = await db
            .select({
                id: events.id,
                title: events.title,
                startDate: events.startDate,
            })
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
                status: reservations.status,
                notes: reservations.notes,
                createdAt: reservations.createdAt,
            })
            .from(reservations)
            .where(eq(reservations.eventId, eventId));

        const header = [
            "Reservation ID",
            "Name",
            "Email",
            "Phone",
            "Party Size",
            "Status",
            "Notes",
            "Created At",
        ];

        const csvLines = [
            header.join(","),
            ...rows.map((r) => {
                const createdAt = r.createdAt
                    ? new Date(r.createdAt).toISOString()
                    : "";
                const safeNotes = (r.notes ?? "").replace(/"/g, '""');

                return [
                    r.id,
                    `"${(r.name ?? "").replace(/"/g, '""')}"`,
                    `"${(r.email ?? "").replace(/"/g, '""')}"`,
                    `"${(r.phone ?? "").replace(/"/g, '""')}"`,
                    r.partySize,
                    r.status,
                    `"${safeNotes}"`,
                    `"${createdAt}"`,
                ].join(",");
            }),
        ];

        const csv = csvLines.join("\n");
        const filenameSafeTitle =
            eventRow.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "event";

        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="${filenameSafeTitle}-reservations.csv"`,
            },
        });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("Export reservations error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
