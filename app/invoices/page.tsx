//app/invoices/page.tsx

import { columns } from "./columns";
import { InvoiceDataTable } from "@/app/invoices/data-table";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "../api/auth/[...nextauth]/options";
import HeaderInfoCardInvoices from "@/components/invoices/header-info-card-invoices";
import { Card, CardContent } from "@/components/ui/card";
import InvoiceModel from "@/lib/models/Invoice.model";
import HeaderInfoCard from "@/components/profile/header-info-card";
import { getInvoiceStats } from "@/lib/helpers/invoices/getInvoiceStats";
import { IndividualInvoiceFromDataBaseType, InvoiceType } from "@/lib/types";


export function sanitizeInvoice(invoice: IndividualInvoiceFromDataBaseType): InvoiceType {
  return {
    _id: invoice._id.toString(),
    user: invoice.user.toString(),
    client: invoice.client.toString(),
    invoiceNumber: invoice.invoiceNumber,
    issueDate: invoice.issueDate instanceof Date ? invoice.issueDate.toISOString() : invoice.issueDate,
    dueDate: invoice.dueDate.toString(),
    clientEmail: invoice.clientEmail,
    clientName: invoice.clientName,
    clientMobile: Number(invoice.clientMobile),
    isRecurring: Boolean(invoice.isRecurring),
    recurringFrequency: invoice.recurringFrequency ?? undefined,
    recurringIssueDate: invoice.recurringIssueDate
      ? (invoice.recurringIssueDate instanceof Date ? invoice.recurringIssueDate.toISOString() : invoice.recurringIssueDate)
      : undefined,
    recurringDueDate: invoice.recurringDueDate
      ? (invoice.recurringDueDate instanceof Date ? invoice.recurringDueDate.toISOString() : invoice.recurringDueDate)
      : undefined,
    items: invoice.items.map((item: any) => ({
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
    createdAt: invoice.createdAt instanceof Date ? invoice.createdAt.toISOString() : invoice.createdAt,
    updatedAt: invoice.updatedAt instanceof Date ? invoice.updatedAt.toISOString() : invoice.updatedAt,
    __v: invoice.__v ?? undefined,
    isPaid: invoice.isPaid,
    paymentId: invoice.paymentId,
    currency: invoice.currency
  };
}



async function getData(): Promise<InvoiceType[]> {
  try {
    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      console.log("Unauthorized");
      throw new Error("Unauthorized");
    }

    const userId = session.user._id;
    const invoices = await InvoiceModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean<IndividualInvoiceFromDataBaseType[]>();

    // console.log("Get your invoice type:", invoices[0]);  //for debugging


    if (!invoices) {
      console.log("No Clients Found");
      return [];
    }

    return invoices.map(sanitizeInvoice);


    return [];
  } catch (error) {
    console.error("Error in fetching clients:", error);
    return [];
  }
}

function filterInvoicesForLast30Days(invoices: InvoiceType[]): InvoiceType[] {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // Get the date 30 days ago

  return invoices.filter(invoice => {
    const createdAtDate = new Date(invoice.createdAt); // Convert ISO string to Date
    return createdAtDate >= thirtyDaysAgo;
  });
}




export default async function ClientsDesktopView() {
  const invoiceData = await getData();

  const last30DaysInvoiceData = filterInvoicesForLast30Days(invoiceData);

  const { totalInvoices,
    totalAmountINRClients,
    totalAmountUSDClients,
    totalOutstandingInvoices,
    totalOutstandingAmountINRClients,
    totalOutstandingAmountUSDClients,
  } = getInvoiceStats(last30DaysInvoiceData);


  return (
    <div className="h-full flex flex-col bg-white p-5 rounded-lg container mx-auto">
      {/* Top Cards Section */}
      <section className="flex space-x-[12px] mb-[38px]">

        <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
          <CardContent className="flex justify-between">

            <HeaderInfoCard mainText={"Total Invoices"} count={`${totalInvoices}`} />

            {/* <HeaderStats
              percentageChange={23}
              isIncreased={true}
              bottomText={"from last month"}
            /> */}
            <div className="flex items-center">
              <p className="text-muted-foreground text-[14px]">Last 30 Days</p>
            </div>

          </CardContent>
        </Card>

        <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
          <CardContent className="flex justify-between">

            <HeaderInfoCardInvoices
              mainText={"Total Amount"}
              inrAmount={totalAmountINRClients}
              usdAmount={totalAmountUSDClients}
            />

            {/* <HeaderStats
              percentageChange={23}
              isIncreased={true}
              bottomText={"from last month"}
            /> */}
            <div className="flex items-center">
              <p className="text-muted-foreground text-[14px]">Last 30 Days</p>
            </div>

          </CardContent>
        </Card>

        <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
          <CardContent className="flex justify-between">

            <HeaderInfoCard mainText={"Outstanding Invs."} count={`${totalOutstandingInvoices}`} />
            <div className="flex items-center">
              <p className="text-muted-foreground text-[14px]">Last 30 Days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
          <CardContent className="flex justify-between">


            <HeaderInfoCardInvoices
              mainText={"Outstanding"}
              inrAmount={totalOutstandingAmountINRClients}
              usdAmount={totalOutstandingAmountUSDClients}
            />

            <div className="flex items-center">
              <p className="text-muted-foreground text-[14px]">Last 30 Days</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Desktop and Tablet View Table Section */}
      <section className="hidden md:block w-full flex-1 overflow-scroll">
        <InvoiceDataTable
          columns={columns}
          data={invoiceData}
        />
      </section>
    </div>
  );
}
