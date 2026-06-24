import { NextResponse } from "next/server";
import { verifyUserCredentials } from "@/app/actions/auth";

/**
 * API Route wrapper for verifyUserCredentials server action
 * For testing purposes only
 */
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await verifyUserCredentials(email, password);
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 401 });
    }
  } catch (error) {
    console.error("Error in verify-credentials API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
