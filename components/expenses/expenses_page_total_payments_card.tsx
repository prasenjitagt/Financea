"use client";
import { ClientType, ExpenseType, AmountAndCurrencyType } from "@/lib/types";
import { Card, CardContent } from "../ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useEffect, useState } from "react";
import { convertCurrency } from "@/lib/helpers/convertCurrency";

interface ExpensesPageCardPropType {
    title: string,
    description: string,
    expenses: ExpenseType[]
}


export default function ExpensesPageTotalPaymentsCards({ title, expenses, description }: ExpensesPageCardPropType) {
    const currency = useSelector((state: RootState) => state.currencyInfo.currency);
    const currencySymbol = currency === "INR" ? "₹" : "$";

    const totalAmountINRExpenses = expenses
        .filter((expense) => expense.currency === "INR") // Filter invoices where currency is INR
        .reduce((sum, expense) => sum + expense.amount, 0); // Sum up their totalAmount

    const totalAmountUSDExpenses = expenses
        .filter((expense) => expense.currency === "USD") // Filter invoices where currency is USD
        .reduce((sum, expense) => sum + expense.amount, 0); // Sum up their totalAmount

    const [amountDetails, setAmountDetails] = useState<AmountAndCurrencyType | null>(null);


    useEffect(() => {
        async function fetchConvertedAmount() {
            try {
                const convertedCurrency = await convertCurrency(totalAmountINRExpenses, totalAmountUSDExpenses, currency);
                setAmountDetails(convertedCurrency);


            } catch (error) {
                console.error("Failed to convert currency:", error);
            }
        }

        fetchConvertedAmount();
    }, [totalAmountINRExpenses, totalAmountUSDExpenses, currency]);


    return (
        <Card className="w-[273px]">
            <CardContent >
                <h4 className="text-xl font-normal  text-muted-foreground mb-[12px] ">
                    {title}
                </h4>
                <section className="flex justify-between mt-2">
                    <h3 className="md:text-3xl text-xl font-bold">{amountDetails === null ? ("loading...") : (`${amountDetails.currencySymbol} ${amountDetails.totalAmount}`)}</h3>
                    <p className="whitespace-pre-line text-muted-foreground text-[14px]">{description.replace(/ /g, '\n')}</p>
                </section>
            </CardContent>
        </Card>
    )
}
