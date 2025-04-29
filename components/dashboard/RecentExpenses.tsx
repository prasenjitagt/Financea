"use client";


import { useState, useEffect } from "react";
import RecentExpensesLoading from "../loading_ui/RecentExpensesLoading";
import axios, { AxiosError } from "axios";
import { recent_expenses_route } from "@/lib/helpers/api-endpoints";
import { ExpensesReturnPayloadType, ExpensesToBeReturnedType } from "@/app/api/expenses/route";
import RecentExpensesTable from "./recent_expenses_table";
import Image from "next/image";
import ReceiptIcon from "@/assets/icons/receipt_icon.svg";




const RecentExpenses = () => {
  const [expenses, setExpenses] = useState<ExpensesToBeReturnedType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchExpenses = async () => {
      try {
        const response = await axios.get<ExpensesReturnPayloadType>(recent_expenses_route);
        setExpenses(response.data.expenses);

        // console.log(response.data.expenses);  //debug log



      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        setError(
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch expenses"
        );
      } finally {
        setLoading(false);
      }
    };


    fetchExpenses();
  }, []);

  if (loading) return <RecentExpensesLoading />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-white p-5 rounded-xl shadow-md mt-6 md:h-[34.3rem]">

      {/* Header Section */}
      <div className=" items-center mb-4">
        <h2 className="text-lg font-semibold text-black">Recent Expenses</h2>
      </div>

      {
        expenses.length === 0 ? (

          <div className=" h-full flex flex-col items-center justify-center">
            <Image src={ReceiptIcon} alt="Receipt Icon" width={100} />
            <h2 className="text-[25px]">No Expenses Yet!</h2>
            <p className="text-[17px] text-muted-foreground">Get started by adding some</p>
          </div>

        ) : (<RecentExpensesTable expenses={expenses} />)
      }



    </div>
  );
};

export default RecentExpenses;
