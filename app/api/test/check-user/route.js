import { NextResponse } from "next/server";
import { checkUserExists } from "@/app/actions/auth";

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await checkUserExists(email);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in check-user API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
