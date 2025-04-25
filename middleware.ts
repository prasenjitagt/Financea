import { getServerSession } from "next-auth";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname, origin } = req.nextUrl;

        const token = req.nextauth.token;




        // If user is authenticated, redirect them away from login/signup
        if (["/login", "/signup"].includes(pathname)) {
            return NextResponse.redirect(origin); // Redirect to the homepage or the original page
        }

        // If the user isn't authenticated, allow access to the login/signup pages
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                return !!token; // Return true if the token is valid
            },
        },
        pages: {
            signIn: "/login", // Redirect to `/login` if unauthorized
        },
    }
);

export const config = {
    matcher: [
        "/",
        "/settings/:path*",
        "/invoices/:path*",
        "/expenses/:path*",
        "/clients/:path*",
        "/reports/:path*",
        "/login/:path*",
        "/signup/:path*",
    ],
};
