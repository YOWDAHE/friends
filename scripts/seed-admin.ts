import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
    const adminEmail = "admin@friends.local";
    const adminPassword = process.env.ADMIN_PASSWORD ?? "AdminPassword123!";

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, adminEmail))
        .limit(1);

    if (existing.length > 0) {
        console.log("✔ Admin already exists");
        return;
    }

    await db.insert(users).values({
        email: adminEmail,
        name: "Site Admin",
        passwordHash,
        role: "ADMIN",
        isActive: true,
    });

    console.log("✔ Admin user created");
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
