// app/api/clients/stats/route.ts

import { NextResponse } from "next/server";
import { Client } from "@/lib/models/Clients.model";
import connectDB from "@/lib/database/db_connection";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "../../auth/[...nextauth]/options";


export async function GET() {
  try {
    await connectDB("api/clients/stats/route.ts");

    const session = await getServerSession(FinanceaAuthOptions);

    if (!session) {

      console.log("Unauthorized");

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user._id;

    // Find all clients by this user
    const clients = await Client.find({ userId: userId });


    if (!clients) {
      console.error("No clients Found")
    }



    // Total count
    const totalClients = clients.length;

    // Group by week (for line chart)
    const clientsPerWeek: Record<string, number> = {};

    //total Charge : 
    const totalServiceCharge: number = clients.reduce((sum, client) => sum + client.serviceCharge, 0);

    clients.forEach((client) => {
      const createdAt = new Date(client.createdAt);
      const weekStart = new Date(createdAt);
      weekStart.setDate(createdAt.getDate() - createdAt.getDay()); // Start of week (Sunday)
      const key = weekStart.toISOString().split("T")[0]; // YYYY-MM-DD
      clientsPerWeek[key] = (clientsPerWeek[key] || 0) + 1;
    });

    const chartData = Object.entries(clientsPerWeek).map(([date, value]) => ({
      name: date,
      value,
    })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    return NextResponse.json({ totalClients, totalServiceCharge, chartData }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error: " + err }, { status: 500 });
  }
}
