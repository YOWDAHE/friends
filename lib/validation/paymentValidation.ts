import { z } from "zod";

export const createPaymentSchema = z.object({
    reservationId: z.number().int().positive().optional().nullable(),
    eventId: z.number().int().positive().optional().nullable(),
    amount: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number"),
    currency: z.string().min(3).max(3).optional().default("USD"),
    status: z
        .enum(["PENDING", "REQUIRES_ACTION", "SUCCEEDED", "FAILED", "REFUNDED"])
        .optional()
        .default("PENDING"),
    provider: z.string().optional().default("stripe"),
    providerPaymentId: z.string().optional().nullable(),
    providerClientSecret: z.string().optional().nullable(),
    source: z.string().optional().default("online"),
    description: z.string().trim().optional().nullable(),
});

export const updatePaymentStatusSchema = z.object({
    id: z.number().int().positive(),
    status: z.enum([
        "PENDING",
        "REQUIRES_ACTION",
        "SUCCEEDED",
        "FAILED",
        "REFUNDED",
    ]),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
