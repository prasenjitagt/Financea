import { IndividualInvoiceFromDataBaseType } from "@/lib/types";
import axios from "axios";
import { currency_conversion_api_route } from "../api-endpoints";

export async function getConvertedInvoiceTotal(
    invoices: IndividualInvoiceFromDataBaseType[],
    toCurrency: "USD" | "INR"
): Promise<number> {

    if (invoices.length === 0) {
        console.log("Got No invoice to convert currency");

        return 0;

    }


    const INRinvoices = invoices.filter(inv => inv.currency === "INR");
    const USDinvoices = invoices.filter(inv => inv.currency === "USD");

    const totalINR = INRinvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalUSD = USDinvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    // Determine which part to convert
    if (toCurrency === "USD") {
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
