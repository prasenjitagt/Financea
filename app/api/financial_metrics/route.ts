//api/financial_metrics/route.ts

import connectDB from "@/lib/database/db_connection";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import InvoiceModel from "@/lib/models/Invoice.model"; // ✅ Make sure the path is correct
import { IndividualInvoiceFromDataBaseType } from "@/lib/types";
import { getConvertedInvoiceTotal } from "@/lib/helpers/financial_metrics_route/getConvertedInvoiceTotal";

interface ResponseFromDbTypes {

}




export async function GET(request: NextRequest) {
    try {
        await connectDB("api/financial_metrics/route.ts");

        // const session = await getServerSession(FinanceaAuthOptions);
        // if (!session) {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        // const userId = session.user._id;
        // console.log("session user ID", userId);

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');


        const toCurrencyParam = searchParams.get("toCurrency");

        if (toCurrencyParam !== "USD" && toCurrencyParam !== "INR") {
            console.error("Invalid or missing toCurrency query parameter");
            return NextResponse.json({ error: "Invalid toCurrency query parameter" }, { status: 400 });
        }

        const toCurrency: "USD" | "INR" = toCurrencyParam;



        // Fetch paid and unpaid invoices separately
        const [paidInvoices, unpaidInvoices] = await Promise.all([
            InvoiceModel.find({ user: userId, isPaid: true }),
            InvoiceModel.find({ user: userId, isPaid: false }),
        ]);

        const totalRevenue = await getConvertedInvoiceTotal(paidInvoices as IndividualInvoiceFromDataBaseType[], toCurrency);

        const totalDues = await getConvertedInvoiceTotal(unpaidInvoices as IndividualInvoiceFromDataBaseType[], toCurrency);


        console.log("totalRevenue:", totalRevenue, toCurrency);
        console.log("totalDues:", totalDues, toCurrency);

        return NextResponse.json(
            {
                paid: paidInvoices,
                unpaid: unpaidInvoices,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
