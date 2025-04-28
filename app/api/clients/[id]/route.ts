import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import { Client } from "@/lib/models/Clients.model";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "../../auth/[...nextauth]/options";

export async function GET(
  req: Request,
  { params }: { params: { id: string } } // Type for params is already set correctly here
) {


  try {
    await connectDB("api/clients/[id]/route.ts");

    //get UserID from session
    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      console.log("Unauthorized");
      throw new Error("Unauthorized");
    }
    const userId = session.user._id;

    const param = await params;

    const clientId = await param.id; // Ensure that params is correctly destructured and typed

    const client = await Client.findOne({ _id: clientId, userId: userId }).lean();

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(client, { status: 200 });
  } catch (error) {
    console.error("Error in fetching client:", error);
    return NextResponse.json(
      { error: "Server error or invalid token" },
      { status: 500 }
    );
  }
}
