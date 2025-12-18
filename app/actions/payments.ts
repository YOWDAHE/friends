"use server";

import { db } from "@/db";
import { payments } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// ========
// Payments
// ========

export async function getPayments() {
	return db.select().from(payments).orderBy(desc(payments.createdAt));
}

export async function getPaymentsForReservation(reservationId: number) {
	return db
		.select()
		.from(payments)
		.where(eq(payments.reservationId, reservationId))
		.orderBy(desc(payments.createdAt));
}

export type CreatePaymentInput = {
	reservationId?: number | null;
	eventId?: number | null;
	amount: string; // numeric as string
	currency?: string;
	status?: "PENDING" | "REQUIRES_ACTION" | "SUCCEEDED" | "FAILED" | "REFUNDED";
	provider?: string;
	providerPaymentId?: string | null;
	providerClientSecret?: string | null;
	source?: string;
	description?: string | null;
};

export async function createPayment(input: CreatePaymentInput) {
	const [payment] = await db
		.insert(payments)
		.values({
			reservationId: input.reservationId ?? null,
			eventId: input.eventId ?? null,
			amount: input.amount,
			currency: input.currency ?? "USD",
			status: input.status ?? "PENDING",
			provider: input.provider ?? "stripe",
			providerPaymentId: input.providerPaymentId ?? null,
			providerClientSecret: input.providerClientSecret ?? null,
			source: input.source ?? "online",
			description: input.description ?? null,
		})
		.returning();
	return payment;
}

export async function updatePaymentStatus(
	id: number,
	status: "PENDING" | "REQUIRES_ACTION" | "SUCCEEDED" | "FAILED" | "REFUNDED"
) {
	const [payment] = await db
		.update(payments)
		.set({ status })
		.where(eq(payments.id, id))
		.returning();
	return payment ?? null;
}
