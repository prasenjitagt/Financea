import { createInvoiceFormType, createInvoiceZodSchema } from "@/lib/zod/create_invoice_zod_schema";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { CreatePaymentLinkInput, createRazorpayPaymentLink } from "@/lib/helpers/payments/createRazorpayPaymentLink";
import { getRzpCreds } from "../../payments/link-gen/rzp/getRzpCreds";
import connectDB from "@/lib/database/db_connection";
import InvoiceModel from "@/lib/models/Invoice.model";
import mongoose from "mongoose"; // required for ObjectId
import { RazorpayPaymentLinkResponseType } from "@/lib/types";

export async function POST(req: NextRequest) {
    try {
        await connectDB("api/invoices/create_invoice/route.ts");

        //get UserID from session
        const session = await getServerSession(FinanceaAuthOptions);
        if (!session) {
            console.log("Unauthorized");
            throw new Error("Unauthorized");
        }
        const userId = session.user._id;

        const body: createInvoiceFormType = await req.json();

        // ✅ Convert string dates into Date objects manually
        if (body.issueDate) body.issueDate = new Date(body.issueDate);
        if (body.dueDate) body.dueDate = new Date(body.dueDate);
        if (body.recurringIssueDate) body.recurringIssueDate = new Date(body.recurringIssueDate);
        if (body.recurringDueDate) body.recurringDueDate = new Date(body.recurringDueDate);

        const parsedInvoiceData = createInvoiceZodSchema.safeParse(body);

        if (!parsedInvoiceData.success) {

            console.log("Zod Error", parsedInvoiceData.error.errors);

            return NextResponse.json(
                { message: "Invoice Schema Mismatch", error: parsedInvoiceData.error.errors },
                { status: 400 }
            );
        }


        const rzpCreds = await getRzpCreds(userId);

        const { clientId,
            discountPercent,
            invoiceNumber,
            isRecurring,
            issueDate,
            items,
            taxPercent,
            discountAmount,
            dueDate,
            note,
            recurringDueDate,
            recurringFrequency,
            recurringIssueDate,
            subTotal,
            taxAmount,
            terms,
            totalAmount,
            clientName,
            clientEmail,
            clientMobile,
            currency
        } = parsedInvoiceData.data;

        const amountInPaise = Math.trunc(totalAmount! * 100);



        const razorpayPayload: CreatePaymentLinkInput = {
            amount: amountInPaise,
            currency: "INR",
            customerName: clientName,
            customerEmail: clientEmail,
            customerContact: clientMobile,
            keyId: rzpCreds.keyId!,
            keySecret: rzpCreds.keySecret!,
        }

        const razorpayResponseData: RazorpayPaymentLinkResponseType = await createRazorpayPaymentLink(razorpayPayload);

        if (razorpayResponseData) {
            console.log("Payment Link Created Successfully!");
            // console.log(razorpayResponseData.id);

        }

        // Prepare final payload for MongoDB
        const createInvoicePayload = {
            user: new mongoose.Types.ObjectId(userId),
            client: new mongoose.Types.ObjectId(clientId),
            invoiceNumber: invoiceNumber,
            issueDate: issueDate,
            dueDate: dueDate,

            clientEmail: clientEmail,
            clientName: clientName,
            clientMobile: clientMobile,

            isRecurring: isRecurring,
            recurringFrequency: recurringFrequency,
            recurringIssueDate: recurringIssueDate,
            recurringDueDate: recurringDueDate,

            items: items.map(item => ({
                ishourly: item.ishourly,
                name: item.name,
                quantity: item.quantity,
                rate: item.rate,
            })),

            note: note || "No Note",
            terms: terms || "No Terms",

            discountPercent: discountPercent,
            taxPercent: taxPercent,

            isPaid: false,
            paymentId: razorpayResponseData.id,

            subTotal: subTotal,
            discountAmount: discountAmount,
            taxAmount: taxAmount,
            totalAmount: totalAmount,
            currency: currency

        };

        // Finally create in MongoDB
        const newInvoice = await InvoiceModel.create(createInvoicePayload);

        // console.log(newInvoice);


        return NextResponse.json({ message: "Invoice Created Successfully", invoice: newInvoice }, { status: 200 });

    }
    catch (error) {
        console.log("Error Creating Invoice:", error);

        return NextResponse.json({
            message: "Failed to Create Invoice",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 501 }) // 500 is more appropriate for server errors
    }
}
