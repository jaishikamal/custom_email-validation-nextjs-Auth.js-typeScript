import { NextResponse } from "next/server";
import { registerUser } from "@/app/actions/auth";
export async function POST(request) {
  try {
    const { name, address, email, password } = await request.json();
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const result = await registerUser(name, address, email, password);
    
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("Error in register API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
