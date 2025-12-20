import { z } from "zod";

export const createCategorySchema = z.object({
    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and dashes"),
    name: z.string().min(1, "Name is required"),
    tagline: z.string().trim().optional().nullable(),
    sortOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
    id: z.number().int().positive(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const createSectionSchema = z.object({
    categoryId: z.number().int().positive(),
    slug: z
        .string()
        .min(1)
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and dashes"),
    name: z.string().min(1, "Name is required"),
    imageUrl: z.string().url("Invalid URL").optional().nullable(),
    imagePublicId: z.string().trim().optional().nullable(),
    imagePosition: z.enum(["left", "right"]).optional().default("left"),
    sortOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
});

export const updateSectionSchema = createSectionSchema.partial().extend({
    id: z.number().int().positive(),
});

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;

export const createMenuItemSchema = z.object({
    sectionId: z.number().int().positive(),
    name: z.string().min(1, "Name is required"),
    price: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid amount"),
    description: z.string().trim().optional().nullable(),
    isVisible: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
    isFeatured: z.boolean().optional(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial().extend({
    id: z.number().int().positive(),
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
