import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events, staffSettings } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { verifyStaffToken } from "@/lib/staff-jwt";

export async function GET(req: NextRequest) {
    try {
        const data = await db
            .select({
                enabled: staffSettings.isEnabled
            })
            .from(staffSettings);

        return NextResponse.json({ enabled: data[0].enabled });
    } catch (e) {
        console.error("Staff events error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
