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
import connectDB from "@/lib/database/db_connection";
import { sanitizeInvoice } from "@/components/invoices/sanitize_invoice";






async function getData(): Promise<InvoiceType[]> {
  try {
    await connectDB("app/invoices/page.tsx");

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




export default async function InvoicesDesktopView() {
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
    <div className="h-full flex flex-col border p-5 rounded-lg container mx-auto">
      {/* Top Cards Section */}
      <section className="flex space-x-[12px] mb-[38px]">

        <Card className="flex justify-center w-[273px] h-[106px] border">
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

        <Card className="flex justify-center w-[273px] h-[106px] border">
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

        <Card className="flex justify-center w-[273px] h-[106px] border">
          <CardContent className="flex justify-between">

            <HeaderInfoCard mainText={"Outstanding Invs."} count={`${totalOutstandingInvoices}`} />
            <div className="flex items-center">
              <p className="text-muted-foreground text-[14px]">Last 30 Days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex justify-center w-[273px] h-[106px] border">
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
