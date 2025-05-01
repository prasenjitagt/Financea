import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import InvoiceModel from "@/lib/models/Invoice.model";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "@/app/api/auth/[...nextauth]/options";


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

    if (!invoices.length) {
      return NextResponse.json(
        { message: "No invoices found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { invoices },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error Fetching Invoices", error);

    return NextResponse.json({
      message: "Error Fetching Invoices",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 }) // 500 is more appropriate for server errors
  }
}


// PUT Handler
export async function PUT(req: NextRequest) {
  try {
    await connectDB("api/invoices/route.ts");

    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      console.log("Unauthorized");
      throw new Error("Unauthorized");
    }

    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get("invoiceId");

    if (!invoiceId) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
    }

    const updatedResult = await InvoiceModel.findByIdAndUpdate(invoiceId, { isPaid: true });

    if (!updatedResult) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Invoice Marked as Paid successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.log("Error Error Marking as Paid", error);

    return NextResponse.json({
      message: "Error Error Marking as Paid",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 }) // 500 is more appropriate for server errors
  }
}


// DELETE Handler
export async function DELETE(req: NextRequest) {
  try {
    await connectDB("api/invoices/route.ts");

    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      console.log("Unauthorized");
      throw new Error("Unauthorized");
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
    console.log("Error Deleting Invoice", error);

    return NextResponse.json({
      message: "Error Deleting Invoice",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 }) // 500 is more appropriate for server errors
  }
}