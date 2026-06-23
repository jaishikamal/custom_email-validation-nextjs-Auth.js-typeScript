import User from "../models/user";
import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "../lib/MongoDB";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
  try {
    const { name, address, email, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectDB();
    await User.create({ name, address, email, password: hashedPassword });
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error registering user" },
      { status: 500 },
    );
  } finally {
    await disconnectDB();
  }
};
