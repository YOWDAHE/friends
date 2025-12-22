import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireAdminUser } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "@/lib/password";

const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function GET() {
    try {
        const admin = await requireAdminUser();
        const adminId = Number(admin.id);

        const [row] = await db
            .select({
                id: users.id,
                email: users.email,
                name: users.name,
            })
            .from(users)
            .where(eq(users.id, adminId));

        if (!row) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: row.id,
            email: row.email,
            name: row.name,
        });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("Admin account GET error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const admin = await requireAdminUser();
        const adminId = Number(admin.id);
        const json = await req.json();

        // Decide which update
        if ("email" in json) {
            const parsed = emailSchema.safeParse(json);
            if (!parsed.success) {
                return NextResponse.json(
                    { error: "Validation error", details: parsed.error.flatten() },
                    { status: 400 },
                );
            }

            const { email } = parsed.data;
            const [updated] = await db
                .update(users)
                .set({ email })
                .where(eq(users.id, adminId))
                .returning({ id: users.id, email: users.email });

            return NextResponse.json({ account: updated });
        }

        if ("currentPassword" in json && "newPassword" in json) {
            const parsed = passwordSchema.safeParse(json);
            if (!parsed.success) {
                return NextResponse.json(
                    { error: "Validation error", details: parsed.error.flatten() },
                    { status: 400 },
                );
            }

            const { currentPassword, newPassword } = parsed.data;

            const [row] = await db
                .select({
                    id: users.id,
                    passwordHash: users.passwordHash,
                })
                .from(users)
                .where(eq(users.id, adminId));

            if (!row || !row.passwordHash) {
                return NextResponse.json(
                    { error: "Password not set for this account" },
                    { status: 400 },
                );
            }

            const ok = await verifyPassword(currentPassword, row.passwordHash);
            if (!ok) {
                return NextResponse.json(
                    { error: "Current password is incorrect" },
                    { status: 401 },
                );
            }

            const newHash = await hashPassword(newPassword);
            await db
                .update(users)
                .set({ passwordHash: newHash })
                .where(eq(users.id, adminId));

            return NextResponse.json({ ok: true });
        }

        return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("Admin account PATCH error", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
