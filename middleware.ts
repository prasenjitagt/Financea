// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
    function middleware(req: NextRequest) {
        const { pathname, origin } = req.nextUrl;

        // Redirect authenticated users away from auth pages
        if (["/login", "/signup"].includes(pathname)) {
            return NextResponse.redirect(origin);
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                // Simple check - is user authenticated?
                return !!token;
            },
        },
        pages: {
            signIn: "/login", // Custom login page
        },
    }
);

export const config = {
    matcher: [
        "/",
        "/expenses/:path*",
        "/invoices/:path*",
        "/payments/:path*",
        "/reports/:path*",
        "/settings/:path*",

    ],
};