import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { reservationTickets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";

export async function DELETE(
    _req: NextRequest,
    context: { params: Promise<{ id: string; lineId: string }> }
) {
    try {
        await requireAdminUser();

        const { lineId } = await context.params;
        const lineIdNumber = Number(lineId);

        await db
            .delete(reservationTickets)
            .where(eq(reservationTickets.id, lineIdNumber));

        return NextResponse.json({ ok: true });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
