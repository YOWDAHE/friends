import { NextResponse } from "next/server";
import { db } from "@/db";
import { menuCategories } from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import {
    createCategorySchema,
} from "@/lib/validation/menuValidation";

export async function GET() {
    try {
        await requireAdminUser();
        const rows = await db
            .select()
            .from(menuCategories)
            .orderBy(asc(menuCategories.sortOrder), asc(menuCategories.id));
        return NextResponse.json({ categories: rows });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await requireAdminUser();
        const json = await req.json();
        const parsed = createCategorySchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", details: parsed.error.flatten() },
                { status: 400 },
            );
        }
        const data = parsed.data;
        const [row] = await db
            .insert(menuCategories)
            .values({
                slug: data.slug,
                name: data.name,
                tagline: data.tagline ?? null,
                sortOrder: data.sortOrder ?? 0,
                isActive: data.isActive ?? true,
            })
            .returning();
        return NextResponse.json({ category: row }, { status: 201 });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
