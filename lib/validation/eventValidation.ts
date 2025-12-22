import { z } from "zod";

// Common helpers
const isoDateString = z
    .string()
    .refine((val) => !Number.isNaN(Date.parse(val)), { message: "Invalid date" });

const isoDateOnly = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date (YYYY-MM-DD)");

const isoTimeOnly = z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid time (HH:MM)");

export const createEventSchema = z
    .object({
        title: z.string().min(1, "Title is required"),
        subtitle: z.string().trim().optional().nullable(),
        description: z.string().trim().optional().nullable(),

        startDate: isoDateOnly,
        endDate: isoDateOnly,
        startTime: isoTimeOnly,
        endTime: isoTimeOnly,

        location: z.string().min(1, "Location is required"),
        imageUrl: z.string().url("Invalid URL").optional().nullable(),
        imagePublicId: z.string().trim().optional().nullable(),
        isPaidEvent: z.boolean().optional().default(false),
        isPublished: z.boolean().optional().default(false),
    })
    .refine(
        (val) => new Date(val.startDate) <= new Date(val.endDate),
        { path: ["endDate"], message: "End date must be after or equal to start date" },
    );


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
