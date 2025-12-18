"use server";

import { db } from "@/db";
import { menuCategories, menuSections, menuItems } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

// ============
// Categories
// ============

export async function getMenuCategories() {
    return db
        .select()
        .from(menuCategories)
        .orderBy(asc(menuCategories.sortOrder), asc(menuCategories.id));
}

export type CreateCategoryInput = {
    slug: string;
    name: string;
    tagline?: string | null;
    sortOrder?: number;
    isActive?: boolean;
};

export async function createMenuCategory(input: CreateCategoryInput) {
    const [row] = await db
        .insert(menuCategories)
        .values({
            slug: input.slug,
            name: input.name,
            tagline: input.tagline ?? null,
            sortOrder: input.sortOrder ?? 0,
            isActive: input.isActive ?? true,
        })
        .returning();
    return row;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput> & {
    id: number;
};

export async function updateMenuCategory(input: UpdateCategoryInput) {
    const { id, ...rest } = input;
    const [row] = await db
        .update(menuCategories)
        .set({
            ...(rest.slug !== undefined && { slug: rest.slug }),
            ...(rest.name !== undefined && { name: rest.name }),
            ...(rest.tagline !== undefined && { tagline: rest.tagline }),
            ...(rest.sortOrder !== undefined && { sortOrder: rest.sortOrder }),
            ...(rest.isActive !== undefined && { isActive: rest.isActive }),
        })
        .where(eq(menuCategories.id, id))
        .returning();
    return row ?? null;
}

export async function deleteMenuCategory(id: number) {
    await db.delete(menuCategories).where(eq(menuCategories.id, id));
}

// ============
// Sections
// ============

export async function getSectionsForCategory(categoryId: number) {
    return db
        .select()
        .from(menuSections)
        .where(eq(menuSections.categoryId, categoryId))
        .orderBy(asc(menuSections.sortOrder), asc(menuSections.id));
}

export type CreateSectionInput = {
    categoryId: number;
    slug: string;
    name: string;
    imageUrl?: string | null;
    imagePosition?: "left" | "right";
    sortOrder?: number;
    isActive?: boolean;
};

export async function createMenuSection(input: CreateSectionInput) {
    const [row] = await db
        .insert(menuSections)
        .values({
            categoryId: input.categoryId,
            slug: input.slug,
            name: input.name,
            imageUrl: input.imageUrl ?? null,
            imagePosition: input.imagePosition ?? "left",
            sortOrder: input.sortOrder ?? 0,
            isActive: input.isActive ?? true,
        })
        .returning();
    return row;
}

export type UpdateSectionInput = Partial<CreateSectionInput> & {
    id: number;
};

export async function updateMenuSection(input: UpdateSectionInput) {
    const { id, ...rest } = input;
    const [row] = await db
        .update(menuSections)
        .set({
            ...(rest.slug !== undefined && { slug: rest.slug }),
            ...(rest.name !== undefined && { name: rest.name }),
            ...(rest.imageUrl !== undefined && { imageUrl: rest.imageUrl }),
            ...(rest.imagePosition !== undefined && {
                imagePosition: rest.imagePosition,
            }),
            ...(rest.sortOrder !== undefined && { sortOrder: rest.sortOrder }),
            ...(rest.isActive !== undefined && { isActive: rest.isActive }),
        })
        .where(eq(menuSections.id, id))
        .returning();
    return row ?? null;
}

export async function deleteMenuSection(id: number) {
    await db.delete(menuSections).where(eq(menuSections.id, id));
}

// ============
// Items
// ============

export async function getItemsForSection(sectionId: number) {
    return db
        .select()
        .from(menuItems)
        .where(eq(menuItems.sectionId, sectionId))
        .orderBy(asc(menuItems.sortOrder), asc(menuItems.id));
}

export type CreateMenuItemInput = {
    sectionId: number;
    name: string;
    price: string; // numeric
    description?: string | null;
    isVisible?: boolean;
    sortOrder?: number;
    isFeatured?: boolean;
};

export async function createMenuItem(input: CreateMenuItemInput) {
    const [row] = await db
        .insert(menuItems)
        .values({
            sectionId: input.sectionId,
            name: input.name,
            price: input.price,
            description: input.description ?? null,
            isVisible: input.isVisible ?? true,
            sortOrder: input.sortOrder ?? 0,
            isFeatured: input.isFeatured ?? false,
        })
        .returning();
    return row;
}

export type UpdateMenuItemInput = Partial<CreateMenuItemInput> & {
    id: number;
};

export async function updateMenuItem(input: UpdateMenuItemInput) {
    const { id, ...rest } = input;
    const [row] = await db
        .update(menuItems)
        .set({
            ...(rest.name !== undefined && { name: rest.name }),
            ...(rest.price !== undefined && { price: rest.price }),
            ...(rest.description !== undefined && { description: rest.description }),
            ...(rest.isVisible !== undefined && { isVisible: rest.isVisible }),
            ...(rest.sortOrder !== undefined && { sortOrder: rest.sortOrder }),
            ...(rest.isFeatured !== undefined && { isFeatured: rest.isFeatured }),
        })
        .where(eq(menuItems.id, id))
        .returning();
    return row ?? null;
}

export async function deleteMenuItem(id: number) {
    await db.delete(menuItems).where(eq(menuItems.id, id));
}
