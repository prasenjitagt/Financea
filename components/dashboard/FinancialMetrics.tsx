
"use client";

import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { FinancialAnalyticsProps } from "./FinancialAnalytics";
import FinMetricCard from "./FinMetricCard";
import { financial_metrics_route } from "@/lib/helpers/api-endpoints";
import axios from "axios";
import { FinancialMetricsResponseType } from "@/lib/types";


const FinancialMetrics = ({ frequency }: FinancialAnalyticsProps) => {
    const [financialMetrics, setFinancialMetrics] = useState<FinancialMetricsResponseType>();

    // useEffect(() => {
    //     const fetchFinancialMetrics = async () => {
    //         try {
    //             const result = await axios.get<FinancialMetricsResponseType>(
    //                 `${financial_metrics_route}`,
    //                 {
    //                     params: {
    //                         interval: frequency.toLowerCase(),        // replace with actual userId
    //                         toCurrency: "USD",           // or "INR"
    //                     },
    //                 }
    //             );




    //             console.log(result.data); //debuglog

    //         } catch (error) {

    //             console.error("Error Fetching Financial Metrics:", error);

    //         }
    //     };

    //     fetchFinancialMetrics();
    // }, [frequency]);

    return (
        <div className=" bg-white px-[31px] py-[26px] rounded-[16px] border border-[#e8e8e8]   w-full h-full flex flex-col justify-between">
            <FinMetricCard
                title="Total Revenue"
                amount={1200}
                incDecPercentage={23}
                isIncreased={true}
                text="from last month"
            />

            <Separator />

            <FinMetricCard
                title="Total Expense"
                amount={500}
                incDecPercentage={10}
                isIncreased={false}
                text="from last month"
            />

            <Separator />


            <FinMetricCard
                title="Total Profit"
                amount={500}
                incDecPercentage={27}
                isIncreased={true}
                text="from last month"
            />

            <Separator />


            <FinMetricCardExtra

                title="Outstanding Invoices"
                amount={500}
                text="Across 3 invoices"

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


