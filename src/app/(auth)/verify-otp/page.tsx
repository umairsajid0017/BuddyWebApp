"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSendOtp, useVerifyOtp } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const OTPVerification = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const email = searchParams.get("email");
  const type =
    (searchParams.get("type") as "register" | "reset" | "verify") || "register";

  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(3);

  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();

  useEffect(() => {
    if (!email) {
      router.push("/");
      return;
    }
    handleSendOTP();
  }, [email]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOTP = async () => {
    try {
      const response = await sendOtpMutation.mutateAsync({
        email: email!,
        role: "customer",
      });

      if (!response.error) {
        setResendTimer(60);
        if (response.records?.remaining_attempts !== undefined) {
          setRemainingAttempts(response.records.remaining_attempts);
        }
        toast({
          title: "OTP Sent",
          description: "Please check your email for the verification code.",
        });
      } else {
        if (response.records?.next_retry_at) {
          const waitTime = Math.ceil(
            (new Date(response.records.next_retry_at).getTime() - Date.now()) /
              1000,
          );
          setResendTimer(waitTime);
        }
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send OTP. Please try again.",
      });
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter the OTP.",
      });
      return;
    }

    try {
      const response = await verifyOtpMutation.mutateAsync({
        email: email!,
        otp,
      });

      if (response.message && !response.error) {
        toast({
          title: "Success",
          description: "Email verified successfully.",
        });
        router.push(type === "reset" ? "/reset-password" : "/login");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      const errorMessage = error || "Failed to verify OTP";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage.toString(),
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="min-w-screen flex w-full items-center justify-center p-4">
      <Card className="h-[90%] w-full max-w-md">
        <CardHeader className="pb-2">
          <div className="mb-4 flex justify-center">
            <Link href="/">
              <Image
                src="/assets/logo.png"
                alt="Buddy Logo"
                className="h-16 w-16"
                width={64}
                height={64}
              />
            </Link>
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            Verify Your Email
          </CardTitle>
          <p className="text-center text-sm text-gray-600">
            We sent a verification code to {email}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {remainingAttempts < 3 && (
              <p className="text-center text-sm text-yellow-600">
                {remainingAttempts} attempts remaining
              </p>
            )}
          </div>

          <Button
            className="w-full"
            onClick={handleVerifyOTP}
            disabled={!otp || verifyOtpMutation.isLoading}
          >
            {verifyOtpMutation.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Verify Email
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn&apos;t receive the code?
            </p>
            <Button
              variant="link"
              onClick={handleSendOTP}
              disabled={resendTimer > 0 || sendOtpMutation.isLoading}
              className="text-sm"
            >
              {sendOtpMutation.isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : resendTimer > 0 ? (
                `Resend in ${formatTime(resendTimer)}`
              ) : (
                "Resend Code"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default OTPVerification;
