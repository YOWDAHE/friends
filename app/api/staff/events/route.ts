import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { verifyStaffToken } from "@/lib/staff-jwt";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization") ?? "";
        const token = authHeader.replace("Bearer ", "").trim();
        const payload = token ? verifyStaffToken(token) : null;

        if (!payload || payload.role !== "STAFF") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();
        const rows = await db
            .select({
                id: events.id,
                title: events.title,
            })
            .from(events)
            .where(
                and(eq(events.isPublished, true)),
                // and(eq(events.isPublished, true), gte(events.startDate, now)),
            )
            .orderBy(events.startDate);

        return NextResponse.json({ events: rows });
    } catch (e) {
        console.error("Staff events error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
