

import { columns } from "@/app/expenses/columns";
import { ExpenseDataTable } from "@/app/expenses/data-table";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "../api/auth/[...nextauth]/options";
import ClientsPageTotalClientsCards from "@/components/clients/clients_page_total_clients_card";
import { IndividualExpenseFromDataBaseType } from "@/lib/types";
import ExpenseModel from "@/lib/models/Expenses.model";
import connectDB from "@/lib/database/db_connection";
import { sanitizeExpenses } from "@/components/expenses/sanitized_expenses";
import ExpensesPageTotalPaymentsCards from "@/components/expenses/expenses_page_total_payments_card";





async function getData() {
  try {

    await connectDB("app/expenses/page.tsx");

    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      console.log("Unauthorized");
      throw new Error("Unauthorized");
    }

    const userId = session.user._id;
    const expenses = await ExpenseModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean<IndividualExpenseFromDataBaseType[]>();

    // console.log("Get your expense type:", expenses[0]);



    if (!expenses) {
      console.log("No Expenses Found");
      return [];
    }

    return expenses.map(sanitizeExpenses);
  } catch (error) {
    console.error("Error in fetching clients:", error);
    return [];
  }
}




export default async function ExpensesDesktopView() {
  const expensesData = await getData();

  const numberOfExpenses = expensesData.length;

  const totalPayments = expensesData.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="h-full flex flex-col bg-white p-5 rounded-lg container mx-auto">
      {/* Top Cards Section */}
      <section className="flex space-x-[12px] mb-[38px]">
        <ClientsPageTotalClientsCards
          title="Total Expenses"
          description="Last 30 Days"
          totalClients={numberOfExpenses}
        />
        <ExpensesPageTotalPaymentsCards
          title="Total Amount"
          description="Last 30 Days"
          totalPayments={totalPayments}
        />
      </section>

      {/* Desktop and Tablet View Table Section */}
      <section className="hidden md:block w-full flex-1 overflow-scroll">
        <ExpenseDataTable
          columns={columns}
          data={expensesData}
        />
      </section>
    </div>


  );
}
