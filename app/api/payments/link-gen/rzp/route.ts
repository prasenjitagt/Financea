//api/payments/link-gen/rzp/route.ts


import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getRzpCreds } from "./getRzpCreds";
import connectDB from "@/lib/database/db_connection";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "@/app/api/auth/[...nextauth]/options";

export interface PaymentPayloadType {
    amount: number;
    currency: "INR" | "USD";
    customerName: string;
    customerEmail: string;
    customerContact: number;
}

// Check and throw if env vars are missing (at startup itself)
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error("Missing Razorpay environment variables");
}

export async function POST(req: NextRequest) {
    try {

        await connectDB("api/payments/link-gen/rzp/route.ts");
        //get UserID from session
        const session = await getServerSession(FinanceaAuthOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user._id;

        //razorpay Credentials
        const rzpCreds = await getRzpCreds(userId);

        const body: PaymentPayloadType = await req.json();

        // Validate required fields
        const { amount, currency, customerName, customerEmail, customerContact } = body;

        if (!amount || !currency || !customerName || !customerEmail || !customerContact) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const expireBy = Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60; // Now + 3 days in seconds

        const contactString = customerContact.toString();

        const paymentLinkPayload = {
            amount,
            currency,
            description: "Payment for your order",
            customer: {
                name: customerName,
                email: customerEmail,
                contact: contactString, // Ensure contact is a string of exactly 10 digits
            },
            notify: {
                sms: true,
                email: true,
            },
            reminder_enable: true,
            notes: {
                source: "From Financea app",
            },
            expire_by: expireBy
        };


        const authHeader = Buffer.from(`${rzpCreds.keyId || RAZORPAY_KEY_ID}:${rzpCreds.keySecret || RAZORPAY_KEY_SECRET}`).toString("base64");

        const razorpayRes = await axios.post(
            "https://api.razorpay.com/v1/payment_links",
            paymentLinkPayload,
            {
                headers: {
                    Authorization: `Basic ${authHeader}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log(razorpayRes.status);


        return NextResponse.json(razorpayRes.data, { status: 200 });

    } catch (error) {
        console.log("Error Creating Razorpay Payment Link:", error);

        return NextResponse.json({
            message: "Error Creating Razorpay Payment Link",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 }) // 500 is more appropriate for server errors
    }
}
