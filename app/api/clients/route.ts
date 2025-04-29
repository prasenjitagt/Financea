import { NextRequest, NextResponse } from "next/server";
import { FinanceaAuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/database/db_connection";
import { Client } from "@/lib/models/Clients.model";
import { clientSchema } from "@/lib/helpers/validations";

export async function POST(req: Request) {
  try {

    await connectDB("api/clients/route.ts");


    //get UserID from session
    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      console.log("Unauthorized");
      throw new Error("Unauthorized");
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
export async function GET() {
  try {
    await connectDB("api/clients/route.ts");

    //get UserID from session
    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      console.log("Unauthorized");
      throw new Error("Unauthorized");
    }
    const userId = session.user._id;



    // Fetch all clients belonging to the logged-in user
    const clients = await Client.find({ userId }).sort({ createdAt: -1 });

    if (!clients) {
      console.log("No Clinets Found");
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

// DELETE Handler
export async function DELETE(req: NextRequest) {
  try {
    await connectDB("api/clients/route.ts");

    const session = await getServerSession(FinanceaAuthOptions);
    if (!session) {
      console.log("Unauthorized");
      throw new Error("Unauthorized");
    }

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    const deleteResult = await Client.findByIdAndDelete(clientId);

    if (!deleteResult) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Client deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting Client:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
