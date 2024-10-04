import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { RegisterData } from "@/lib/types";

interface StepTwoProps {
  formData: RegisterData;
  errors: Partial<Record<keyof RegisterData, string>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleBackStep: () => void;
  isLoading: boolean;
}

const StepTwo: React.FC<StepTwoProps> = ({ formData, errors, handleChange, handleSubmit, handleBackStep, isLoading }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <Alert variant="destructive" className="text-xs text-red-600">{errors.password}</Alert>
        )}
      </div>
      <div className="flex space-x-2">
        <Button
          type="button"
          className="w-1/2"
          onClick={handleBackStep}
          variant="outline"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-1/2"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </Button>
      </div>
    </form>
  );
};

export default StepTwo;