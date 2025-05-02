import { NextRequest, NextResponse } from "next/server";
import { LoginType } from "@/constants/constantValues";
import axios from "axios";
import { Endpoints } from "@/apis/endpoints";


export async function POST(request: NextRequest) {
  try {
    // Get the guest user data from client side
    const { guestData } = await request.json();

    if (!guestData || !guestData.email || !guestData.password) {
      return NextResponse.json({ error: true, message: "Guest data is required" }, { status: 400 });
    }

    const { email, password, name, phone } = guestData;
    
    // First attempt to register the guest user
    console.log("Registering guest user:", { email, name, phone });
    
    try {
      // Create FormData for registration
      const registerFormData = new FormData();
      registerFormData.append('name', name);
      registerFormData.append('email', email);
      registerFormData.append('password', password);
      registerFormData.append('phone', phone);
      registerFormData.append('login_type', LoginType.GUEST);
      registerFormData.append('role', 'customer');
      
      const registerResponse = await axios.post(Endpoints.REGISTER, registerFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Guest registration response:", registerResponse.data);

      if (registerResponse.data.error) {
        return NextResponse.json(registerResponse.data, { status: 400 });
      }

      // After successful registration, login the guest
      console.log("Logging in guest user:", email);
      const loginFormData = new FormData();
      loginFormData.append('email', email);
      loginFormData.append('password', password);
      loginFormData.append('login_type', LoginType.GUEST);
      loginFormData.append('role', 'customer');
      
      const loginResponse = await axios.post(Endpoints.LOGIN, loginFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Guest login response:", loginResponse.data);
      
      // Check the login response
      if (loginResponse.data.error) {
        return NextResponse.json(loginResponse.data, { status: 400 });
      }
      
      // Return with status 201 to indicate a new account was created
      return NextResponse.json(loginResponse.data, { status: 201 });
      
    } catch (error: any) {
      console.error("Guest registration/login error:", error);
      
      return NextResponse.json(
        error.response?.data || { error: true, message: "Guest authentication failed" },
        { status: error.response?.status || 500 }
      );
    }
    
  } catch (error: any) {
    console.error("Server-side guest authentication error:", error);
    return NextResponse.json(
      { error: true, message: error.message || "Guest authentication failed" },
      { status: 500 }
    );
  }
}