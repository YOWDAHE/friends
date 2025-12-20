import { z } from "zod";

// Common helpers
const isoDateString = z
    .string()
    .refine((val) => !Number.isNaN(Date.parse(val)), { message: "Invalid date" });

export const createEventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().trim().optional().nullable(),
    description: z.string().trim().optional().nullable(),
    dateTime: isoDateString,
    location: z.string().min(1, "Location is required"),
    imageUrl: z.string().url("Invalid URL").optional().nullable(),
    imagePublicId: z.string().trim().optional().nullable(),
    isPaidEvent: z.boolean().optional().default(false),
    isPublished: z.boolean().optional().default(false),
});

export const updateEventSchema = createEventSchema.partial().extend({
    id: z.number().int().positive(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

// Tickets
export const createTicketSchema = z.object({
    eventId: z.number().int().positive(),
    name: z.string().min(1, "Name is required"),
    description: z.string().trim().optional().nullable(),         // already compatible
    price: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "Price must be a number with up to 2 decimals"),
    capacity: z.number().int().min(1).optional().nullable(),
    sortOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
    // optional extras you may want:
    category: z.string().trim().optional().nullable(),
    salesStart: z.string().datetime().optional().nullable(),
    salesEnd: z.string().datetime().optional().nullable(),
    minPerOrder: z.number().int().min(1).optional().nullable(),
    maxPerOrder: z.number().int().min(1).optional().nullable(),
    internalNotes: z.string().trim().optional().nullable(),
});

export const updateTicketSchema = createTicketSchema.partial().extend({
    id: z.number().int().positive(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
