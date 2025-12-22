import { db } from "@/db";
import {
    events,
    reservations,
    menuItems,
    menuCategories,
    contactMessages,
} from "@/db/schema";
import { and, gte, lte, sql, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
    );

    const startOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay(),
    );
    const endOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay() + 7,
    );

    // Next upcoming published event
    const [nextEvent] = await db
        .select()
        .from(events)
        .where(and(eq(events.isPublished, true), gte(events.startDate, startOfToday)))
        .orderBy(events.startDate)
        .limit(1);

    const nextEventFormatted = nextEvent
        ? {
            title: nextEvent.title,
            dateLabel: new Date(nextEvent.startDate).toLocaleString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }),
        }
        : null;

    // Today reservations
    const [todayAgg] =
        (await db
            .select({
                reservationsCount: sql<number>`COUNT(*)`,
                totalGuests: sql<number>`COALESCE(SUM(${reservations.partySize}), 0)`,
            })
            .from(reservations)
            .where(
                and(
                    gte(reservations.createdAt, startOfToday),
                    lte(reservations.createdAt, endOfToday),
                ),
            )) ?? [{ reservationsCount: 0, totalGuests: 0 }];

    // This week reservations
    const [weekAgg] =
        (await db
            .select({
                reservationsCount: sql<number>`COUNT(*)`,
                totalGuests: sql<number>`COALESCE(SUM(${reservations.partySize}), 0)`,
            })
            .from(reservations)
            .where(
                and(
                    gte(reservations.createdAt, startOfWeek),
                    lte(reservations.createdAt, endOfWeek),
                ),
            )) ?? [{ reservationsCount: 0, totalGuests: 0 }];

    // Menu stats
    const [itemsAgg] =
        (await db
            .select({
                itemsCount: sql<number>`COUNT(*)`,
            })
            .from(menuItems)) ?? [{ itemsCount: 0 }];

    const [categoriesAgg] =
        (await db
            .select({
                categoriesCount: sql<number>`COUNT(*)`,
            })
            .from(menuCategories)) ?? [{ categoriesCount: 0 }];

    // New contact messages (not archived)
    const [contactAgg] =
        (await db
            .select({
                newMessagesCount: sql<number>`COUNT(*)`,
            })
            .from(contactMessages)
            .where(eq(contactMessages.isArchived, false))) ?? [{ newMessagesCount: 0 }];

    return NextResponse.json({
        nextEvent: nextEventFormatted,
        today: {
            reservationsCount: Number(todayAgg.reservationsCount ?? 0),
            totalGuests: Number(todayAgg.totalGuests ?? 0),
        },
        thisWeek: {
            reservationsCount: Number(weekAgg.reservationsCount ?? 0),
            totalGuests: Number(weekAgg.totalGuests ?? 0),
        },
        menu: {
            itemsCount: Number(itemsAgg.itemsCount ?? 0),
            categoriesCount: Number(categoriesAgg.categoriesCount ?? 0),
        },
        contacts: {
            newMessagesCount: Number(contactAgg.newMessagesCount ?? 0),
        },
    });
}
