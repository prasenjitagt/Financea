import { IndividualExpenseFromDataBaseType } from "@/lib/types";
import axios from "axios";
import { currency_conversion_api_route } from "../api-endpoints";

export async function getConvertedExpenseTotal(
    expenses: IndividualExpenseFromDataBaseType[],
    toCurrency: "USD" | "INR"
): Promise<number> {

    if (expenses.length === 0) {
        console.log("Got No expenses to convert currency");

        return 0;

    }

    const INRexpenses = expenses.filter(exp => exp.currency === "INR");
    const USDexpenses = expenses.filter(exp => exp.currency === "USD");

    const totalINR = INRexpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalUSD = USDexpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Determine which part to convert
    if (toCurrency === "USD") {
        if (totalINR === 0) {
            return totalUSD;
        }

        try {
            const response = await axios.get(currency_conversion_api_route, {
                params: {
                    amount: totalINR,
                    from: "INR",
                    to: "USD",
                },
            });
            const convertedINRtoUSD = response.data.rates["USD"];
            const total = convertedINRtoUSD + totalUSD;
            return parseFloat(total.toFixed(2));


        } catch (error) {
            console.error("Conversion error:", error);
            throw new Error("Failed to convert INR to USD");
        }
    } else {
        if (totalUSD === 0) {
            return totalINR;
        }

        try {
            const response = await axios.get(currency_conversion_api_route, {
                params: {
                    amount: totalUSD,
                    from: "USD",
                    to: "INR",
                },
            });
            const convertedUSDtoINR = response.data.rates["INR"];
            const total = convertedUSDtoINR + totalINR;
            return parseFloat(total.toFixed(2));
        } catch (error) {
            console.error("Conversion error:", error);
            throw new Error("Failed to convert USD to INR");
        }
    }
}
