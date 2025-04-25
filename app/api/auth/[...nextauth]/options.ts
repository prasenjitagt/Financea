// app/api/auth/[...nextauth]/options.ts
import connectDB from "@/lib/database/db_connection";
import { loginSchema } from "@/lib/helpers/validations";
import User from "@/lib/models/User.model";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const FinanceaAuthOptions: NextAuthOptions = {
    providers: [
        Credentials({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" },
            },
            authorize: async (credentials) => {
                try {
                    const parsedCredentials = loginSchema.safeParse(credentials);
                    if (!parsedCredentials.success) {
                        console.error('Validation error:', parsedCredentials.error);
                        return null;
                    }

                    await connectDB();
                    const { email, password } = parsedCredentials.data;


                    const user = await User.findOne({ email }).select('+password');
                    if (!user) return null;

                    if (!user.password) {
                        console.error('No password set for user');
                        return null;
                    }

                    const isPasswordCorrect = await bcrypt.compare(password, user.password);
                    if (!isPasswordCorrect) return null;

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        username: user.username,
                        // Add any additional user fields needed
                    };
                } catch (error) {
                    console.error('Authentication error:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user.id;
                token.username = user.username;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.email = token.email;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login?error=auth", // Custom error page
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // Update daily
    },
    debug: process.env.NODE_ENV === 'development', // Enable debug in dev
};