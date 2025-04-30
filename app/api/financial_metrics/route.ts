import connectDB from "@/lib/database/db_connection";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import InvoiceModel from "@/lib/models/Invoice.model";
import { FinancialMetricsResponseType, IndividualExpenseFromDataBaseType, IndividualInvoiceFromDataBaseType } from "@/lib/types";
import { getConvertedInvoiceTotal } from "@/lib/helpers/financial_metrics_route/getConvertedInvoiceTotal";
import ExpenseModel from "@/lib/models/Expenses.model";
import { getConvertedExpenseTotal } from "@/lib/helpers/financial_metrics_route/getConvertedExpenseTotal";

export async function GET(request: NextRequest) {
    try {
        await connectDB("api/financial_metrics/route.ts");
        const { searchParams } = new URL(request.url);


        // get UserID from session
        const session = await getServerSession(FinanceaAuthOptions);
        if (!session) {
            console.log("Unauthorized");
            throw new Error("Unauthorized");
        }
        const userId = session.user._id;

        // const userId = searchParams.get('userId');
        const toCurrencyParam = searchParams.get("toCurrency");
        const intervalParam = searchParams.get("interval") || "monthly"; // Default to monthly

        if (toCurrencyParam !== "USD" && toCurrencyParam !== "INR") {
            console.error("Invalid or missing toCurrency query parameter");
            return NextResponse.json({ error: "Invalid toCurrency query parameter" }, { status: 400 });
        }

        const toCurrency: "USD" | "INR" = toCurrencyParam as "USD" | "INR";

        const now = new Date();
        let startDate: Date;
        let endDate: Date;
        let startDatePrevPeriod: Date;
        let endDatePrevPeriod: Date;

        // Set the start and end date based on the selected interval
        if (intervalParam === "daily") {
            // Current day
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

            // Previous day (yesterday)
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            startDatePrevPeriod = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
            endDatePrevPeriod = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);
        } else if (intervalParam === "monthly") {
            // Current month
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

            // Previous month
            const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            startDatePrevPeriod = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
            endDatePrevPeriod = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0, 23, 59, 59, 999);
        } else if (intervalParam === "quarterly") {
            // Current quarter
            const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
            startDate = new Date(now.getFullYear(), quarterStartMonth, 1);
            endDate = new Date(now.getFullYear(), quarterStartMonth + 3, 0, 23, 59, 59, 999);

            // Previous quarter
            const prevQuarterStartMonth = Math.floor((now.getMonth() - 3) / 3) * 3;
            startDatePrevPeriod = new Date(now.getFullYear(), prevQuarterStartMonth, 1);
            endDatePrevPeriod = new Date(now.getFullYear(), prevQuarterStartMonth + 3, 0, 23, 59, 59, 999);
        } else if (intervalParam === "yearly") {
            // Current year
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

            // Previous year
            startDatePrevPeriod = new Date(now.getFullYear() - 1, 0, 1);
            endDatePrevPeriod = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
        } else {
            console.error("Invalid interval query parameter");
            return NextResponse.json({ error: "Invalid interval query parameter" }, { status: 400 });
        }

        //debug
        // console.log("startDate:", startDate);
        // console.log("endDate:", endDate);
        // console.log("startDatePrevPeriod:", startDatePrevPeriod);
        // console.log("endDatePrevPeriod:", endDatePrevPeriod);

        // Fetch paid invoices for the selected time interval

        const paidInvoices = await InvoiceModel.find({
            user: userId,
            isPaid: true,
            issueDate: { $gte: startDate, $lte: endDate },
        });

        // Fetch paid invoices for the previous time interval

        const paidInvoicesPrevPeriod = await InvoiceModel.find({
            user: userId,
            isPaid: true,
            issueDate: { $gte: startDatePrevPeriod, $lte: endDatePrevPeriod },
        });

        // Fetch unpaid invoices for the selected time interval

        const unpaidInvoices = await InvoiceModel.find({
            user: userId,
            isPaid: false,
            issueDate: { $gte: startDate, $lte: endDate },
        });

        // Fetch unpaid invoices for the previous time interval

        const unpaidInvoicesPrevPeriod = await InvoiceModel.find({
            user: userId,
            isPaid: false,
            issueDate: { $gte: startDatePrevPeriod, $lte: endDatePrevPeriod },
        });



        // Calculate total revenue for both periods
        const totalRevenue = await getConvertedInvoiceTotal(paidInvoices as IndividualInvoiceFromDataBaseType[], toCurrency);
        const totalRevenuePrevPeriod = await getConvertedInvoiceTotal(paidInvoicesPrevPeriod as IndividualInvoiceFromDataBaseType[], toCurrency);

        // Calculate total dues for both periods
        const totalDues = await getConvertedInvoiceTotal(unpaidInvoices as IndividualInvoiceFromDataBaseType[], toCurrency);
        const totalDuesPrevPeriod = await getConvertedInvoiceTotal(unpaidInvoicesPrevPeriod as IndividualInvoiceFromDataBaseType[], toCurrency);

        // Calculate total profit for both periods
        const totalProfitOrLoss = totalRevenue - totalDues;
        const totalProfitOrLossPrevPeriod = totalRevenuePrevPeriod - totalDuesPrevPeriod;

        // Calculate profit percentage
        const profitPercentage = totalRevenue > 0 ? ((totalProfitOrLoss / totalRevenue) * 100) : 0;
        const profitPercentagePrevPeriod = totalRevenuePrevPeriod > 0 ? ((totalProfitOrLossPrevPeriod / totalRevenuePrevPeriod) * 100) : 0;

        // Profit status (true for profit, false for loss)
        const isProfit = totalProfitOrLoss > 0;
        const isProfitPrevPeriod = totalProfitOrLossPrevPeriod > 0;


        //Fetch Expenses for the selected time interval 
        const expenses = await ExpenseModel.find({
            userId: userId,
            date: { $gte: startDate, $lte: endDate },
        });

        const expensesPrevPeriod = await ExpenseModel.find({
            userId: userId,
            date: { $gte: startDatePrevPeriod, $lte: endDatePrevPeriod },
        });


        // Calculate total expenses for both periods
        const totalExpenses = await getConvertedExpenseTotal(expenses as IndividualExpenseFromDataBaseType[], toCurrency);
        const totalExpensesPrevPeriod = await getConvertedExpenseTotal(expensesPrevPeriod as IndividualExpenseFromDataBaseType[], toCurrency);



        // console.log("Current Period Revenue:", totalRevenue, "Previous Period Revenue:", totalRevenuePrevPeriod);
        // console.log("Current Period Profit:", totalProfitOrLoss, "Previous Period Profit:", totalProfitOrLossPrevPeriod);



        const resposePayload: FinancialMetricsResponseType = {
            currentPeriod: {
                totalRevenue,
                totalProfitOrLoss,
                totalDues,
                isProfit,
                profitPercentage,
                totalExpenses,
                outstandingInvoiceAmount: totalDues,
                outstandingInvoiceCount: unpaidInvoices.length
            },
            previousPeriod: {
                totalRevenue: totalRevenuePrevPeriod,
                totalProfitOrLoss: totalProfitOrLossPrevPeriod,
                totalDues: totalDuesPrevPeriod,
                isProfit: isProfitPrevPeriod,
                profitPercentage: profitPercentagePrevPeriod,
                totalExpenses: totalExpensesPrevPeriod
            },
            interval: intervalParam,
        };

        return NextResponse.json(resposePayload, { status: 200 });
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}