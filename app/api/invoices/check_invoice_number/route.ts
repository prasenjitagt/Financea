// api/invoices/check_invoice_number.ts

import { NextRequest, NextResponse } from "next/server";
import { FinanceaAuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/database/db_connection";
import InvoiceModel from "@/lib/models/Invoice.model";

export async function GET(req: NextRequest) {
    try {
        await connectDB("api/invoices/check_invoice_number.ts");

        const session = await getServerSession(FinanceaAuthOptions);
        if (!session) {
            console.log("Unauthorized");

            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user._id;
        const { searchParams } = new URL(req.url);
        const invoiceNumber = searchParams.get("invoiceNumber");

        if (!invoiceNumber) {
            return NextResponse.json({ error: "Missing invoice number" }, { status: 400 });
        }

        // ❗ Now check invoiceNumber + userId
        const existingInvoice = await InvoiceModel.findOne({
            invoiceNumber,
            user: userId, // must match this user's invoices only
        });

        if (existingInvoice) {
            return NextResponse.json({ exists: true }, { status: 200 });
        } else {
            return NextResponse.json({ exists: false }, { status: 200 });
        }

    } catch (error) {
        console.error("Error checking invoice number:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

