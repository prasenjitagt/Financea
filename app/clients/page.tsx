import { ClientType, columns } from "@/app/clients/columns";
import { DataTable } from "@/app/clients/data-table"
import connectDB from "@/lib/database/db_connection";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "../api/auth/[...nextauth]/options";
import { Client } from "@/lib/models/Clients.model";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

import { Types } from "mongoose";

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
  await connectDB("app/clients/page.tsx");
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


    // Sanitize before returning
    return clients.map(sanitizeClient);
  } catch (error) {
    console.error("Error in fetching clients:", error);
    return [];
  }
}




export default async function ClientsDesktopView() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10 ">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
