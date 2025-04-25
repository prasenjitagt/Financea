import connectDB from "@/lib/database/db_connection";
import User from "@/lib/models/User.model";
import { NextRequest, NextResponse } from "next/server";




export async function POST(request: NextRequest) {


    try {
        connectDB("api/db/route.ts");
        const { email } = await request.json();
        console.log(email);

        // const user = await User.findOne({ email: "Test200@gmail.com" });
        // const user = await User.findOne({ email: email });
        const user = await User.find();

        if (!user) {
            return NextResponse.json({ message: "no user" }, { status: 404 });
        }


        return NextResponse.json({ message: user }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}