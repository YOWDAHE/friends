import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { and, gte, lt, or, lte } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
    try {
        await requireAdminUser();

        const search = req.nextUrl.searchParams;
        const yearParam = search.get("year");
        const monthParam = search.get("month");

        if (!yearParam || !monthParam) {
            return NextResponse.json(
                { error: "year and month are required (e.g. ?year=2025&month=12)" },
                { status: 400 },
            );
        }

        const year = Number(yearParam);
        const month = Number(monthParam); // 1-based
        if (Number.isNaN(year) || Number.isNaN(month) || month < 1 || month > 12) {
            return NextResponse.json(
                { error: "Invalid year or month" },
                { status: 400 },
            );
        }

        const startOfMonth = new Date(year, month - 1, 1);
        const startOfNextMonth = new Date(year, month, 1);

        // Events that overlap this month:
        // startDate < nextMonth AND endDate >= startOfMonth
        const rows = await db
            .select()
            .from(events)
            .where(
                and(
                    lt(events.startDate, startOfNextMonth),
                    gte(events.endDate, startOfMonth),
                ),
            );

        const eventsPayload = rows.map((row) => {
            const start = new Date(row.startDate);
            const end = new Date(row.endDate);

            return {
                id: row.id,
                title: row.title,
                start: start.toISOString(),
                end: end.toISOString(),
                isPublished: row.isPublished,
                isPaidEvent: row.isPaidEvent,
            };
        });

        return NextResponse.json({ events: eventsPayload });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("Error loading events calendar", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
