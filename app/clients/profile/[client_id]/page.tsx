

import InvoiceModel from "@/lib/models/Invoice.model";
import { IndividualInvoiceFromDataBaseType, InvoiceType } from "@/lib/types";
import connectDB from "@/lib/database/db_connection";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { ProfileDataTable } from "@/app/clients/profile/[client_id]/data-table";
import { columns } from "@/app/clients/profile/[client_id]/columns";
import ClientProfileTopSection from "@/components/clients/profile/client_profile_top_section";

interface PropType {
  params: {
    client_id: string;
  };
}

export function sanitizeInvoice(
  invoice: IndividualInvoiceFromDataBaseType
): InvoiceType {
  return {
    _id: invoice._id.toString(),
    user: invoice.user.toString(),
    client: invoice.client.toString(),
    invoiceNumber: invoice.invoiceNumber,
    issueDate:
      invoice.issueDate instanceof Date
        ? invoice.issueDate.toISOString()
        : invoice.issueDate,
    dueDate: invoice.dueDate.toString(),
    clientEmail: invoice.clientEmail,
    clientName: invoice.clientName,
    clientMobile: Number(invoice.clientMobile),
    isRecurring: Boolean(invoice.isRecurring),
    recurringFrequency: invoice.recurringFrequency ?? undefined,
    recurringIssueDate: invoice.recurringIssueDate
      ? invoice.recurringIssueDate instanceof Date
        ? invoice.recurringIssueDate.toISOString()
        : invoice.recurringIssueDate
      : undefined,
    recurringDueDate: invoice.recurringDueDate
      ? invoice.recurringDueDate instanceof Date
        ? invoice.recurringDueDate.toISOString()
        : invoice.recurringDueDate
      : undefined,
    items: invoice.items.map((item) => ({
      ishourly: Boolean(item.ishourly),
      name: item.name,
      quantity: Number(item.quantity),
      rate: Number(item.rate),
      _id: item._id.toString(),
    })),
    discountPercent: Number(invoice.discountPercent),
    taxPercent: Number(invoice.taxPercent),
    note: invoice.note ?? undefined,
    terms: invoice.terms ?? undefined,
    subTotal: Number(invoice.subTotal),
    discountAmount: Number(invoice.discountAmount),
    taxAmount: Number(invoice.taxAmount),
    totalAmount: Number(invoice.totalAmount),
    createdAt:
      invoice.createdAt instanceof Date
        ? invoice.createdAt.toISOString()
        : invoice.createdAt,
    updatedAt:
      invoice.updatedAt instanceof Date
        ? invoice.updatedAt.toISOString()
        : invoice.updatedAt,
    __v: invoice.__v ?? undefined,
    isPaid: invoice.isPaid,
    paymentId: invoice.paymentId,
    currency: invoice.currency,
  };
}

async function getData(clientId: string): Promise<InvoiceType[]> {
  try {

    await connectDB("app/invoices/page.tsx");

    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      console.log("Unauthorized");
      throw new Error("Unauthorized");
    }

    const userId = session.user._id;
    const invoices = await InvoiceModel.find({ user: userId, client: clientId })
      .sort({ createdAt: -1 })
      .lean<IndividualInvoiceFromDataBaseType[]>();

    // console.log("Get your invoice type:", invoices[0]);  //for debugging

    if (!invoices) {
      console.log("No invoices Found");
      return [];
    }


    return invoices.map(sanitizeInvoice);

    return [];
  } catch (error) {
    console.error("Error in fetching invoices:", error);
    return [];
  }
}


export default async function ClientProfile({ params }: PropType) {
  const paramsObj = await params;
  const invoiceData = await getData(paramsObj.client_id);
  return (
    <div className="h-full flex flex-col bg-white dark:bg-black p-5 rounded-lg container mx-auto">
      {/* Top Cards Section */}
      <section className=" flex space-x-[12px] mb-[38px]">
        <ClientProfileTopSection client_id={paramsObj.client_id} />

      </section>

      {/* Desktop and Tablet View Table Section */}
      <section className="hidden md:block w-full flex-1 overflow-visible">
        <ProfileDataTable columns={columns} data={invoiceData} />
      </section>
    </div>
  )
}