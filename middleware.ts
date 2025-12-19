import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_PREFIX = "/admin";
const ADMIN_LOGIN_PATH = "/admin/login";

export async function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl;

    // Only guard /admin routes
    if (!pathname.startsWith(ADMIN_PREFIX)) {
        return NextResponse.next();
    }

    // Do NOT guard the login page itself
    if (pathname === ADMIN_LOGIN_PATH) {
        return NextResponse.next();
    }

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const role = (token as any)?.role;
    console.log("The token: ", token)

    if (!token || role !== "ADMIN") {
        const url = req.nextUrl.clone();
        url.pathname = ADMIN_LOGIN_PATH;

        // Only set callbackUrl once; if it already exists, keep it
        if (!searchParams.get("callbackUrl")) {
            url.searchParams.set(
                "callbackUrl",
                req.nextUrl.pathname + req.nextUrl.search,
            );
        }

        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
