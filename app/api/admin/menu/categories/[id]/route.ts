import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { menuCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { updateCategorySchema } from "@/lib/validation/menuValidation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteContext) {
    try {
        await requireAdminUser();
        const { id: idParam } = await params;
        const id = Number(idParam);

        const json = await req.json();
        const parsed = updateCategorySchema.safeParse({ ...json, id });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const data = parsed.data;
        const { id: _, ...rest } = data;

        const [row] = await db
            .update(menuCategories)
            .set({
                ...(rest.slug !== undefined && { slug: rest.slug }),
                ...(rest.name !== undefined && { name: rest.name }),
                ...(rest.tagline !== undefined && { tagline: rest.tagline }),
                ...(rest.sortOrder !== undefined && { sortOrder: rest.sortOrder }),
                ...(rest.isActive !== undefined && { isActive: rest.isActive }),
            })
            .where(eq(menuCategories.id, id))
            .returning();

        if (!row) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ category: row });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
    try {
        await requireAdminUser();
        const { id: idParam } = await params;
        const id = Number(idParam);
        await db.delete(menuCategories).where(eq(menuCategories.id, id));
        return NextResponse.json({ ok: true });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
