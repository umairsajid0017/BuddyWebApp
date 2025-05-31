"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useResetPassword } from "@/apis/apiCalls";
import { validatePassword } from "@/utils/validations";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";

const newPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type NewPasswordFormData = {
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof NewPasswordFormData, string>>;

export function NewPasswordComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const [formData, setFormData] = useState<NewPasswordFormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{
    password: boolean;
    confirmPassword: boolean;
  }>({
    password: false,
    confirmPassword: false,
  });

  const resetPasswordMutation = useResetPassword();

  // Redirect if email or otp is missing
  if (!email || !otp) {
    router.push("/reset-password");
    return null;
  }

  const validateField = (name: keyof NewPasswordFormData, value: string) => {
    switch (name) {
      case 'password':
        const passwordValidation = validatePassword(value);
        return passwordValidation.isValid ? "" : passwordValidation.message || "";
      case 'confirmPassword':
        if (!value.trim()) {
          return "Confirm password is required";
        }
        if (value !== formData.password) {
          return "Passwords don't match";
        }
        return "";
      default:
        return "";
    }
  };

  const handleFieldBlur = (fieldName: keyof NewPasswordFormData) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    
    const error = validateField(fieldName, formData[fieldName]);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error || undefined
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof NewPasswordFormData;
    
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Real-time validation for touched fields
    if (touchedFields[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error || undefined
      }));
    }

    // Also validate confirm password if password field changes and confirm password is touched
    if (fieldName === 'password' && touchedFields.confirmPassword) {
      const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmPasswordError || undefined
      }));
    }
  };

  const isFormValid = () => {
    return formData.password.trim() !== "" && 
           formData.confirmPassword.trim() !== "" &&
           !errors.password && 
           !errors.confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Mark all fields as touched for validation
    setTouchedFields({ password: true, confirmPassword: true });

    // Validate all fields
    const passwordError = validateField('password', formData.password);
    const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);

    const validationErrors: FormErrors = {
      password: passwordError || undefined,
      confirmPassword: confirmPasswordError || undefined,
    };

    setErrors(validationErrors);

    // If there are validation errors, don't submit
    if (passwordError || confirmPasswordError) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors below.",
      });
      return;
    }

    try {
      const response = await resetPasswordMutation.mutateAsync({
        email,
        password: formData.password,
        otp,
      });

      if (response.error) {
        toast({
          variant: "destructive",
          title: "Reset Password Failed",
          description: response.message || "Failed to reset password. Please try again.",
        });
        return;
      }

      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated. Please login with your new password.",
      });
      
      router.push("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Reset Password Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
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
        <CardTitle className="text-center text-2xl font-bold">Set New Password</CardTitle>
        <CardDescription className="text-center">
          Enter your new password for {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleFieldBlur('password')}
                className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleFieldBlur('confirmPassword')}
                className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={resetPasswordMutation.isPending || !isFormValid()}
          >
            {resetPasswordMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
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