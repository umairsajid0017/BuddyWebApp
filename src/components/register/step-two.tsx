import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RegisterData } from "@/lib/types";
import Loading from "@/components/ui/loading";

interface StepTwoProps {
  formData: RegisterData;
  errors: Partial<Record<keyof RegisterData, string>>;
  backendErrors: Record<string, string[]>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleBackStep: () => void;
  isLoading: boolean;
}

const StepTwo: React.FC<StepTwoProps> = ({ formData, errors,   backendErrors,  handleChange, handleSubmit, handleBackStep, isLoading }) => {
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

      {backendErrors && Object.keys(backendErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            {Object.entries(backendErrors).map(([field, messages]) => (
              <div key={field}>
                {/* <strong>{field}:</strong>  */}
                {messages.join(", ")}
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}
      
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
          className="w-1/2 transition-all duration-300"
          disabled={isLoading}
          variant={isLoading ? "ghost": "default"}
        >
          {isLoading ? <Loading/> : "Sign up"}
        </Button>
      </div>
    </form>
  );
};

export default StepTwo;