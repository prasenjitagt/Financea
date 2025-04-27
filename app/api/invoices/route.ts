import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import InvoiceModel from "@/lib/models/Invoice.model";
import { invoiceSchema } from "@/lib/helpers/validations";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "../auth/[...nextauth]/options";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    await connectDB("api/invoices/route.ts");
    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      console.log("Unauthorized");
      throw new Error("Unauthorized");
    }
    const userId = session.user._id;


    const body = await req.json();


    const validatedBody = invoiceSchema.parse(body.data);

    const newInvoice = await InvoiceModel.create({
      user: userId,
      client: validatedBody.clientId,
      invoiceNumber: validatedBody.invoiceNumber,
      issueDate: validatedBody.issueDate,
      dueDate: validatedBody.dueDate,
      items: validatedBody.items,
      description: validatedBody.description,
      termsAndConditions: validatedBody.termsAndConditions,
      discount: validatedBody.discount,
      tax: validatedBody.tax,
      isRecurring: validatedBody.isRecurring,
      recurringPeriod: validatedBody.recurringPeriod,
    });

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error: any) {
    console.error("Invoice Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//Get Request : 
export async function GET() {
  try {
    await connectDB("api/invoices/route.ts");
    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      console.log("Unauthorized");
      throw new Error("Unauthorized");
    }
    const userId = session.user._id;


    // Fetch invoices for the authenticated user
    const invoices = await InvoiceModel.find({ user: userId });

    if (!invoices) {
      return NextResponse.json({ message: "No invoices found" }, { status: 404 });
    }

    return NextResponse.json(invoices, { status: 200 });
  } catch (error: any) {
    console.error("Invoice Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



// DELETE Handler
export async function DELETE(req: NextRequest) {
  try {
    await connectDB("api/invoices/route.ts");

    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get("invoiceId");

    if (!invoiceId) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
    }

    const deleteResult = await InvoiceModel.findByIdAndDelete(invoiceId);

    if (!deleteResult) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Invoice deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting Invoice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}