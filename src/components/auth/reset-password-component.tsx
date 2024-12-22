"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequestResetOtp, useResetPassword } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export function ResetPasswordComponent() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const requestOtpMutation = useRequestResetOtp();
  const resetPasswordMutation = useResetPassword();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      emailSchema.parse({ email });

      const response = await requestOtpMutation.mutateAsync({ email });

      if (!response.error) {
        toast.success("OTP sent to your email");
        setStep("reset");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      resetSchema.parse({ email, password, otp });

      const response = await resetPasswordMutation.mutateAsync({
        email,
        password,
        otp,
      });

      if (!response.error) {
        toast.success("Password reset successfully");
        router.push("/login");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          {step === "email"
            ? "Enter your email to receive a reset code"
            : "Enter the code sent to your email and your new password"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "email" ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={requestOtpMutation.isLoading}
            >
              {requestOtpMutation.isLoading ? "Sending..." : "Send Reset Code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {errors.otp && (
                <p className="text-sm text-destructive">{errors.otp}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={resetPasswordMutation.isLoading}
            >
              {resetPasswordMutation.isLoading
                ? "Resetting..."
                : "Reset Password"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="link"
          onClick={() => router.push("/login")}
          className="text-sm text-muted-foreground"
        >
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
}
