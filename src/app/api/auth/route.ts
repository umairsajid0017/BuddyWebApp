import { NextRequest, NextResponse } from "next/server";
import { guestAuth, googleAuth } from "@/apis/auth";

export async function POST(request: NextRequest) {
  try {
    const { authType, userData } = await request.json();

    if (!authType || !userData) {
      return NextResponse.json(
        { error: true, message: "Auth type and user data are required" },
        { status: 400 }
      );
    }

    try {
      switch (authType) {
        case 'guest': {
          if (!userData.email || !userData.password) {
            return NextResponse.json(
              { error: true, message: "Guest data is required" },
              { status: 400 }
            );
          }

          const { email, password, name, phone } = userData;
          
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
        }

        case 'google': {
          if (!userData.email) {
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
        }

        default:
          return NextResponse.json(
            { error: true, message: "Invalid authentication type" },
            { status: 400 }
          );
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      return NextResponse.json(
        error.response?.data || { error: true, message: "Authentication failed" },
        { status: error.response?.status || 500 }
      );
    }
  } catch (error: any) {
    console.error("Server-side authentication error:", error);
    return NextResponse.json(
      { error: true, message: error.message || "Authentication failed" },
      { status: 500 }
    );
  }
} 