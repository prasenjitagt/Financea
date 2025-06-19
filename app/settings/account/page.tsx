"use client";

import * as React from "react"
// import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// type Checked = DropdownMenuCheckboxItemProps["checked"]
import { Button } from "@/components/ui/button";
import { LuLogOut } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { setDefaultCurrency } from "@/lib/redux/Features/default_currency_slice";
import { RootState } from "@/lib/redux/store"; // Adjust path as per your project




const AccountSettings = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    // const [INRCurrency, setINRCurrency] = React.useState<Checked>(true);
    // const [USDCurrency, setUSDCurrency] = React.useState<Checked>(false);

    const dispatch = useDispatch();
    const currency = useSelector((state: RootState) => state.currencyInfo.currency);

    const handleCurrencyChange = (selectedCurrency: "INR" | "USD") => {
        dispatch(setDefaultCurrency(selectedCurrency));
    };


    const handleLogout = () => {
        setIsLoggingOut(true); // Show spinner
        signOut({ callbackUrl: "/login" })

    };






    return (
        <div >

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        Set Currency
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent >
                    <DropdownMenuLabel>Currency</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={currency === "INR"}
                        onCheckedChange={() => handleCurrencyChange("INR")}
                    >
                        INR
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={currency === "USD"}
                        onCheckedChange={() => handleCurrencyChange("USD")}
                    >
                        USD
                    </DropdownMenuCheckboxItem>


                </DropdownMenuContent>
            </DropdownMenu>




            {/* Logout Button */}
            <Button
                variant="outline"
                className="mt-3 flex items-center gap-2 px-8 py-5  font-medium  cursor-pointer"
                onClick={handleLogout}
                disabled={isLoggingOut}
            >
                {isLoggingOut ? (
                    <ImSpinner2 className="w-4 h-4 animate-spin text-purple-600" />
                ) : (
                    <>
                        <LuLogOut className="w-4 h-4 transition-all duration-300" />
                        Logout
                    </>
                )}
            </Button>
        </div>
    )
}

export default AccountSettings;
