import User from "@/models/user";
import { NextResponse } from "next/server";
import { connectDB, disconnectDB } from "@/lib/MongoDB";

export const POST = async (request) => {
  try {
    const { email } = await request.json();
    await connectDB();
    const user = await User.findOne({ email }).select("_id");
    console.log(user);
    return NextResponse.json(
      {
        user,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "An error occurred while checking user existence.",
      },
      {
        status: 500,
      },
    );
  } finally {
    await disconnectDB();
  }
};
