import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { updateEventSchema } from "@/lib/validation/eventValidation";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
    try {
        await requireAdminUser();
        const { id: idParam } = await params;
        const id = Number(idParam);
        const [event] = await db.select().from(events).where(eq(events.id, id));

        if (!event) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ event });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

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

        const [event] = await db
            .update(events)
            .set({
                ...(rest.title !== undefined && { title: rest.title }),
                ...(rest.subtitle !== undefined && { subtitle: rest.subtitle }),
                ...(rest.description !== undefined && {
                    description: rest.description,
                }),
                ...(rest.dateTime !== undefined && {
                    dateTime: new Date(rest.dateTime),
                }),
                ...(rest.location !== undefined && { location: rest.location }),
                ...(rest.imageUrl !== undefined && { imageUrl: rest.imageUrl }),
                ...(rest.isPaidEvent !== undefined && {
                    isPaidEvent: rest.isPaidEvent,
                }),
                ...(rest.isPublished !== undefined && {
                    isPublished: rest.isPublished,
                }),
            })
            .where(eq(events.id, id))
            .returning();

        if (!event) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ event });
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

        await db.delete(events).where(eq(events.id, id));
        return NextResponse.json({ ok: true });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
