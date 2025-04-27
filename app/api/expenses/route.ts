
//api/expenses/route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/database/db_connection";
import { expenseSchema } from "@/lib/helpers/validations";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "../auth/[...nextauth]/options";
import ExpenseModel from "@/lib/models/Expenses.model";
import { Types } from "mongoose";
import { formatAmountToCurrency } from "@/lib/helpers/invoices/format_amount_to_currency";
import { stringToDate } from "@/lib/helpers/payment_requests/stringToDate";

export interface IExpense {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  date: Date;
  category: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ExpensesToBeReturnedType {
  _id: string;
  category: string;
  categoryColor: string;
  amount: string;
  date: string;
  description: string;
}

export interface ExpensesStatsType {
  totalAmount: number,
  topCategory: string,
  totalExpenses: number,
}


export interface ExpensesReturnPayloadType {
  expenses: ExpensesToBeReturnedType[],
  expensesStats: ExpensesStatsType
}

const JWT_SECRET = process.env.JWT_SECRET as string;

// 👇 POST handler for creating expenses
export async function POST(req: NextRequest) {
  try {
    await connectDB("/api/expenses/route.ts")
    //get UserID from session
    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user._id;

    const body = await req.json();
    const parsed = expenseSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Error Zod Validation", parsed.error.errors);

      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const newExpense = new ExpenseModel({
      ...parsed.data,
      userId: userId,
    });

    const savedExpense = await newExpense.save();

    // console.log("Saved Expense:", savedExpense);


    return NextResponse.json({ message: "Expense created", expense: savedExpense });
  } catch (error) {
    console.error("Error saving expense:", error);
    return NextResponse.json({ error: "Server Error: " + error }, { status: 500 });
  }
}

// 👇 GET handler for fetching expenses and stats
export async function GET() {
  await connectDB("/api/expenses/route.ts");
  try {

    //get UserID from session
    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user._id;


    const expenses: IExpense[] = await ExpenseModel.find({ userId: userId }).sort({ createdAt: -1 });

    const ExpenseCategoryColor: Record<string, string> = {
      Travel: "#532B88",
      Food: "#5E84EC",
      Office: "#19C13A"
    }


    const expensesToBeReturned: ExpensesToBeReturnedType[] = expenses.map((exp) => ({
      _id: exp._id.toString(),
      category: exp.category,
      categoryColor: ExpenseCategoryColor[exp.category] || "#000000",
      amount: formatAmountToCurrency(exp.amount, exp.currency),
      date: stringToDate(exp.date.toISOString()),
      description: exp.description,
    }));

    const totalAmount = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const categoryCount: { [key: string]: number } = {};
    expenses.forEach((exp) => {
      categoryCount[exp.category] = (categoryCount[exp.category] || 0) + 1;
    });

    const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const expensesStats: ExpensesStatsType = {
      totalAmount,
      topCategory,
      totalExpenses: expenses.length,
    };


    const returnPayload: ExpensesReturnPayloadType = { expenses: expensesToBeReturned, expensesStats }

    return NextResponse.json(returnPayload, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Now TypeScript knows the error is of type `Error`
      console.error("Error fetching expenses:", error.message);
      return NextResponse.json({ error: "Server Error: " + error.message }, { status: 500 });
    } else {
      // Handle cases where the error is not an instance of `Error`
      console.error("Unexpected error:", error);
      return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
    }
  }

}


// 👇 DELETE handler for deleting expenses
export async function DELETE(req: NextRequest) {
  await connectDB("api/expenses/route.ts");

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const { expenseIds } = await req.json();

    if (!Array.isArray(expenseIds) || expenseIds.length === 0) {
      return NextResponse.json(
        { error: "No expense IDs provided" },
        { status: 400 }
      );
    }

    const deleteResult = await ExpenseModel.deleteMany({
      _id: { $in: expenseIds },
      userId: userId,
    });

    return NextResponse.json(
      {
        message: `${deleteResult.deletedCount} expense(s) deleted successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in deleting expenses:", error);
    return NextResponse.json(
      { error: "Server error or invalid token" + error },
      { status: 500 }
    );
  }
}
