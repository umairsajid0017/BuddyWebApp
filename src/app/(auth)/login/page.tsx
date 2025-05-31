"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth, useLogin } from '@/apis/apiCalls';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { setAuthCookie } from "./authOptions";
import { Mail, Lock, AlertTriangle, Eye, EyeOff } from "lucide-react";
import Loading from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/ui/google-signin-button";
import { GuestLoginButton } from "@/components/ui/guest-login-button";
import { Separator } from "@/components/ui/separator";
import { LoginType, RoleType } from "@/constants/constantValues";
import { LoginCredentials } from "@/apis/api-request-types";
import backgroundSvg from '@/components/ui/assets/background-pattern.svg';
import useAuthStore from "@/store/authStore";
import { setAuthToken } from "@/apis/axios";
import { validateEmail } from "@/utils/validations";

// Simple password validation for login (just required)
const validateLoginPassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password.trim()) {
    return { isValid: false, message: "Password is required" };
  }
  return { isValid: true };
};

type LoginErrors = Partial<Record<keyof LoginCredentials, string>>;

export default function Login() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
    login_type: LoginType.MANUAL,
    role: RoleType.CUSTOMER,
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [touchedFields, setTouchedFields] = useState<{
    email: boolean;
    password: boolean;
  }>({
    email: false,
    password: false,
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const router = useRouter();
  const backgroundImageUrl = backgroundSvg;

  const { setUser, setToken } = useAuthStore();

  // Validate individual fields using utils
  const validateField = (name: string, value: string | null | undefined) => {
    const safeValue = value || ""; // Handle null/undefined values
    
    switch (name) {
      case 'email':
        const emailValidation = validateEmail(safeValue);
        return emailValidation.isValid ? "" : emailValidation.message || "";
      case 'password':
        const passwordValidation = validateLoginPassword(safeValue);
        return passwordValidation.isValid ? "" : passwordValidation.message || "";
      default:
        return "";
    }
  };

  // Check if form is valid for button enabling
  const isFormValid = () => {
    const email = formData.email || "";
    const password = formData.password || "";
    return email.trim() !== "" && password.trim() !== "";
  };

  const handleFieldBlur = (fieldName: 'email' | 'password') => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    
    const error = validateField(fieldName, formData[fieldName]);
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error || undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    // Mark all fields as touched for validation
    setTouchedFields({ email: true, password: true });

    // Validate all fields
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);

    const validationErrors = {
      email: emailError || undefined,
      password: passwordError || undefined,
    };

    setFieldErrors(validationErrors);

    // If there are validation errors, don't submit
    if (emailError || passwordError) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors below.",
      });
      return;
    }

    try {
      const response = await loginMutation.mutateAsync(formData);
      const { records, token, error: apiError, message: apiMessage } = response;

      if (apiError) {
        const errorMessage = apiMessage || "Login failed. Please try again.";
        setServerError(errorMessage);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: errorMessage,
        });
        return;
      }

      if (records && token) {
        if (records.otp_verify === "0") {
          void router.push(`/verify-otp?email=${records.email}`);
        } else {
          await setAuthCookie(records, token);
          setAuthToken(token);
          setUser(records);
          setToken(token);
          localStorage.setItem("token", token);
          void router.push("/");
        }
      } else {
     
        const errorMessage = "Login failed: Invalid response from server.";
        setServerError(errorMessage);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: errorMessage,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message,
        });
      } else {
        setServerError("An unexpected error occurred");
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "An unexpected error occurred",
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear server errors when user starts typing
    if (serverError) {
      setServerError(null);
    }
    
    // Real-time validation for touched fields
    if (touchedFields[name as keyof typeof touchedFields]) {
      const error = validateField(name, value);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error || undefined
      }));
    }
  };

  return (
    <main
      className="flex w-full items-center justify-center p-4"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <Image
              src="/assets/logo.png"
              alt="Buddy Logo"
              width={72}
              height={72}
            />
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            Welcome back to Buddy
          </CardTitle>
          <p className="text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleFieldBlur('email')}
                    className={`pl-10 ${fieldErrors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {fieldErrors.email && (
                  <Alert variant="destructive" className="text-xs text-red-600">
                    <AlertDescription>
                      {fieldErrors.email}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    onBlur={() => handleFieldBlur('password')}
                    className={`pl-10 pr-10 ${fieldErrors.password ? "border-red-500" : ""}`}
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
                {fieldErrors.password && (
                  <Alert variant="destructive" className="text-xs text-red-600">
                    <AlertDescription>
                      {fieldErrors.password}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex justify-end">
                  <Button
                    variant="link"
                    className="px-0 font-normal text-primary"
                    type="button"
                    onClick={() => router.push("/reset-password")}
                  >
                    Forgot password?
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending || !isFormValid()}
              >
                {loginMutation.isPending ? (
                  <Loading />
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>
          
          <div className="relative my-4">
            <Separator />
          </div>

          <GoogleSignInButton />
          <div className="mt-2">
            <GuestLoginButton />
          </div>
          
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
