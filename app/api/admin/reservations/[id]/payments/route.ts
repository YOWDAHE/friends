import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { payments, reservations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { createPaymentSchema } from "@/lib/validation/paymentValidation";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
    try {
        await requireAdminUser();
        const { id } = await params;
        const reservationId = Number(id);

        const rows = await db
            .select()
            .from(payments)
            .where(eq(payments.reservationId, reservationId))
            .orderBy(desc(payments.createdAt));

        return NextResponse.json({ payments: rows });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: RouteContext) {
    try {
        await requireAdminUser();
        const { id } = await params;
        const reservationId = Number(id);

        const json = await req.json();
        const parsed = createPaymentSchema.safeParse({
            ...json,
            reservationId,
        });

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const data = parsed.data;

        const [row] = await db
            .insert(payments)
            .values({
                reservationId: data.reservationId ?? reservationId,
                eventId: data.eventId ?? null,
                amount: data.amount,
                currency: data.currency ?? "USD",
                status: data.status ?? "PENDING",
                provider: data.provider ?? "stripe",
                providerPaymentId: data.providerPaymentId ?? null,
                providerClientSecret: data.providerClientSecret ?? null,
                source: data.source ?? "online",
                description: data.description ?? null,
            })
            .returning();

        return NextResponse.json({ payment: row }, { status: 201 });
    } catch (e) {
        if ((e as Error).message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
