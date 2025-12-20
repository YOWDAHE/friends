import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { tickets } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { createTicketSchema } from "@/lib/validation/eventValidation";
import { z } from "zod";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
    try {
        await requireAdminUser();
        const { id } = await params;
        const eventId = Number(id);

        const rows = await db
            .select()
            .from(tickets)
            .where(eq(tickets.eventId, eventId))
            .orderBy(asc(tickets.sortOrder), asc(tickets.id));

        return NextResponse.json({ tickets: rows });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
    try {
        await requireAdminUser();
        const { id } = await params;
        const eventId = Number(id);

        const json = await req.json();

        // validate array of tickets, injecting eventId for each
        const parsedArray = z
            .array(createTicketSchema)
            .safeParse(
                (json as any[]).map((t, index) => ({
                    ...t,
                    eventId,
                    sortOrder: t.sortOrder ?? index,
                })),
            );

        if (!parsedArray.success) {
            return NextResponse.json(
                { error: "Validation error", details: parsedArray.error.flatten() },
                { status: 400 },
            );
        }

        const data = parsedArray.data;

        // simplest: delete all tickets for event and reinsert
        await db.delete(tickets).where(eq(tickets.eventId, eventId));

        if (!data.length) {
            return NextResponse.json({ tickets: [] });
        }

        const rows = await db
            .insert(tickets)
            .values(
                data.map((t) => ({
                    eventId,
                    name: t.name,
                    description: t.description ?? null,
                    price: t.price,
                    capacity: t.capacity ?? null,
                    sortOrder: t.sortOrder ?? 0,
                    isActive: t.isActive ?? true,
                    category: t.category ?? null,
                    salesStart: t.salesStart ? new Date(t.salesStart) : null,
                    salesEnd: t.salesEnd ? new Date(t.salesEnd) : null,
                    minPerOrder: t.minPerOrder ?? null,
                    maxPerOrder: t.maxPerOrder ?? null,
                    internalNotes: t.internalNotes ?? null,
                })),
            )
            .returning();

        return NextResponse.json({ tickets: rows });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
