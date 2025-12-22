import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";

export async function PATCH(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await requireAdminUser();
        const id = Number((await params).id);
        console.log("id...", id)
        if (!id || Number.isNaN(id)) {
            return NextResponse.json({ error: "Invalid id" }, { status: 400 });
        }

        const [updated] = await db
            .update(contactMessages)
            .set({
                isArchived: true,
                isRead: true,
                archivedAt: new Date(),
            })
            .where(eq(contactMessages.id, id))
            .returning();

        if (!updated) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ message: updated });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("Error archiving contact message", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
