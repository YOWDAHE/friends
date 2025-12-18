import { z } from "zod";

export const createReservationSchema = z.object({
    eventId: z.number().int().positive().optional().nullable(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(5, "Phone is required"),
    partySize: z.number().int().min(1, "Party size must be at least 1"),
    notes: z.string().trim().optional().nullable(),
});

export const updateReservationStatusSchema = z.object({
    id: z.number().int().positive(),
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationStatusInput = z.infer<
    typeof updateReservationStatusSchema
>;

// Reservation tickets
export const addReservationTicketSchema = z.object({
    reservationId: z.number().int().positive(),
    ticketId: z.number().int().positive(),
    quantity: z.number().int().min(1),
    unitPrice: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "Unit price must be a valid amount"),
});

export type AddReservationTicketInput = z.infer<
    typeof addReservationTicketSchema
>;
