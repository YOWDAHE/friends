import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";

const contactSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    phone: z.string().trim().optional().nullable(),
    subject: z.string().trim().optional().nullable(),
    message: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const json = await req.json();
        const parsed = contactSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation error", details: z.treeifyError(parsed.error) },
                { status: 400 },
            );
        }

        const data = parsed.data;
        await db.insert(contactMessages).values({
            name: data.name,
            email: data.email,
            phone: data.phone ?? null,
            subject: data.subject ?? null,
            message: data.message,
        });

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (e) {
        console.error("Error saving contact message", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
