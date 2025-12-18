import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireAdminUser() {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id: string; role?: string } | undefined;

    if (!user || user.role !== "ADMIN") {
        throw new Error("UNAUTHORIZED");
    }

    return user;
}
