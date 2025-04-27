import { ClientType, columns } from "@/app/clients/columns";
import { ClientDataTable } from "@/app/clients/data-table";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "../api/auth/[...nextauth]/options";
import { Client } from "@/lib/models/Clients.model";
import ClientsPageTotalClientsCards from "@/components/clients/clients_page_total_clients_card";
import ClientsPageTotalPaymentsCards from "@/components/clients/clients_page_total_payments_card";

function sanitizeClient(client: any): ClientType {
  return {
    _id: client._id.toString(),
    clientName: client.clientName,
    companyName: client.companyName,
    email: client.email,
    mobile: client.mobile,
    address: client.address,
    postal: client.postal,
    state: client.state,
    country: client.country,
    serviceCharge: client.serviceCharge,
    website: client.website,
    isClientActive: client.isClientActive,
    userId: client.userId.toString(),
    createdAt: client.createdAt,
  };
}

async function getData(): Promise<ClientType[]> {
  try {
    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      console.log("Unauthorized");
      throw new Error("Unauthorized");
    }

    const userId = session.user._id;
    const clients = await Client.find({ userId }).sort({ createdAt: -1 }).lean();

    if (!clients) {
      console.log("No Clients Found");
      return [];
    }

    return clients.map(sanitizeClient);
  } catch (error) {
    console.error("Error in fetching clients:", error);
    return [];
  }
}




export default async function ClientsDesktopView() {
  const clientsData = await getData();

  const totalClients = clientsData.length;

  const totalPayments = clientsData.reduce((sum, client) => sum + client.serviceCharge, 0);

  return (
    <div className="h-full flex flex-col bg-white p-5 rounded-lg container mx-auto">
      {/* Top Cards Section */}
      <section className="flex space-x-[12px] mb-[38px]">
        <ClientsPageTotalClientsCards
          title="Total Clients"
          description="Last 30 Days"
          totalClients={totalClients}
        />
        <ClientsPageTotalPaymentsCards
          title="Total Payments"
          description="Outstanding Balance"
          clients={clientsData}
          totalPayments={totalPayments}
        />
      </section>

      {/* Desktop and Tablet View Table Section */}
      <section className="hidden md:block w-full flex-1 overflow-scroll">
        <ClientDataTable
          columns={columns}
          data={clientsData}
        />
      </section>
    </div>
  );
}
