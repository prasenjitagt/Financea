import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrencyInfoState {
    currency: "inr" | "usd";
}

const getInitialCurrency = (): "inr" | "usd" => {
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem("currency");
        if (stored === "inr" || stored === "usd") return stored;
    }
    return "inr";
};

const initialState: CurrencyInfoState = {
    currency: getInitialCurrency(),
};

function setCurrency(
    state: CurrencyInfoState,
    action: PayloadAction<"inr" | "usd">
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
