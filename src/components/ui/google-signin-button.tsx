"use client";

import { Button } from "./button";
import { useState } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useLogin } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { setAuthCookie } from "@/app/(auth)/login/authOptions";
import { LoginType } from "@/utils/constants";
import { useToast } from "@/hooks/use-toast";

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const loginMutation = useLogin();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Use the returned user info to call your login API
      const credentials = {
        email: user.email || "",
        // Use the Firebase user's localId (uid) as the password
        password: user.uid,
        login_type: LoginType.GOOGLE,
        role: "customer",
      };
      
      // Call your login API with the Google credentials
      const data = await loginMutation.mutateAsync(credentials);
      
      if (!data.error && data.token && data.records) {
        const { records, token } = data;
        
        // Set user data in your store
        useAuthStore.getState().setUser(records);
        useAuthStore.getState().setToken(token);
        await setAuthCookie(token);
        
        // Redirect to home page
        router.push("/");
      } else {
        throw new Error(data.message ?? "Login failed");
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