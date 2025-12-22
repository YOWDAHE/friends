import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { and, desc, eq, lt } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
    try {
        await requireAdminUser();

        // 1) Cleanup: delete archived messages older than 14 days
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 14);

        await db
            .delete(contactMessages)
            .where(
                and(
                    eq(contactMessages.isArchived, true),
                    lt(contactMessages.archivedAt, cutoff),
                ),
            );

        // 2) Then fetch remaining messages with filter
        const filter = req.nextUrl.searchParams.get("filter") ?? "new";

        let whereClause;
        if (filter === "archived") {
            whereClause = eq(contactMessages.isArchived, true);
        } else if (filter === "new") {
            whereClause = eq(contactMessages.isArchived, false);
        } else {
            whereClause = undefined;
        }

        const query = db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
        const messages = whereClause ? await query.where(whereClause) : await query;

        return NextResponse.json({ messages });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("Error loading contact messages", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
