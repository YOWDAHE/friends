import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { updateMenuItemSchema } from "@/lib/validation/menuValidation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteContext) {
    try {
        await requireAdminUser();
        const { id: idParam } = await params;
        const id = Number(idParam);

        const json = await req.json();
        const parsed = updateMenuItemSchema.safeParse({ ...json, id });

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const data = parsed.data;
        const { id: _, ...rest } = data;

        const [row] = await db
            .update(menuItems)
            .set({
                ...(rest.sectionId !== undefined && { sectionId: rest.sectionId }),
                ...(rest.name !== undefined && { name: rest.name }),
                ...(rest.price !== undefined && { price: rest.price }),
                ...(rest.description !== undefined && {
                    description: rest.description,
                }),
                ...(rest.isVisible !== undefined && { isVisible: rest.isVisible }),
                ...(rest.sortOrder !== undefined && { sortOrder: rest.sortOrder }),
                ...(rest.isFeatured !== undefined && { isFeatured: rest.isFeatured }),
            })
            .where(eq(menuItems.id, id))
            .returning();

        if (!row) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ item: row });
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

        await db.delete(menuItems).where(eq(menuItems.id, id));

        return NextResponse.json({ ok: true });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
