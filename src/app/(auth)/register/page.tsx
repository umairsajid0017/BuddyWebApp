"use client";
import React, { useState } from "react";
import {
  useRegister,
  useVerifyOtp,
  useCheckCredentials,
  useSendOtp,
} from "@/lib/api";
import { VerifyOtpError, type RegisterData } from "@/lib/types";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/schemas";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

import backgroundSvg from "@/components/ui/assets/background-pattern.svg";
import StepOne from "@/components/register/step-one";
import StepTwo from "@/components/register/step-two";
import StepThree from "@/components/register/step-three";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { LoginType } from "@/utils/constants";

const Register: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
    login_type: LoginType.MANUAL,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterData, string>>
  >({});
  const [backendErrors, setBackendErrors] = useState<Record<string, string[]>>(
    {},
  );
  const router = useRouter();
  const registerMutation = useRegister();
  const checkCredentialsMutation = useCheckCredentials();
  const sendOtpMutation = useSendOtp();

  const backgroundImageUrl = (backgroundSvg as { src: string }).src;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = async () => {
    if (validateStep1()) {
      try {
        const response = await checkCredentialsMutation.mutateAsync({
          email: formData.email,
          phone: formData.phone,
        });

        if (response.error) {
          // Handle validation errors
          const newErrors: Partial<Record<keyof RegisterData, string>> = {};

          if (response.records.email) {
            newErrors.email = "This email is already registered";
          }
          if (response.records.phone) {
            newErrors.phone = "This phone number is already registered";
          }

          setErrors(newErrors);

          toast({
            variant: "destructive",
            title: "Validation Error",
            description: response.message,
          });

          return;
        }

        // If credentials are unique, proceed to step 2
        setStep(2);
      } catch (error) {
        console.error("Error checking credentials:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "An error occurred while checking credentials. Please try again.",
        });
      }
    }
  };

  const handleBackStep = () => {
    setStep((prevStep) => prevStep - 1);
    setBackendErrors({});
  };

  const validateStep1 = () => {
    try {
      registerSchema
        .pick({ name: true, email: true, phone: true })
        .parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof RegisterData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof RegisterData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setBackendErrors({});

    try {
      // First validate with Zod
      registerSchema.parse(formData);

      const response = await registerMutation.mutateAsync(formData);

      if (response.error) {
        // Handle validation errors from API
        if (typeof response.message === "string") {
          toast({
            variant: "destructive",
            title: "Registration Error",
            description: response.message,
          });
        } else {
          // Handle multiple validation errors
          const validationErrors: Partial<Record<keyof RegisterData, string>> =
            {};

          Object.entries(response.message).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              validationErrors[field as keyof RegisterData] = messages[0];
              toast({
                variant: "destructive",
                title: `${field.charAt(0).toUpperCase() + field.slice(1)} Error`,
                description: messages[0],
              });
            }
          });

          setErrors(validationErrors);
        }
        return;
      }

      // If registration successful, send OTP
      try {
        const otpResponse = await sendOtpMutation.mutateAsync({
          email: formData.email,
          // type: "register"
          role: "customer",
        });

        if (!otpResponse.error) {
          setStep(3);
          toast({
            title: "Verification Required",
            description: "Please check your email for the OTP code.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "OTP Error",
            description: otpResponse.message,
          });
        }
      } catch (otpError) {
        console.error("Error sending OTP:", otpError);
        toast({
          variant: "destructive",
          title: "OTP Error",
          description: "Failed to send verification code. Please try again.",
        });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof RegisterData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof RegisterData] = err.message;
          }
        });
        setErrors(newErrors);

        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please check all required fields.",
        });
      } else {
        console.error("Registration error:", error);
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  const verifyOtpMutation = useVerifyOtp();

  const handleVerifyEmail = async (verificationCode: string) => {
    try {
      const response = await verifyOtpMutation.mutateAsync({
        email: formData.email,
        otp: verificationCode,
      });

      if (!response.error) {
        toast({
          title: "Success",
          description: "Email verified successfully. You can now log in.",
        });
        router.push("/login");
      } else {
        setErrors({ otp: response.message });
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: response.message,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data as VerifyOtpError;
        const errorMessage =
          errorData.errors?.otp?.[0] ||
          errorData.message ||
          "Verification failed";
        setErrors({ otp: errorMessage });
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: errorMessage,
        });
      } else {
        const errorMessage = "An unexpected error occurred";
        setErrors({ otp: errorMessage });
        toast({
          variant: "destructive",
          title: "Verification Error",
          description: errorMessage,
        });
      }
    }
  };

  return (
    <main
      className="min-w-screen flex min-h-screen w-full items-center justify-center p-4"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="pb-2">
          <div className="mb-4 flex justify-center">
            <Image
              src="/assets/logo.png"
              alt="App Icon"
              className="h-16 w-16"
              width={"64"}
              height={"64"}
            />
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            {step === 1
              ? "Welcome to Buddy"
              : step === 2
                ? "Create Password"
                : "Verify your Email"}
          </CardTitle>
          <p className="text-center text-sm text-gray-600">
            {step === 1
              ? "Get started for free"
              : step === 2
                ? "Your password must have at least one symbol & 8 or more characters."
                : `We texted you a code to verify your email ${formData.email}`}
          </p>
          {step === 3 && (
            <div className="pointer-events-none flex items-center justify-center">
              <Image
                src="/assets/verify-email.svg"
                alt="Verify Email"
                className="h-[180px] w-[180px]"
                width={"180"}
                height={"180"}
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <StepOne
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              handleNextStep={handleNextStep}
            />
          )}
          {step === 2 && (
            <StepTwo
              formData={formData}
              errors={errors}
              backendErrors={backendErrors}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleBackStep={handleBackStep}
              isLoading={registerMutation.isLoading}
            />
          )}
          {step === 3 && <StepThree handleVerifyEmail={handleVerifyEmail} />}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Register;
