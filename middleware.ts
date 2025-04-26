import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = await getToken({ req: request });

    // Define public and auth routes
    const publicRoutes = ["/login", "/signup"];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // 1. Redirect logged-in users from auth pages to homepage
    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // 2. Allow public routes to be accessed without token
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // 3. Protect all other routes
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/signup",
        "/settings/:path*",
        "/invoices/:path*",
        "/expenses/:path*",
        "/clients/:path*",
        "/reports/:path*",
    ],
};