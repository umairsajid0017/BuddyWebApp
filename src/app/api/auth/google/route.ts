import { NextRequest, NextResponse } from "next/server";
import { googleAuth } from "@/apis/auth";

export async function POST(request: NextRequest) {
  try {
    const { userData } = await request.json();

    console.log("userData", userData);

    if (!userData || !userData.email) {
      return NextResponse.json(
        { error: true, message: "User data is required" },
        { status: 400 }
      );
    }

    // Try to log in the user first
    console.log("Attempting to login Google user:", userData.email);
    const loginResponse = await googleAuth.login(userData);

    // If login successful, return user data
    if (!loginResponse.error) {
      return NextResponse.json(loginResponse);
    }

    // If user doesn't exist, register them
    if (loginResponse.error_code === "user_not_exists") {
      console.log("User doesn't exist, registering...");
      const registerResponse = await googleAuth.register(userData);

      if (registerResponse.error) {
        return NextResponse.json(registerResponse, { status: 400 });
      }

      // Try to log in again after registration
      const loginAfterRegisterResponse = await googleAuth.login(userData);
      
      if (loginAfterRegisterResponse.error) {
        return NextResponse.json(loginAfterRegisterResponse, { status: 400 });
      }
      
      // Return with status 201 to indicate a new account was created
      return NextResponse.json(loginAfterRegisterResponse, { status: 201 });
    }

    // Handle other error types
    return NextResponse.json(loginResponse, { status: 400 });
  } catch (error: any) {
    console.error("Google authentication error:", error);
    return NextResponse.json(
      { error: true, message: error.message || "Authentication failed" },
      { status: 500 }
    );
  }
} 