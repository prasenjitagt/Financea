//api/email/route.ts

import { NextResponse } from "next/server";
import { Resend } from "resend";


export async function GET() {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data } = await resend.emails.send({
            from: "prasenjit@proagt.site",
            to: "shaansubhankar@gmail.com",
            subject: "Hello",
            html: "<h1>Financea email</h1>"
        });

        return NextResponse.json({ data }, { status: 200 })
    } catch (error) {
        console.log("Error Sending Email:", error);

        return NextResponse.json({
            message: "Error Sending Email",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 }) // 500 is more appropriate for server errors
    }
}