import { NextRequest, NextResponse } from "next/server";
import { guestAuth } from "@/apis/auth";

export async function POST(request: NextRequest) {
  try {
    const { guestData } = await request.json();

    if (!guestData || !guestData.email || !guestData.password) {
      return NextResponse.json(
        { error: true, message: "Guest data is required" },
        { status: 400 }
      );
    }

    const { email, password, name, phone } = guestData;
    
    // First attempt to register the guest user
    console.log("Registering guest user:", { email, name, phone });
    const registerResponse = await guestAuth.register({ email, password, name, phone });
    
    if (registerResponse.error) {
      return NextResponse.json(registerResponse, { status: 400 });
    }

    // After successful registration, login the guest
    console.log("Logging in guest user:", email);
    const loginResponse = await guestAuth.login({ email, password });
    
    if (loginResponse.error) {
      return NextResponse.json(loginResponse, { status: 400 });
    }
    
    // Return with status 201 to indicate a new account was created
    return NextResponse.json(loginResponse, { status: 201 });
  } catch (error: any) {
    console.error("Guest authentication error:", error);
    return NextResponse.json(
      { error: true, message: error.message || "Guest authentication failed" },
      { status: 500 }
    );
  }
} 