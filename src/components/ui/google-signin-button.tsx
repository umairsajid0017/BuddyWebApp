"use client";

import { Button } from "./button";
import { useState } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { setAuthCookie } from "@/app/(auth)/login/authOptions";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Sign in with Google popup on the client side
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      if (!user) {
        throw new Error("Failed to get user data from Google");
      }
      
      // Prepare user data to send to server
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        providerData: user.providerData
      };
      
      // Send the user data to our server-side API for login/registration
      const response = await axios.post('/api/auth/google', { userData });
      const data = response.data;
      
      if (!data.error && data.token && data.records) {
        const { records, token } = data;
        
        console.log("Authentication successful:", data);
        
        // Store user data in auth store
        useAuthStore.getState().setUser(records);
        useAuthStore.getState().setToken(token);
        
        // Set auth cookie
        await setAuthCookie(records, token);

        // Show toast message based on whether it was a new account or existing login
        if (response.status === 201) {
          toast({
            title: "Account created",
            description: "Your account has been created successfully.",
          });
        } else {
          toast({
            title: "Logged in",
            description: "You have been successfully logged in.",
          });
        }
        
        // Redirect to home page
        router.push("/");
      } else {
        // Handle error case
        throw new Error(data.message ?? "Authentication failed");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Google sign-in failed",
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
      onClick={handleGoogleSignIn}
      className="w-full"
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="144"
          height="144"
          viewBox="0 0 48 48"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          ></path>
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          ></path>
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
        </svg>
      )}
      Continue with Google
    </Button>
  );
} 