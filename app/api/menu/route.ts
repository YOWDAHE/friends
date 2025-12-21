import { NextResponse } from "next/server";
import { db } from "@/db";
import { menuCategories, menuSections, menuItems } from "@/db/schema";
import { eq, and, asc, inArray, } from "drizzle-orm";

export async function GET() {
    try {
        // load active categories
        const categories = await db
            .select()
            .from(menuCategories)
            .where(eq(menuCategories.isActive, true))
            .orderBy(asc(menuCategories.sortOrder));

        const categoryIds = categories.map((c) => c.id);
        if (!categoryIds.length) {
            return NextResponse.json({ categories: [] });
        }

        const sections = await db
            .select()
            .from(menuSections)
            .where(
                and(
                    inArray(menuSections.categoryId, categoryIds),
                    eq(menuSections.isActive, true),
                ),
            )
            .orderBy(asc(menuSections.sortOrder));

        const sectionIds = sections.map((s) => s.id);

        const items = sectionIds.length
            ? await db
                .select()
                .from(menuItems)
                .where(
                    and(
                        inArray(menuItems.sectionId, sectionIds),
                        eq(menuItems.isVisible, true),
                    ),
                )
                .orderBy(asc(menuItems.sortOrder))
            : [];

        const itemsBySection: Record<number, typeof items> = {};
        for (const item of items) {
            if (!itemsBySection[item.sectionId]) itemsBySection[item.sectionId] = [];
            itemsBySection[item.sectionId].push(item);
        }

        const sectionsByCategory: Record<number, any[]> = {};
        for (const section of sections) {
            const secItems = itemsBySection[section.id] ?? [];
            const uiItems = secItems.map((i) => ({
                id: i.id,
                name: i.name,
                description: i.description,
                price: parseFloat(i.price), // number for formatPrice
            }));

            const uiSection = {
                id: section.id,
                title: section.name,
                image: section.imageUrl,
                imagePosition: section.imagePosition,
                items: uiItems,
            };

            if (!sectionsByCategory[section.categoryId]) {
                sectionsByCategory[section.categoryId] = [];
            }
            sectionsByCategory[section.categoryId].push(uiSection);
        }

        const uiCategories = categories.map((c) => ({
            id: String(c.id),
            name: c.name,
            tagline: c.tagline,
            sections: sectionsByCategory[c.id] ?? [],
        }));

        return NextResponse.json({ categories: uiCategories });
    } catch (e) {
        console.error("Error loading menu", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
