//app/invoices/page.tsx

import { InvoiceType, columns } from "./columns";
import { InvoiceDataTable } from "@/app/invoices/data-table";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "../api/auth/[...nextauth]/options";
import HeaderInfoCardInvoices from "@/components/invoices/header-info-card-invoices";
import HeaderStats from "@/components/profile/header-stats";
import { Card, CardContent } from "@/components/ui/card";
import InvoiceModel from "@/lib/models/Invoice.model";
import HeaderInfoCard from "@/components/profile/header-info-card";
import { getInvoiceStats } from "@/lib/helpers/invoices/getInvoiceStats";




export function sanitizeInvoice(raw: any): InvoiceType {
  return {
    _id: raw._id.toString(),
    user: raw.user.toString(),
    client: raw.client.toString(),
    invoiceNumber: raw.invoiceNumber,
    issueDate: raw.issueDate instanceof Date ? raw.issueDate.toISOString() : raw.issueDate,
    dueDate: raw.dueDate ? (raw.dueDate instanceof Date ? raw.dueDate.toISOString() : raw.dueDate) : undefined,
    clientEmail: raw.clientEmail,
    clientName: raw.clientName,
    clientMobile: Number(raw.clientMobile),
    isRecurring: Boolean(raw.isRecurring),
    recurringFrequency: raw.recurringFrequency ?? undefined,
    recurringIssueDate: raw.recurringIssueDate
      ? (raw.recurringIssueDate instanceof Date ? raw.recurringIssueDate.toISOString() : raw.recurringIssueDate)
      : undefined,
    recurringDueDate: raw.recurringDueDate
      ? (raw.recurringDueDate instanceof Date ? raw.recurringDueDate.toISOString() : raw.recurringDueDate)
      : undefined,
    items: raw.items.map((item: any) => ({
      ishourly: Boolean(item.ishourly),
      name: item.name,
      quantity: Number(item.quantity),
      rate: Number(item.rate),
      _id: item._id.toString(),
    })),
    discountPercent: Number(raw.discountPercent),
    taxPercent: Number(raw.taxPercent),
    note: raw.note ?? undefined,
    terms: raw.terms ?? undefined,
    subTotal: Number(raw.subTotal),
    discountAmount: Number(raw.discountAmount),
    taxAmount: Number(raw.taxAmount),
    totalAmount: Number(raw.totalAmount),
    createdAt: raw.createdAt instanceof Date ? raw.createdAt.toISOString() : raw.createdAt,
    updatedAt: raw.updatedAt instanceof Date ? raw.updatedAt.toISOString() : raw.updatedAt,
    __v: raw.__v ?? undefined,
    isPaid: raw.isPaid,
    paymentId: raw.paymentId,
    currency: raw.currency
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
    const invoices = await InvoiceModel.find({ user: userId }).sort({ createdAt: -1 }).lean();

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
