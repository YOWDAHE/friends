import { NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { desc } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import {
    createEventSchema,
    updateEventSchema,
} from "@/lib/validation/eventValidation";

export async function GET() {
    try {
        await requireAdminUser();

        const rows = await db.select().from(events).orderBy(desc(events.createdAt));
        return NextResponse.json({ events: rows });
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
        const parsed = createEventSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const data = parsed.data;
        const [row] = await db
            .insert(events)
            .values({
                title: data.title,
                subtitle: data.subtitle ?? null,
                description: data.description ?? null,
                dateTime: new Date(data.dateTime),
                location: data.location,
                imageUrl: data.imageUrl ?? null,
                imagePublicId: (data as any).imagePublicId ?? null,
                isPaidEvent: data.isPaidEvent ?? false,
                isPublished: data.isPublished ?? false,
            })
            .returning();

        return NextResponse.json({ event: row }, { status: 201 });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
