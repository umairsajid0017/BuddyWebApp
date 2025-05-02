"use client";

import { Button } from "./button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/apis/apiCalls'
import { setAuthCookie } from "@/app/(auth)/login/authOptions";
import { useToast } from "@/hooks/use-toast";
import { LoginType } from "@/utils/constants";
import axios from "axios";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

export function GuestLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Check if current user is already a guest
  const isAlreadyGuest = user?.login_type === LoginType.GUEST;

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
    // Prevent guest users from logging in as guest again
    if (isAlreadyGuest) {
      toast({
        title: "Already a guest",
        description: "You are already logged in as a guest user.",
        variant: "destructive",
      });
      return;
    }
    
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
        
        // Set auth cookie
        await setAuthCookie(records, token);
        
        toast({
          title: "Logged in as guest",
          description: "Your session will end when you close the browser.",
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            <Button
              variant="outline"
              type="button"
              disabled={isLoading || isAlreadyGuest}
              onClick={handleGuestLogin}
              className={`group relative w-full overflow-hidden transition-all duration-300 ${
                isAlreadyGuest 
                  ? "cursor-not-allowed opacity-60" 
                  : "hover:bg-secondary-100 hover:text-secondary-900"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <svg
                    className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110"
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
                <span className="relative">
                  {isLoading ? "Logging in..." : "Continue as Guest"}
                </span>
              </span>
              
              {!isAlreadyGuest && (
                <span className="absolute bottom-0 left-0 h-0 w-full bg-secondary-100 transition-all duration-300 group-hover:h-full"></span>
              )}
            </Button>
          </div>
        </TooltipTrigger>
        {isAlreadyGuest && (
          <TooltipContent>
            <p>You are already logged in as a guest user</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
} 