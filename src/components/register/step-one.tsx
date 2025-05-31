import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GoogleSignInButton } from "@/components/ui/google-signin-button";
import { GuestLoginButton } from "@/components/ui/guest-login-button";
import { Separator } from "../ui/separator";
import { RegisterData } from "@/apis/api-request-types";
import { validateName, validateEmail, validatePhone } from "@/utils/validations";
import { CheckCircle2Icon } from "lucide-react";

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
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  const [touchedFields, setTouchedFields] = useState<{
    name: boolean;
    email: boolean;
    phone: boolean;
  }>({
    name: false,
    email: false,
    phone: false,
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Ensure the phone always starts with +968
    if (!value.startsWith("+968")) {
      value = "+968";
    }
    
    // Only allow digits after +968
    const prefix = "+968";
    const phoneNumber = value.slice(4);
    const sanitizedPhoneNumber = phoneNumber.replace(/\D/g, "");
    
    // Limit to 8 digits after +968
    const limitedPhoneNumber = sanitizedPhoneNumber.slice(0, 8);
    
    const newValue = prefix + limitedPhoneNumber;
    
    // Create a synthetic event with the new value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: newValue,
        name: "phone"
      }
    };
    
    handleChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
  };

  const handleFieldBlur = (fieldName: 'name' | 'email' | 'phone') => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    
    let validation;
    switch (fieldName) {
      case 'name':
        validation = validateName(formData.name);
        break;
      case 'email':
        validation = validateEmail(formData.email);
        break;
      case 'phone':
        validation = validatePhone(formData.phone);
        break;
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: validation.isValid ? undefined : validation.message
    }));
  };

  // Check if all fields are valid
  const isFormValid = () => {
    const nameValid = validateName(formData.name).isValid;
    const emailValid = validateEmail(formData.email).isValid;
    const phoneValid = validatePhone(formData.phone).isValid;
    
    return nameValid && emailValid && phoneValid && touchedFields.name && touchedFields.email && touchedFields.phone;
  };

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
          onBlur={() => handleFieldBlur("name")}
          className={fieldErrors.name ? "border-red-500" : ""}
        />
        {(fieldErrors.name || errors.name) && (
          <Alert variant="destructive" className="text-xs text-red-600">
            <AlertDescription>
              {fieldErrors.name || errors.name}
            </AlertDescription>
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
          onBlur={() => handleFieldBlur("email")}
          className={fieldErrors.email ? "border-red-500" : ""}
        />
        {(fieldErrors.email || errors.email) && (
          <Alert variant="destructive" className="text-xs text-red-600">
            <AlertDescription>
              {fieldErrors.email || errors.email}
            </AlertDescription>
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
          placeholder="+968xxxxxxxx"
          value={formData.phone || "+968"}
          onChange={handlePhoneChange}
          onBlur={() => handleFieldBlur("phone")}
          className={fieldErrors.phone ? "border-red-500" : ""}
        />
        <p className="text-xs text-gray-500">
          Format: +968 followed by 8 digits
        </p>
        {(fieldErrors.phone || errors.phone) && (
          <Alert variant="destructive" className="text-xs text-red-600">
            <AlertDescription>
              {fieldErrors.phone || errors.phone}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Button
        type="button"
        onClick={handleNextStep}
        className="w-full"
        disabled={!isFormValid()}
      >
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
