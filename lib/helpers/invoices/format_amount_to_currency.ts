
export function formatAmountToCurrency(amount: number, currency: string): string {


    const formattedCurrencyString = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    }).format(amount);

    return formattedCurrencyString;
}