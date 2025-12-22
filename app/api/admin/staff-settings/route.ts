import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { staffSettings } from "@/db/schema";
import { requireAdminUser } from "@/lib/admin-auth";
import { hashPassword } from "@/lib/password";
import { sql } from "drizzle-orm";

const schema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    isEnabled: z.boolean().optional().default(true),
});

export async function GET() {
    try {
        await requireAdminUser();

        const [settings] =
            (await db.select().from(staffSettings).limit(1)) ?? [];

        if (!settings) {
            return NextResponse.json({ exists: false, isEnabled: false });
        }

        return NextResponse.json({
            exists: true,
            isEnabled: settings.isEnabled,
            updatedAt: settings.updatedAt,
        });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await requireAdminUser();

        const json = await req.json();
        const parsed = schema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const { password, isEnabled } = parsed.data;
        const passwordHash = await hashPassword(password);

        const existing = await db.select().from(staffSettings).limit(1);

        if (existing.length === 0) {
            await db.insert(staffSettings).values({
                passwordHash,
                isEnabled,
            });
        } else {
            await db
                .update(staffSettings)
                .set({
                    passwordHash,
                    isEnabled,
                    updatedAt: sql`NOW()`,
                })
                .where(sql`1 = 1`); // single-row table
        }

        return NextResponse.json({ ok: true });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
