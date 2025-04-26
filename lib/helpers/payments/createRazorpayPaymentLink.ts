// lib/helpers/payments/createRazorpayPaymentLink.ts

import axios from "axios";

export interface CreatePaymentLinkInput {
    amount: number;
    currency: "INR" | "USD";
    customerName: string;
    customerEmail: string;
    customerContact: number;
    keyId: string;
    keySecret: string;
}

export async function createRazorpayPaymentLink({
    amount,
    currency,
    customerName,
    customerEmail,
    customerContact,
    keyId,
    keySecret,
}: CreatePaymentLinkInput) {
    const expireBy = Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60;

    const contactString = customerContact.toString();

    const paymentLinkPayload = {
        amount,
        currency,
        description: "Payment for your order",
        customer: {
            name: customerName,
            email: customerEmail,
            contact: contactString,
        },
        notify: {
            sms: true,
            email: true,
        },
        reminder_enable: true,
        notes: {
            source: "From Financea app",
        },
        expire_by: expireBy,
    };

    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await axios.post(
        "https://api.razorpay.com/v1/payment_links",
        paymentLinkPayload,
        {
            headers: {
                Authorization: `Basic ${authHeader}`,
                "Content-Type": "application/json",
            },
        }
    );




    return response.data;
}
