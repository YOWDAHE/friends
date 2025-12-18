"use server";

import { db } from "@/db";
import {
	events,
	reservations,
	tickets,
	reservationTickets,
	payments,
} from "@/db/schema";
import { and, desc, eq, gt } from "drizzle-orm";

// =========
// Events
// =========

export async function getUpcomingEvents() {
	const now = new Date();
	return db
		.select()
		.from(events)
		.where(gt(events.dateTime, now))
		.orderBy(events.dateTime);
}

export async function getAllEvents() {
	return db.select().from(events).orderBy(desc(events.createdAt));
}

export async function getEventById(id: number) {
	const [event] = await db
		.select()
		.from(events)
		.where(eq(events.id, id))
		.limit(1);
	return event ?? null;
}

export type CreateEventInput = {
	title: string;
	subtitle?: string | null;
	description?: string | null;
	dateTime: Date;
	location: string;
	imageUrl?: string | null;
	isPaidEvent?: boolean;
	isPublished?: boolean;
};

export async function createEvent(input: CreateEventInput) {
	const [event] = await db
		.insert(events)
		.values({
			title: input.title,
			subtitle: input.subtitle ?? null,
			description: input.description ?? null,
			dateTime: input.dateTime,
			location: input.location,
			imageUrl: input.imageUrl ?? null,
			isPaidEvent: input.isPaidEvent ?? false,
			isPublished: input.isPublished ?? false,
		})
		.returning();
	return event;
}

export type UpdateEventInput = Partial<CreateEventInput> & { id: number };

export async function updateEvent(input: UpdateEventInput) {
	const { id, ...rest } = input;
	const [event] = await db
		.update(events)
		.set({
			...(rest.title !== undefined && { title: rest.title }),
			...(rest.subtitle !== undefined && { subtitle: rest.subtitle }),
			...(rest.description !== undefined && { description: rest.description }),
			...(rest.dateTime !== undefined && { dateTime: rest.dateTime }),
			...(rest.location !== undefined && { location: rest.location }),
			...(rest.imageUrl !== undefined && { imageUrl: rest.imageUrl }),
			...(rest.isPaidEvent !== undefined && { isPaidEvent: rest.isPaidEvent }),
			...(rest.isPublished !== undefined && {
				isPublished: rest.isPublished,
			}),
		})
		.where(eq(events.id, id))
		.returning();
	return event ?? null;
}

export async function deleteEvent(id: number) {
	await db.delete(events).where(eq(events.id, id));
}

// =========
// Tickets
// =========

export async function getTicketsForEvent(eventId: number) {
	return db
		.select()
		.from(tickets)
		.where(eq(tickets.eventId, eventId))
		.orderBy(tickets.sortOrder);
}

export type CreateTicketInput = {
	eventId: number;
	name: string;
	description?: string | null;
	price: string; // numeric as string, e.g. "24.99"
	capacity?: number | null;
	sortOrder?: number;
	isActive?: boolean;
};

export async function createTicket(input: CreateTicketInput) {
	const [ticket] = await db
		.insert(tickets)
		.values({
			eventId: input.eventId,
			name: input.name,
			description: input.description ?? null,
			price: input.price,
			capacity: input.capacity ?? null,
			sortOrder: input.sortOrder ?? 0,
			isActive: input.isActive ?? true,
		})
		.returning();
	return ticket;
}

export type UpdateTicketInput = Partial<CreateTicketInput> & { id: number };

export async function updateTicket(input: UpdateTicketInput) {
	const { id, ...rest } = input;
	const [ticket] = await db
		.update(tickets)
		.set({
			...(rest.name !== undefined && { name: rest.name }),
			...(rest.description !== undefined && { description: rest.description }),
			...(rest.price !== undefined && { price: rest.price }),
			...(rest.capacity !== undefined && { capacity: rest.capacity }),
			...(rest.sortOrder !== undefined && { sortOrder: rest.sortOrder }),
			...(rest.isActive !== undefined && { isActive: rest.isActive }),
		})
		.where(eq(tickets.id, id))
		.returning();
	return ticket ?? null;
}

export async function deleteTicket(id: number) {
	await db.delete(tickets).where(eq(tickets.id, id));
}
