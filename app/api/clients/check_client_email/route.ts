// api/clients/check_client_email.ts

import { NextRequest, NextResponse } from "next/server";
import { FinanceaAuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/database/db_connection";
import { Client } from "@/lib/models/Clients.model";

export async function GET(req: NextRequest) {
    try {
        await connectDB("api/clients/check_client_email.ts");

        const session = await getServerSession(FinanceaAuthOptions);
        if (!session) {
            console.log("Unauthorized");

            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user._id;
        const { searchParams } = new URL(req.url);
        const ClientEmail = searchParams.get("email");

        if (!ClientEmail) {
            return NextResponse.json({ error: "Missing Email ID" }, { status: 400 });
        }

        // ❗ Now check Email + userId
        const existingEmail = await Client.findOne({
            email: ClientEmail,
            user: userId,
        });

        if (existingEmail) {
            return NextResponse.json({ exists: true }, { status: 200 });
        } else {
            return NextResponse.json({ exists: false }, { status: 200 });
        }

    } catch (error) {
        console.error("Error checking Client Email ID:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

