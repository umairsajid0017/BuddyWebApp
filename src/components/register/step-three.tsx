import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

interface StepThreeProps {
  handleVerifyEmail: (verificationCode: string) => Promise<void>;
}

const StepThree: React.FC<StepThreeProps> = ({ handleVerifyEmail }) => {
  const [verificationCode, setVerificationCode] = useState<string>("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleVerifyEmail(verificationCode);
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
        <a href="#" className="text-primary hover:underline">I did not receive a code. Resend</a>
      </p>
    </form>
  );
};

export default StepThree;