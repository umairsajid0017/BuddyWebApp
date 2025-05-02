import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loading from "@/components/ui/loading";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "@/helpers/utils";
import { z } from "zod";
import { RegisterData } from "@/apis/api-request-types";

interface StepTwoProps {
  formData: RegisterData;
  errors: Partial<Record<keyof RegisterData, string>>;
  backendErrors: Record<string, string[]>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleBackStep: () => void;
  isLoading: boolean;
}

interface PasswordRequirement {
  text: string;
  validator: (password: string) => boolean;
  isMet: boolean;
}

const StepTwo: React.FC<StepTwoProps> = ({ formData, errors, backendErrors, handleChange, handleSubmit, handleBackStep, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
    { 
      text: "At least 8 characters", 
      validator: (pass) => pass.length >= 8,
      isMet: false 
    },
    { 
      text: "At least one uppercase letter", 
      validator: (pass) => /[A-Z]/.test(pass),
      isMet: false 
    },
    { 
      text: "At least one lowercase letter", 
      validator: (pass) => /[a-z]/.test(pass),
      isMet: false 
    },
    { 
      text: "At least one number", 
      validator: (pass) => /[0-9]/.test(pass),
      isMet: false 
    },
    { 
      text: "At least one special character", 
      validator: (pass) => /[^A-Za-z0-9]/.test(pass),
      isMet: false 
    },
  ]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const password = formData.password || '';
    
    // Update requirements
    const updatedRequirements = passwordRequirements.map(req => ({
      ...req,
      isMet: req.validator(password)
    }));
    
    setPasswordRequirements(updatedRequirements);
    
    // Calculate strength percentage
    const metRequirements = updatedRequirements.filter(req => req.isMet).length;
    setPasswordStrength((metRequirements / updatedRequirements.length) * 100);

  }, [formData.password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 20) return "bg-red-500";
    if (passwordStrength <= 40) return "bg-orange-500";
    if (passwordStrength <= 60) return "bg-yellow-500";
    if (passwordStrength <= 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 20) return "Very Weak";
    if (passwordStrength <= 40) return "Weak";
    if (passwordStrength <= 60) return "Medium";
    if (passwordStrength <= 80) return "Strong";
    return "Very Strong";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="Password"
            value={formData.password || ''}
            onChange={handleChange}
            className="pr-10"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Password Strength Meter */}
        {formData.password && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Password Strength:</span>
                <span className={cn(
                  passwordStrength <= 20 ? "text-red-500" :
                  passwordStrength <= 40 ? "text-orange-500" :
                  passwordStrength <= 60 ? "text-yellow-500" :
                  passwordStrength <= 80 ? "text-blue-500" :
                  "text-green-500"
                )}>
                  {getStrengthText()}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-300", getStrengthColor())}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
            <div className="space-y-2 mt-2">
              {passwordRequirements.map((requirement, index) => (
                <div key={index} className="flex items-center text-sm">
                  {requirement.isMet ? (
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <X className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className={requirement.isMet ? "text-green-700" : "text-gray-600"}>
                    {requirement.text}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {errors.password && (
          <Alert variant="destructive" className="text-xs text-red-600">{errors.password}</Alert>
        )}
      </div>

      {backendErrors && Object.keys(backendErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            {Object.entries(backendErrors).map(([field, messages]) => (
              <div key={field}>
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
          disabled={isLoading || passwordStrength < 100}
          variant={isLoading ? "ghost": "default"}
        >
          {isLoading ? <Loading/> : "Sign up"}
        </Button>
      </div>
    </form>
  );
};

export default StepTwo;