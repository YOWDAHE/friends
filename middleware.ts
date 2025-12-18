import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_PREFIX = "/admin";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only guard /admin routes
    if (!pathname.startsWith(ADMIN_PREFIX)) {
        return NextResponse.next();
    }

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const role = (token as any)?.role;

    if (!token || role !== "ADMIN") {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
