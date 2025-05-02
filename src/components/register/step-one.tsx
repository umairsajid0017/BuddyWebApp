import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { GoogleSignInButton } from "@/components/ui/google-signin-button";
import { GuestLoginButton } from "@/components/ui/guest-login-button";
import { Separator } from "../ui/separator";
import { RegisterData } from "@/apis/api-request-types";

interface StepOneProps {
  formData: RegisterData;
  errors: Partial<Record<keyof RegisterData, string>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNextStep: () => void;
}

const StepOne: React.FC<StepOneProps> = ({
  formData,
  errors,
  handleChange,
  handleNextStep,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && (
          <Alert variant="destructive" className="text-xs text-red-600">
            {errors.name}
          </Alert>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-address">Email address</Label>
        <Input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Your email address"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <Alert variant="destructive" className="text-xs text-red-600">
            {errors.email}
          </Alert>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="text"
          required
          placeholder="Your mobile number"
          value={formData.phone || "+968"}
          onChange={handleChange}
        />
        {errors.phone && (
          <Alert variant="destructive" className="text-xs text-red-600">
            {errors.phone}
          </Alert>
        )}
      </div>
      <Button type="button" onClick={handleNextStep} className="w-full">
        Next
      </Button>
      
      <div className="relative my-4">
       <Separator />
       
      </div>
      
      <GoogleSignInButton />
      
      <div className="mt-2">
        <GuestLoginButton />
      </div>
    </div>
  );
};

export default StepOne;
