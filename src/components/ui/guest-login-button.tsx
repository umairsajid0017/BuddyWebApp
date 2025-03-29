"use client";

import { Button } from "./button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { setAuthCookie } from "@/app/(auth)/login/authOptions";
import { useToast } from "@/hooks/use-toast";
import { LoginType } from "@/utils/constants";
import axios from "axios";

export function GuestLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const generateRandomData = () => {
    // Generate a random string for email and password
    const randomString = Math.random().toString(36).substring(2, 15);
    const timestamp = new Date().getTime();
    
    return {
      email: `guest_${randomString}_${timestamp}@buddyapp.guest`,
      password: `Guest_${randomString}_${timestamp}`, // Make sure it meets password requirements
      name: `Guest User ${randomString.substring(0, 5)}`,
      phone: `+968${Math.floor(10000000 + Math.random() * 90000000)}` // 8 digits after +968
    };
  };

  const handleGuestLogin = async () => {
    try {
      setIsLoading(true);
      
      // Generate random user credentials
      const guestData = generateRandomData();
      
      // Call the server-side API for guest registration and login
      const response = await axios.post('/api/auth/guest', { guestData });
      const data = response.data;
      
      if (!data.error && data.token && data.records) {
        const { records, token } = data;
        
        console.log("Guest login successful:", data);
        
        // Store user data in auth store
        useAuthStore.getState().setUser(records);
        useAuthStore.getState().setToken(token);
        
        // Set auth cookie
        await setAuthCookie(token);
        
        toast({
          title: "Logged in as guest",
          description: "You have been logged in as a guest user.",
        });
        
        // Redirect to home page
        router.push("/");
      } else {
        // Handle error case
        throw new Error(data.message ?? "Guest login failed");
      }
    } catch (error) {
      console.error("Guest login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Guest login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading}
      onClick={handleGuestLogin}
      className="w-full"
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <svg
          className="mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )}
      Continue as Guest
    </Button>
  );
} 