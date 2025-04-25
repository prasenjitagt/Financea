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
                        throw new Error("Zod Schema Validation error at AuthOptions");
                    }

                    await connectDB("api/clients/stats/route.ts");
                    const { email, password } = parsedCredentials.data;

                    const user = await User.findOne({ email }).select('+password');
                    if (!user) throw new Error("No such user");

                    if (!user.password) {
                        console.error('No password set for user');
                        throw new Error("No password set for user");
                    }

                    const isPasswordCorrect = await bcrypt.compare(password, user.password);

                    if (!isPasswordCorrect) throw new Error("Invalid email or password");

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        username: user.username, // Only return username and other required fields
                    };
                } catch (error) {
                    console.error('Authentication error:', error);
                    return null;
                }
            }

        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.name = user.username;
                token.picture = "noimage"
                token._id = user.id;
                token.username = user.username;
                token.email = user.email;
                // console.log("JWT token created:", token);  // Log for debugging
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.image = "no image";
                session.user.name = token.username;
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.email = token.email;
                // console.log("Session data:", session);  // Log for debugging
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
        newUser: "/",
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // Update daily
    },
    debug: process.env.NODE_ENV === 'development', // Enable debug in dev
};