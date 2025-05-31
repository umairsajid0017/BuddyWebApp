import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loading from "@/components/ui/loading";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "@/helpers/utils";
import { RegisterData } from "@/apis/api-request-types";
import { 
  getPasswordRequirements, 
  calculatePasswordStrength, 
  getPasswordStrengthColor, 
  getPasswordStrengthText,
  validatePassword,
  PasswordRequirement
} from "@/utils/validations";

interface StepTwoProps {
  formData: RegisterData;
  errors: Partial<Record<keyof RegisterData, string>>;
  backendErrors: Record<string, string[]>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleBackStep: () => void;
  isLoading: boolean;
}

const StepTwo: React.FC<StepTwoProps> = ({ 
  formData, 
  errors, 
  backendErrors, 
  handleChange, 
  handleSubmit, 
  handleBackStep, 
  isLoading 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>(
    getPasswordRequirements()
  );
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    const validation = validatePassword(formData.password || "");
    setPasswordError(validation.isValid ? "" : validation.message || "");
  };

  useEffect(() => {
    const password = formData.password || '';
    
    // Update requirements using the utility function
    const requirements = getPasswordRequirements();
    const updatedRequirements = requirements.map(req => ({
      ...req,
      isMet: req.validator(password)
    }));
    
    setPasswordRequirements(updatedRequirements);
    
    // Calculate strength using utility function
    setPasswordStrength(calculatePasswordStrength(password));

    // Clear password error if password becomes valid
    if (passwordTouched) {
      const validation = validatePassword(password);
      setPasswordError(validation.isValid ? "" : validation.message || "");
    }
  }, [formData.password, passwordTouched]);

  const isPasswordValid = () => {
    return validatePassword(formData.password || "").isValid && passwordTouched;
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
            onBlur={handlePasswordBlur}
            className={`pr-10 ${passwordError ? "border-red-500" : ""}`}
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
                  passwordStrength <= 33 ? "text-red-500" :
                  passwordStrength <= 66 ? "text-yellow-500" :
                  "text-green-500"
                )}>
                  {getPasswordStrengthText(passwordStrength)}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-300", getPasswordStrengthColor(passwordStrength))}
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

        {(passwordError || errors.password) && (
          <Alert variant="destructive" className="text-xs text-red-600">
            {passwordError || errors.password}
          </Alert>
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
          disabled={isLoading || !isPasswordValid()}
          variant={isLoading ? "ghost": "default"}
        >
          {isLoading ? <Loading/> : "Sign up"}
        </Button>
      </div>
    </form>
  );
};

export default StepTwo;