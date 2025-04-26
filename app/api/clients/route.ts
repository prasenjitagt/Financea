/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db_connection";
import { Client } from "@/lib/models/Clients.model";
import { clientSchema } from "@/lib/helpers/validations";
import { getServerSession } from "next-auth";
import { FinanceaAuthOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {

    await connectDB("api/clients/route.ts");
    //get UserID from session
    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user._id;


    const body = await req.json();

    const validation = clientSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const newClient = new Client({
      ...validation.data,
      userId
    });

    await newClient.save();

    return NextResponse.json(
      { message: "Client saved successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in saving client:", error);
    return NextResponse.json(
      { error: "Server error or invalid token" },
      { status: 500 }
    );
  }
}

// GET method to fetch all clients for a user
export async function GET(req: Request) {
  try {
    await connectDB("api/clients/route.ts");

    //get UserID from session
    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user._id;



    // Fetch all clients belonging to the logged-in user
    const clients = await Client.find({ userId }).sort({ createdAt: -1 });

    if (!clients) {
      return NextResponse.json(clients, { status: 200 });

    }

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error("Error in fetching clients:", error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}

//Delete Handler : 
export async function DELETE(req: Request) {
  try {
    await connectDB("api/clients/route.ts");

    //get UserID from session
    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user._id;


    const { clientIds } = await req.json();

    if (!Array.isArray(clientIds) || clientIds.length === 0) {
      return NextResponse.json(
        { error: "No client IDs provided" },
        { status: 400 }
      );
    }

    const deleteResult = await Client.deleteMany({
      _id: { $in: clientIds },
      userId,
    });

    return NextResponse.json(
      {
        message: `${deleteResult.deletedCount} client(s) deleted successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in deleting clients:", error);
    return NextResponse.json(
      { error: "Server error or invalid token" },
      { status: 500 }
    );
  }
}