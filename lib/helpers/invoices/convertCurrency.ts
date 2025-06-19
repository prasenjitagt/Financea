import axios from "axios";
import { currency_conversion_api_route } from "../api-endpoints";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { InvoicePageAmountAndCurrency } from "@/lib/types";

export async function convertCurrency(
    totalINR: number,
    totalUSD: number,
): Promise<InvoicePageAmountAndCurrency> {

    const toCurrency = useSelector((state: RootState) => state.currencyInfo.currency);
    const currencySymbol = toCurrency === "INR" ? "₹" : "$";


    // Determine which part to convert
    if (toCurrency === "USD") {
        if (totalINR === 0) {
            return { totalAmount: totalUSD, currencySymbol };
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
            return { totalAmount: parseFloat(total.toFixed(2)), currencySymbol };


        } catch (error) {
            console.error("Conversion error:", error);
            throw new Error("Failed to convert INR to USD");
        }
    } else {
        if (totalUSD === 0) {
            return { totalAmount: totalINR, currencySymbol };
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
            return { totalAmount: parseFloat(total.toFixed(2)), currencySymbol };
        } catch (error) {
            console.error("Conversion error:", error);
            throw new Error("Failed to convert USD to INR");
        }
    }
}
