//app/api/payment_requests/route.ts

import connectDB from "@/lib/database/db_connection";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "../auth/[...nextauth]/options";
import InvoiceModel from "@/lib/models/Invoice.model";
import { NextResponse } from "next/server";

// GET Handler
export async function GET() {
    try {
        // Connect to the database
        await connectDB("api/invoices/route.ts");

        // Get the session of the current user
        const session = await getServerSession(FinanceaAuthOptions);
        if (!session) {
            console.log("Unauthorized");
            throw new Error("Unauthorized");
        }

        // Get the user ID from the session
        const userId = session.user._id;

        // Fetch the last 6 invoices for the authenticated user
        const invoices = await InvoiceModel.find({ user: userId })
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .limit(8); // Limit the results to 6 invoices

        if (!invoices || invoices.length === 0) {
            return NextResponse.json({ message: "No invoices found" }, { status: 404 });
        }

        return NextResponse.json(invoices, { status: 200 });
    } catch (error: any) {
        console.error("Invoice Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
