import { InvoiceType, columns } from "./columns";
import { DataTable } from "@/app/clients/data-table";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "../api/auth/[...nextauth]/options";
import HeaderInfoCard from "@/components/profile/header-info-card";
import HeaderStats from "@/components/profile/header-stats";
import { Card, CardContent } from "@/components/ui/card";
import InvoiceModel from "@/lib/models/Invoice.model";




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
    paymentId: raw.paymentId

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





export default async function ClientsDesktopView() {
  const invoiceData = await getData();

  const totalClients = invoiceData.length;

  const totalPayments = invoiceData.reduce((sum, invoice) => sum + invoice.totalAmount!, 0);

  return (
    <div className="h-full flex flex-col bg-white p-5 rounded-lg container mx-auto">
      {/* Top Cards Section */}
      <section className="flex space-x-[12px] mb-[38px]">

        <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
          <CardContent className="flex justify-between">

            <HeaderInfoCard mainText={"Total Invoices"} count={`40`} />

            <HeaderStats
              percentageChange={23}
              isIncreased={true}
              bottomText={"from last month"}
            />

          </CardContent>
        </Card>

        <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
          <CardContent className="flex justify-between">

            <HeaderInfoCard mainText={"Total Payment"} count={`$1200`} />

            <HeaderStats
              percentageChange={23}
              isIncreased={true}
              bottomText={"from last month"}
            />

          </CardContent>
        </Card>

        <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
          <CardContent className="flex justify-between">

            <HeaderInfoCard mainText={"Outstanding Invoices"} count={`2`} />

          </CardContent>
        </Card>

        <Card className="flex justify-center w-[273px] h-[106px] bg-[#FCFDFF]">
          <CardContent className="flex justify-between">

            <HeaderInfoCard mainText={"Outstanding Payment"} count={`$1200`} />


          </CardContent>
        </Card>
      </section>

      {/* Desktop and Tablet View Table Section */}
      <section className="hidden md:block w-full flex-1 overflow-scroll">
        <DataTable
          columns={columns}
          data={invoiceData}
        />
      </section>
    </div>
  );
}
