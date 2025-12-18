import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { menuSections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { updateSectionSchema } from "@/lib/validation/menuValidation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteContext) {
    try {
        await requireAdminUser();
        const { id: idParam } = await params;
        const id = Number(idParam);

        const json = await req.json();
        const parsed = updateSectionSchema.safeParse({ ...json, id });

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const data = parsed.data;
        const { id: _, ...rest } = data;

        const [row] = await db
            .update(menuSections)
            .set({
                ...(rest.categoryId !== undefined && { categoryId: rest.categoryId }),
                ...(rest.slug !== undefined && { slug: rest.slug }),
                ...(rest.name !== undefined && { name: rest.name }),
                ...(rest.imageUrl !== undefined && { imageUrl: rest.imageUrl }),
                ...(rest.imagePosition !== undefined && {
                    imagePosition: rest.imagePosition,
                }),
                ...(rest.sortOrder !== undefined && { sortOrder: rest.sortOrder }),
                ...(rest.isActive !== undefined && { isActive: rest.isActive }),
            })
            .where(eq(menuSections.id, id))
            .returning();

        if (!row) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ section: row });
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

        await db.delete(menuSections).where(eq(menuSections.id, id));

        return NextResponse.json({ ok: true });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
