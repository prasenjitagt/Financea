import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import RzpModel from "@/lib/models/Razorpay.model";
import { encrypt } from "@/lib/helpers/rpzCredsEncryption";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
    try {
        await connectDB("api/payments/pay-creds/rzp/route.ts");

        //get UserID from session
        const session = await getServerSession(FinanceaAuthOptions);

        if (!session) {
            console.log("Unauthorized");

            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user._id;

        const body = await req.json();
        const { keyId, keySecret } = body;

        if (!keyId || !keySecret) {
            return NextResponse.json({ message: "Key ID and Key Secret are required." }, { status: 400 });
        }

        const encryptedKeySecret = encrypt(keySecret);

        const result = await RzpModel.findOneAndUpdate(
            { userId: userId },
            { keyId, encryptedKeySecret },
            { upsert: true, new: true }
        );

        if (result) {
            console.log("Razorpay Payment Credentials saved successfully!");
        }


        return NextResponse.json({ message: "Credentials saved successfully!" }, { status: 201 });
    } catch (error: any) {
        console.error("Error Saving Razorpay Creds:", error.message);
        return NextResponse.json({ error: "Error Saving Razorpay Creds" }, { status: 500 });
    }
}


export async function GET() {
    try {
        await connectDB("api/payments/pay-creds/rzp/route.ts");

        //get UserID from session
        const session = await getServerSession(FinanceaAuthOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user._id;

        const creds = await RzpModel.findOne({ userId });

        if (!creds) {
            return NextResponse.json({ message: "No Razorpay credentials found." }, { status: 204 });
        }

        return NextResponse.json(
            {
                keyId: creds.keyId,

            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error Checking Razorpay Creds:", error.message);
        return NextResponse.json({ error: "Error Checking Razorpay Creds" }, { status: 500 });
    }
}
