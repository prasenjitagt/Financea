//api/financial_metrics/route.ts

import connectDB from "@/lib/database/db_connection";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";


// GET method to fetch all clients for a user
export async function GET() {
    try {
        await connectDB("api/clients/route.ts");

        //get UserID from session
        const session = await getServerSession(FinanceaAuthOptions);
        if (!session) {
            console.log("Unauthorized");
            throw new Error("Unauthorized");
        }
        const userId = session.user._id;



    } catch (error) {
        console.error("Error in fetching clients:", error);
        return NextResponse.json(
            { error: "Server Error" },
            { status: 500 }
        );
    }
}