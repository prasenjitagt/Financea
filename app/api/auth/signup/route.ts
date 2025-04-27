import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User.model";
import { signupSchema } from "@/lib/helpers/validations";
import connectDB from "@/lib/database/db_connection";

export async function POST(req: NextRequest) {
  try {
    await connectDB("/auth/signup/route.ts")

    const body = await req.json();


    // Validate input using Zod
    const parsedData = signupSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }


    connectDB("api/auth/signup/route.ts");

    // Check if user already exists
    const existingUser = await User.findOne({ email: parsedData.data.email });
    if (existingUser) {

      console.log("email exits");

      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUserPayload = {
      email: parsedData.data.email,
      username: parsedData.data.username,
      password: hashedPassword
    }


    // Hash password
    const newUser = new User(newUserPayload);

    await newUser.save();



    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error Singinup:", error);

    return NextResponse.json({ error: "Internal Server issue" + error }, { status: 500 });
  }
}
