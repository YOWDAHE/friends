import { db } from "@/db";
import { staffSettings } from "@/db/schema";

export async function isStaffEnabled() {
    const rows = await db
        .select({ enabled: staffSettings.isEnabled })
        .from(staffSettings)
        .limit(1);

    if (!rows.length) return false;
    return rows[0].enabled;
}
