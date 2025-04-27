"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import RecentExpensesLoading from "../loading_ui/RecentExpensesLoading";
import axios from "axios";
import { recent_expenses_route } from "@/lib/helpers/api-endpoints";
import { ExpensesReturnPayloadType, ExpensesToBeReturnedType } from "@/app/api/expenses/route";

const RecentExpenses = () => {
  const [expenses, setExpenses] = useState<ExpensesToBeReturnedType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchExpenses = async () => {
      try {
        const response = await axios.get<ExpensesReturnPayloadType>(recent_expenses_route);
        setExpenses(response.data.expenses);

        console.log(response.data.expenses);



      } catch (error) {
        const message = (error as any)?.response?.data?.message || (error as Error).message;
        setError(message);
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


      <Table>
        <TableCaption>A list of your Recent Expenses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3" >Category</TableHead>
            <TableHead className="w-1/3" >Amount</TableHead>
            <TableHead className="w-1/3" >Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((exp) => {



            return (
              <TableRow key={exp._id} className="h-[50px]">
                <TableCell className="flex items-center space-x-2 ">
                  <span
                    className="w-3 h-3 justify-center rounded-full text-sm"
                    style={{ backgroundColor: exp.categoryColor }}
                  />



                  <div className="text-gray-800 text-sm">{exp.category}</div>
                </TableCell>
                <TableCell className="font-medium">{exp.amount}</TableCell>

                <TableCell>{exp.date}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>

      </Table>

    </div>
  );
};

export default RecentExpenses;
