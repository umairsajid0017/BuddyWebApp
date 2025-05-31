import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

interface StepThreeProps {
  handleVerifyEmail: (verificationCode: number) => Promise<void>;
  autoOtp?: number | null; // Auto-populated OTP from the API as number
  handleSendOtp: () => Promise<void>; // Function to send OTP
}

const StepThree: React.FC<StepThreeProps> = ({ handleVerifyEmail, autoOtp, handleSendOtp }) => {
  const [verificationCode, setVerificationCode] = useState<string>(""); // InputOTP still uses string

  // Auto-populate the OTP when autoOtp is provided
  useEffect(() => {
    if (autoOtp) {
      // Convert number to string for InputOTP component, ensure 6 digits
      const otpString = String(autoOtp).padStart(6, '0').slice(0, 6);
      setVerificationCode(otpString);
    }
  }, [autoOtp]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Convert string back to number for the API
    const otpNumber = Number(verificationCode);
    handleVerifyEmail(otpNumber);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2 flex items-center justify-center">
        <InputOTP
          maxLength={6}
          value={verificationCode}
          onChange={(value) => setVerificationCode(value)}
        >
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
      <Button type="submit" className="w-full">Verify and Create Account</Button>
      <p className="text-center text-sm">
        <button 
          type="button"
          onClick={handleSendOtp}
          className="text-primary hover:underline"
        >
          I did not receive a code. Resend
        </button>
      </p>
    </form>
  );
};

export default StepThree;