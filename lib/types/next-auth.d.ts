// lib/types/next-auth.d.ts
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        username: string;
        email: string;
    }

    interface Session {
        user: {
            _id: string;
            username: string;
            email: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id: string;
        username: string;
        email: string;
    }
}