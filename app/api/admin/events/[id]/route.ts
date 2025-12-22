import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { eventAnalytics, events, payments, reservations, tickets } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { updateEventSchema } from "@/lib/validation/eventValidation";
import { deleteCloudinaryImage } from "@/lib/cloudinary";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
    try {
        const { id: idParam } = await params;
        const id = Number(idParam);

        const [event] = await db
            .select()
            .from(events)
            .where(eq(events.id, id));

        if (!event) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const eventTickets = await db
            .select()
            .from(tickets)
            .where(and(eq(tickets.eventId, id), eq(tickets.isActive, true)))
            .orderBy(tickets.sortOrder, tickets.id);

        return NextResponse.json({ event, tickets: eventTickets });
    } catch (e) {
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
                ...(rest.startDate !== undefined && { dateTime: new Date(rest.startDate) }),
                ...(rest.endDate !== undefined && { dateTime: new Date(rest.endDate) }),
                ...(rest.startTime !== undefined && { dateTime: new Date(rest.startTime) }),
                ...(rest.endTime !== undefined && { dateTime: new Date(rest.endTime) }),
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
        
        if (!existing) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const now = new Date();
        if (existing.startDate > now) {
            return NextResponse.json(
                { error: "Upcoming events cannot be deleted", code: "EVENT_NOT_PASSED" },
                { status: 400 },
            );
        }


        // before deleting event
        const [stats] = await db
            .select({
                totalRevenue: sql<number>`COALESCE(SUM(${payments.amount}), 0)`,
                totalReservations: sql<number>`COUNT(DISTINCT ${reservations.id})`,
                totalGuests: sql<number>`COALESCE(SUM(${reservations.partySize}), 0)`,
            })
            .from(reservations)
            .leftJoin(payments, eq(payments.reservationId, reservations.id))
            .where(eq(reservations.eventId, id));

        console.log("stats: ", stats)
        await db.insert(eventAnalytics).values({
            eventId: existing.id,
            title: existing.title,
            startDate: existing.startDate,
            endDate: existing.endDate,
            totalGuests: Number(stats.totalGuests ?? 0),
            totalReservations: Number(stats.totalReservations ?? 0),
            totalRevenue: stats.totalRevenue.toString() ?? "0",
        });


        // then delete -> cascades clean up operational tables
        await db.delete(events).where(eq(events.id, id));


        if (existing?.imagePublicId) {
            deleteCloudinaryImage(existing.imagePublicId);
        }
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("Error deleting event", e);
        if ((e as any).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // expose more info while debugging
        const err = e as any;
        return NextResponse.json(
            {
                error: "Server error",
                detail: {
                    message: err.message,
                    stack: err.stack,
                    cause: err.cause,
                },
            },
            { status: 500 },
        );
    }

}
