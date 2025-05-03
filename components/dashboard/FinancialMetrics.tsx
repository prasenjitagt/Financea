
"use client";

import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { FinancialAnalyticsProps } from "./FinancialAnalytics";
import FinMetricCard from "./FinMetricCard";
import { financial_metrics_route } from "@/lib/helpers/api-endpoints";
import axios from "axios";
import { FinancialMetricsResponseType } from "@/lib/types";

interface MetricsType {
    totalRevenue: number,
    revenueIncDec: number,
    isRevenueInc: boolean,
    totalExpenses: number,
    expenseIncDec: number,
    isExpenseInc: boolean,
    totalProfitOrLoss: number,
    profitIncDec: number,
    isProfitInc: boolean,
    outstandingInvoiceAmount: number,
    outstandingInvoiceCount: number
}


const FinancialMetrics = ({ frequency }: FinancialAnalyticsProps) => {
    const [financialMetrics, setFinancialMetrics] = useState<MetricsType>();

    let frequencyToDisplay: "Day" | "Month" | "Quarter" | "Year";

    if (frequency === "Daily") {
        frequencyToDisplay = "Day";
    } else if (frequency === "Monthly") {
        frequencyToDisplay = "Month";
    } else if (frequency === "Quarterly") {
        frequencyToDisplay = "Quarter";
    } else {
        frequencyToDisplay = "Year";
    }



    useEffect(() => {
        const fetchFinancialMetrics = async () => {
            try {
                const result = await axios.get<FinancialMetricsResponseType>(
                    `${financial_metrics_route}`,
                    {
                        params: {
                            interval: frequency.toLowerCase(),        // replace with actual userId
                            toCurrency: "USD",           // or "INR"
                        },
                    }
                );



                const { currentPeriod, previousPeriod } = result.data;

                //revenue calculation
                const revenueIncDec: number = Math.abs(currentPeriod.totalRevenue - previousPeriod.totalRevenue);
                let isRevenueInc: boolean;

                if (currentPeriod.totalRevenue > previousPeriod.totalRevenue || currentPeriod.totalRevenue === previousPeriod.totalRevenue) {
                    isRevenueInc = true;
                } else {
                    isRevenueInc = false;
                }

                //expense calculation
                const expenseIncDec: number = parseFloat(Math.abs(currentPeriod.totalExpenses - previousPeriod.totalExpenses).toFixed(2));
                let isExpenseInc: boolean;

                if (currentPeriod.totalExpenses > previousPeriod.totalExpenses || currentPeriod.totalExpenses === previousPeriod.totalExpenses) {
                    isExpenseInc = true;
                } else {
                    isExpenseInc = false;
                }


                const profitIncDec: number = Math.abs(currentPeriod.totalProfitOrLoss - previousPeriod.totalProfitOrLoss);
                let isProfitInc: boolean;
                if (currentPeriod.totalProfitOrLoss > previousPeriod.totalProfitOrLoss || currentPeriod.totalProfitOrLoss === previousPeriod.totalProfitOrLoss) {
                    isProfitInc = true;
                } else {
                    isProfitInc = false;
                }


                setFinancialMetrics({
                    totalExpenses: currentPeriod.totalExpenses,
                    expenseIncDec,
                    isExpenseInc,
                    totalProfitOrLoss: Math.abs(currentPeriod.totalProfitOrLoss),
                    isProfitInc,
                    profitIncDec,
                    totalRevenue: currentPeriod.totalRevenue,
                    revenueIncDec,
                    isRevenueInc,
                    outstandingInvoiceAmount: currentPeriod.outstandingInvoiceAmount,
                    outstandingInvoiceCount: currentPeriod.outstandingInvoiceCount,
                })


                console.log(result.data); //debuglog

            } catch (error) {

                console.error("Error Fetching Financial Metrics:", error);

            }
        };

        fetchFinancialMetrics();
    }, [frequency]);

    return (
        <div className=" border px-[31px] py-[26px] rounded-[16px] shadow-lg  w-full h-full flex flex-col justify-between">
            <FinMetricCard
                title="Total Revenue"
                amount={financialMetrics?.totalRevenue ?? 0}
                incDecPercentage={financialMetrics?.revenueIncDec ?? 0}
                isIncreased={financialMetrics?.isRevenueInc ?? true}
                text={`from last ${frequencyToDisplay}`}
            />

            <Separator />

            <FinMetricCard
                title="Total Expense"
                amount={financialMetrics?.totalExpenses ?? 0}
                incDecPercentage={financialMetrics?.expenseIncDec ?? 0}
                isIncreased={financialMetrics?.isExpenseInc ?? true}
                text={`from last ${frequencyToDisplay}`}

            />

            <Separator />


            <FinMetricCard
                title="Total Profit"
                amount={frequency === "Daily" ? 0 : 200}
                incDecPercentage={frequency === "Daily" ? 0 : 10}
                isIncreased={true}
                text={`from last ${frequencyToDisplay}`}

            />

            <Separator />


            <FinMetricCardExtra

                title="Outstanding Invoices"
                amount={financialMetrics?.outstandingInvoiceAmount ?? 0}
                text={`Across ${financialMetrics?.outstandingInvoiceCount ?? 0} invoices`}

            />
        </div>
    );
};

export default FinancialMetrics;





type FinMetricCardExtraProps = {
    title: string;
    amount: number;
    text: string;
}



export const FinMetricCardExtra = ({ title, amount, text }: FinMetricCardExtraProps) => {
    return (
        <div
            className={`flex justify-between  rounded-lg`}
        >
            {/* Left Section - Title and Amount */}
            <div className="flex flex-col justify-between items-start">
                {/* Title */}
                <p className="text-[17px] opacity-60 font-[400]">{title}</p>

                {/* Amount */}
                <p className="text-[40px] font-[700]">${amount}</p>
            </div>

            {/* Right Section - Percentage Change and Additional Text */}
            <div className="flex flex-col justify-center">


                {/* Additional Descriptive Text */}
                <p className="opacity-60 font-[400] text-right">{text}</p>
            </div>
        </div>)
}


