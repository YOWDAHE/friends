import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { staffSettings } from "@/db/schema";
import { signStaffToken } from "@/lib/staff-jwt";
import { verifyPassword } from "@/lib/password";

const schema = z.object({
    password: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        const json = await req.json();
        const parsed = schema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid input" },
                { status: 400 },
            );
        }

        const { password } = parsed.data;

        const [settings] =
            (await db.select().from(staffSettings).limit(1)) ?? [];

        if (!settings || !settings.isEnabled) {
            return NextResponse.json(
                { error: "Staff access is disabled" },
                { status: 403 },
            );
        }

        const ok = await verifyPassword(password, settings.passwordHash);
        if (!ok) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 401 },
            );
        }

        const token = signStaffToken();

        return NextResponse.json({ token, role: "STAFF" });
    } catch (e) {
        console.error("Staff login error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
