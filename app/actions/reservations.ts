"use server";

import { db } from "@/db";
import {
	reservations,
	reservationTickets,
	tickets,
	events,
	payments,
} from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// ==============
// Reservations
// ==============

export async function getReservations() {
	return db
		.select({
			reservation: reservations,
			event: events,
		})
		.from(reservations)
		.leftJoin(events, eq(reservations.eventId, events.id))
		.orderBy(desc(reservations.createdAt));
}

export async function getReservationsForEvent(eventId: number) {
	return db
		.select({
			reservation: reservations,
			event: events,
		})
		.from(reservations)
		.leftJoin(events, eq(reservations.eventId, events.id))
		.where(eq(reservations.eventId, eventId))
		.orderBy(desc(reservations.createdAt));
}

export async function getReservationById(id: number) {
	const [row] = await db
		.select({
			reservation: reservations,
			event: events,
		})
		.from(reservations)
		.leftJoin(events, eq(reservations.eventId, events.id))
		.where(eq(reservations.id, id))
		.limit(1);
	return row ?? null;
}

export type CreateReservationInput = {
	eventId?: number | null;
	name: string;
	email: string;
	phone: string;
	partySize: number;
	notes?: string | null;
};

export async function createReservation(input: CreateReservationInput) {
	const [reservation] = await db
		.insert(reservations)
		.values({
			eventId: input.eventId ?? null,
			name: input.name,
			email: input.email,
			phone: input.phone,
			partySize: input.partySize,
			notes: input.notes ?? null,
		})
		.returning();
	return reservation;
}

export async function updateReservationStatus(
	id: number,
	status: "PENDING" | "CONFIRMED" | "CANCELLED"
) {
	const [reservation] = await db
		.update(reservations)
		.set({ status })
		.where(eq(reservations.id, id))
		.returning();
	return reservation ?? null;
}

// ==============
// Reservation Tickets
// ==============

export async function getTicketsForReservation(reservationId: number) {
	return db
		.select({
			line: reservationTickets,
			ticket: tickets,
		})
		.from(reservationTickets)
		.leftJoin(tickets, eq(reservationTickets.ticketId, tickets.id))
		.where(eq(reservationTickets.reservationId, reservationId));
}

export type CreateReservationTicketInput = {
	reservationId: number;
	ticketId: number;
	quantity: number;
	unitPrice: string; // numeric
};

export async function addTicketToReservation(
	input: CreateReservationTicketInput
) {
	const total = (Number(input.unitPrice) * Number(input.quantity)).toFixed(2);

	const [row] = await db
		.insert(reservationTickets)
		.values({
			reservationId: input.reservationId,
			ticketId: input.ticketId,
			quantity: input.quantity,
			unitPrice: input.unitPrice,
			totalPrice: total,
		})
		.returning();
	return row;
}
