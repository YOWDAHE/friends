import { NextResponse } from "next/server";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { createMenuItemSchema } from "@/lib/validation/menuValidation";

export async function GET(req: Request) {
    try {
        await requireAdminUser();

        const { searchParams } = new URL(req.url);
        const sectionIdParam = searchParams.get("sectionId");

        let rows;

        if (sectionIdParam) {
            const sectionId = Number(sectionIdParam);
            rows = await db
                .select()
                .from(menuItems)
                .where(eq(menuItems.sectionId, sectionId))
                .orderBy(asc(menuItems.sortOrder), asc(menuItems.id));
        } else {
            rows = await db
                .select()
                .from(menuItems)
                .orderBy(asc(menuItems.sortOrder), asc(menuItems.id));
        }

        return NextResponse.json({ items: rows });
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
        const parsed = createMenuItemSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const data = parsed.data;

        const [row] = await db
            .insert(menuItems)
            .values({
                sectionId: data.sectionId,
                name: data.name,
                price: data.price,
                description: data.description ?? null,
                isVisible: data.isVisible ?? true,
                sortOrder: data.sortOrder ?? 0,
                isFeatured: data.isFeatured ?? false,
            })
            .returning();

        return NextResponse.json({ item: row }, { status: 201 });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
