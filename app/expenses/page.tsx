import { columns } from "@/app/expenses/columns";
import { ExpenseDataTable } from "@/app/expenses/data-table";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "../api/auth/[...nextauth]/options";
import { ExpenseType, IndividualExpenseFromDataBaseType } from "@/lib/types";
import ExpenseModel from "@/lib/models/Expenses.model";
import connectDB from "@/lib/database/db_connection";
import { stringToDate } from "@/lib/helpers/payment_requests/stringToDate";
import ExpensesPageTotalPaymentsCards from "@/components/expenses/expenses_page_total_payments_card";
import ExpensesPageTotalExpensesCards from "@/components/expenses/expenses_page_total_expenses_card";

function sanitizeExpenses(
  expense: IndividualExpenseFromDataBaseType
): ExpenseType {
  return {
    _id: expense._id.toString(),
    userId: expense.userId.toString(),
    amount: expense.amount,
    category: expense.category,
    currency: expense.currency,
    date: stringToDate(expense.date.toString()),
    description: expense.description,
    createdAt: expense.createdAt.toString(),
    updatedAt: expense.updatedAt.toString(),
    __v: expense.__v,
  };
}

async function getData() {
  try {
    await connectDB("app/expenses/page.tsx");

    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      console.log("Unauthorized");
      throw new Error("Unauthorized");
    }

    const userId = session.user._id;

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const expenses = await ExpenseModel.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    })
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

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black p-5 rounded-lg container mx-auto">
      {/* Top Cards Section */}
      <section className="flex space-x-[12px]   mb-[38px]">
        <ExpensesPageTotalExpensesCards
          title="Total Expenses"
          description="Last 30 Days"
          totalExpenses={numberOfExpenses}
        />
        <ExpensesPageTotalPaymentsCards
          title="Total Amount"
          description="Last 30 Days"
          expenses={expensesData}
        />
      </section>

      {/* Desktop and Tablet View Table Section */}
      <section className="hidden md:block w-full flex-1 overflow-visible">
        <ExpenseDataTable columns={columns} data={expensesData} />
      </section>
    </div>
  );
}
