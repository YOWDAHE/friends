import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { updateEventSchema } from "@/lib/validation/eventValidation";
import { deleteCloudinaryImage } from "@/lib/cloudinary";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteContext) {
    try {
        await requireAdminUser();
        const { id: idParam } = await params;
        const id = Number(idParam);

        const json = await req.json();
        const parsed = updateEventSchema.safeParse({ ...json, id });
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const data = parsed.data;
        const { id: _, ...rest } = data;

        const [existing] = await db
            .select()
            .from(events)
            .where(eq(events.id, id));

        const [row] = await db
            .update(events)
            .set({
                ...(rest.title !== undefined && { title: rest.title }),
                ...(rest.subtitle !== undefined && { subtitle: rest.subtitle }),
                ...(rest.description !== undefined && { description: rest.description }),
                ...(rest.dateTime !== undefined && { dateTime: new Date(rest.dateTime) }),
                ...(rest.location !== undefined && { location: rest.location }),
                ...(rest.imageUrl !== undefined && { imageUrl: rest.imageUrl }),
                ...(rest.imagePublicId !== undefined && { imagePublicId: rest.imagePublicId }),
                ...(rest.isPaidEvent !== undefined && { isPaidEvent: rest.isPaidEvent }),
                ...(rest.isPublished !== undefined && { isPublished: rest.isPublished }),
            })
            .where(eq(events.id, id))
            .returning();

        if (!row) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        if (
            rest.imagePublicId &&
            existing?.imagePublicId &&
            existing.imagePublicId !== rest.imagePublicId
        ) {
            console.log("deleting image")
            deleteCloudinaryImage(existing.imagePublicId);
        }

        return NextResponse.json({ event: row });
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

        const [existing] = await db
            .select()
            .from(events)
            .where(eq(events.id, id));

        await db.delete(events).where(eq(events.id, id));

        if (existing?.imagePublicId) {
            deleteCloudinaryImage(existing.imagePublicId);
        }
        return NextResponse.json({ ok: true });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
