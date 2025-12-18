import { NextResponse } from "next/server";
import { db } from "@/db";
import { menuSections } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { createSectionSchema } from "@/lib/validation/menuValidation";

export async function GET(req: Request) {
    try {
        await requireAdminUser();

        const { searchParams } = new URL(req.url);
        const categoryIdParam = searchParams.get("categoryId");

        let rows;

        if (categoryIdParam) {
            const categoryId = Number(categoryIdParam);
            rows = await db
                .select()
                .from(menuSections)
                .where(eq(menuSections.categoryId, categoryId))
                .orderBy(asc(menuSections.sortOrder), asc(menuSections.id));
        } else {
            rows = await db
                .select()
                .from(menuSections)
                .orderBy(asc(menuSections.sortOrder), asc(menuSections.id));
        }

        return NextResponse.json({ sections: rows });
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
        const parsed = createSectionSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const data = parsed.data;

        const [row] = await db
            .insert(menuSections)
            .values({
                categoryId: data.categoryId,
                slug: data.slug,
                name: data.name,
                imageUrl: data.imageUrl ?? null,
                imagePosition: data.imagePosition ?? "left",
                sortOrder: data.sortOrder ?? 0,
                isActive: data.isActive ?? true,
            })
            .returning();

        return NextResponse.json({ section: row }, { status: 201 });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
