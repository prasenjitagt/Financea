import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const FinanceaAuthOptions: NextAuthOptions = {
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {}
            },
            authorize: async (credentials) => {
                // Mock user with required 'id' field
                const user = {
                    id: "1", // Required by NextAuth User type
                    email: "faltudimu@gmail.com",
                    password: "9366217407pP@",
                    name: "User Name" // Optional but recommended
                };

                if (credentials?.email === user.email &&
                    credentials.password === user.password) {
                    // Return only the necessary user data (without password)
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    };
                }
                return null;
            }
        })
    ],

};