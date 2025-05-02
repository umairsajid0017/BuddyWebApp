import { NextRequest, NextResponse } from "next/server";
import { LoginType } from "@/utils/constants";
import axios from "axios";
import { Endpoints } from "@/apis/endpoints";


export async function POST(request: NextRequest) {
  try {
    // Get the Google auth data from client side
    const { userData } = await request.json();

    if (!userData || !userData.email) {
      return NextResponse.json({ error: true, message: "User data is required" }, { status: 400 });
    }

    const { email, displayName, uid, photoURL, providerData } = userData;
    
    // Get the Google ID from provider data
    const googleId = providerData && providerData[0]?.uid;
    
    if (!googleId) {
      return NextResponse.json({ error: true, message: "Google ID not found" }, { status: 400 });
    }

    // Try to log in the user with your API using FormData
    try {
      // Create FormData for login
      const loginFormData = new FormData();
      loginFormData.append('email', email);
      loginFormData.append('password', googleId);
      loginFormData.append('login_type', LoginType.GOOGLE);
      loginFormData.append('role', 'customer');

      console.log("URL: ", Endpoints.LOGIN);
      const loginResponse = await axios.post(Endpoints.LOGIN, loginFormData);
      console.log("loginResponse: ", loginResponse.data);

      // Check for error in the response data, even if HTTP status is 200
      if (loginResponse.data.error === true) {
        // Handle the "User not exists" error specifically
        if (loginResponse.data.error_code === "user_not_exists") {
          console.log("User doesn't exist, registering...");
          // Create FormData for registration
          const registerFormData = new FormData();
          registerFormData.append('name', displayName || email?.split('@')[0] || "Google User");
          registerFormData.append('email', email);
          registerFormData.append('password', googleId);
          registerFormData.append('phone', "+968" + (googleId.slice(-8)));
          registerFormData.append('login_type', LoginType.GOOGLE);
          registerFormData.append('role', 'customer');
          
          const registerResponse = await axios.post(Endpoints.REGISTER, registerFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log("registerResponse: ", registerResponse.data);

          // Check if registration was successful
          if (registerResponse.data.error) {
            return NextResponse.json(registerResponse.data, { status: 400 });
          }

          // Now try to log in again with FormData
          const loginAfterRegisterFormData = new FormData();
          loginAfterRegisterFormData.append('email', email);
          loginAfterRegisterFormData.append('password', googleId);
          loginAfterRegisterFormData.append('login_type', LoginType.GOOGLE);
          loginAfterRegisterFormData.append('role', 'customer');
          
          const loginAfterRegisterResponse = await axios.post(Endpoints.LOGIN, loginAfterRegisterFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log("loginAfterRegisterResponse: ", loginAfterRegisterResponse.data);
          
          // Check if the second login attempt was successful
          if (loginAfterRegisterResponse.data.error) {
            return NextResponse.json(loginAfterRegisterResponse.data, { status: 400 });
          }
          
          // Return with status 201 to indicate a new account was created
          return NextResponse.json(loginAfterRegisterResponse.data, { status: 201 });
        } else {
          // Handle other error types
          return NextResponse.json(loginResponse.data, { status: 400 });
        }
      }

      // If login successful, return user data and token
      return NextResponse.json(loginResponse.data);
    } catch (error: any) {
      console.error("API call error:", error);
      return NextResponse.json(
        error.response?.data || { error: true, message: "Authentication failed" },
        { status: error.response?.status || 500 }
      );
    }
  } catch (error: any) {
    console.error("Server-side Google authentication error:", error);
    return NextResponse.json(
      { error: true, message: error.message || "Authentication failed" },
      { status: 500 }
    );
  }
} 