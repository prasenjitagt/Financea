"use client";
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card";
import HeaderInfoCard from "@/components/profile/header-info-card";
import { convertCurrency } from "@/lib/helpers/convertCurrency";
import { InvoiceStatsReturnType } from '@/lib/helpers/invoices/getInvoiceStats';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { AmountAndCurrencyType } from '@/lib/types';

interface PropType {
    invoiceStats: InvoiceStatsReturnType
}

export default function InvoicesTopCardsSection({ invoiceStats }: PropType) {

    const { totalInvoices,
        totalAmountINRClients,
        totalAmountUSDClients,
        totalOutstandingInvoices,
        totalOutstandingAmountINRClients,
        totalOutstandingAmountUSDClients,
    } = invoiceStats;

    const currency = useSelector((state: RootState) => state.currencyInfo.currency);

    const [amountDetails, setAmountDetails] = useState<AmountAndCurrencyType | null>(null);
    const [outstandingAmountDetails, setOutstandingAmountDetails] = useState<AmountAndCurrencyType | null>(null);

    useEffect(() => {
        async function fetchConvertedAmount() {
            try {
                const convertedCurrency = await convertCurrency(totalAmountINRClients, totalAmountUSDClients, currency);
                setAmountDetails(convertedCurrency);

                const outstandingConvertedCurrency = await convertCurrency(totalOutstandingAmountINRClients, totalOutstandingAmountUSDClients, currency);
                setOutstandingAmountDetails(outstandingConvertedCurrency);

            } catch (error) {
                console.error("Failed to convert currency:", error);
            }
        }

        fetchConvertedAmount();
    }, [totalAmountINRClients, totalAmountUSDClients, currency]);



    return (
        <div className="flex space-x-[12px] mb-[38px]">

            <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
                <CardContent className="flex justify-between">

                    <HeaderInfoCard mainText={"Total Invoices"} count={`${totalInvoices}`} />

                    <div className="flex items-center">
                        <p className="text-muted-foreground text-[14px]">Last 30 Days</p>
                    </div>

                </CardContent>
            </Card>

            <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
                <CardContent className="flex justify-between">


                    <HeaderInfoCard mainText="Total Amount" count={amountDetails === null ? ("loading...") : (`${amountDetails.currencySymbol} ${amountDetails.totalAmount}`)} />

                    <div className="flex items-center">
                        <p className="text-muted-foreground text-[14px]">Last 30 Days</p>
                    </div>

                </CardContent>
            </Card>

            <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
                <CardContent className="flex justify-between">

                    <HeaderInfoCard mainText={"Outstanding Invs."} count={`${totalOutstandingInvoices}`} />
                    <div className="flex items-center">
                        <p className="text-muted-foreground text-[14px]">Last 30 Days</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
                <CardContent className="flex justify-between">


                    <HeaderInfoCard mainText="Total Amount" count={outstandingAmountDetails === null ? ("loading...") : (`${outstandingAmountDetails.currencySymbol} ${outstandingAmountDetails.totalAmount}`)} />

                    <div className="flex items-center">
                        <p className="text-muted-foreground text-[14px]">Last 30 Days</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
