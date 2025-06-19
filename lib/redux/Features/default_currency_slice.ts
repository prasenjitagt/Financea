import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrencyInfoState {
    currency: "INR" | "USD";
}

const getInitialCurrency = (): "INR" | "USD" => {
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem("currency");
        if (stored === "INR" || stored === "USD") return stored;
    }
    return "INR";
};

const initialState: CurrencyInfoState = {
    currency: getInitialCurrency(),
};

function setCurrency(
    state: CurrencyInfoState,
    action: PayloadAction<"INR" | "USD">
) {
    state.currency = action.payload;
    if (typeof window !== "undefined") {
        localStorage.setItem("currency", action.payload);
    }
}

const currencyInfoSlice = createSlice({
    name: "CurrencyInfoSlice",
    initialState,
    reducers: {
        setDefaultCurrency: setCurrency,
    },
});

export const { setDefaultCurrency } = currencyInfoSlice.actions;

export default currencyInfoSlice.reducer;
