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
          className="mr-2 h-4 w-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          />
        </svg>
      )}
      Sign in with Google
    </Button>
  );
} 