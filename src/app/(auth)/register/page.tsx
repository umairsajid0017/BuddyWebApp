"use client";
import React, { useState } from "react";
import { useRegister, useVerifyOtp } from "@/lib/api";
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

const Register: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterData, string>>
  >({});
  const [backendErrors, setBackendErrors] = useState<Record<string, string[]>>(
    {},
  );
  const router = useRouter();
  const registerMutation = useRegister();

  const backgroundImageUrl = (backgroundSvg as { src: string }).src;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
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
    console.log("Registering user:", formData);
    e.preventDefault();
    setErrors({});
    try {
      console.log("Validating data...");
      const validatedData = registerSchema.parse(formData);
      console.log("Data validated successfully:", validatedData);

      console.log("Calling registerMutation.mutateAsync...");
      const response = await registerMutation.mutateAsync(validatedData);
      console.log("API call completed. Response:", response);

      console.log("Setting step to 3...");
      setStep(3);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      if (error instanceof ZodError) {
        console.log("ZodError encountered:", error.errors);
        const newErrors: Partial<Record<keyof RegisterData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof RegisterData] = err.message;
          }
        });
        setErrors(newErrors);
      } else if (error instanceof Error && "errors" in error) {
        //This method required a lot of changes to work properly
        //I needed to change the Error to ServerError by extending the Error class
        //to accomodate the errors comming from the server
        const serverError = error as Error & {
          errors?: Record<string, string[]>;
        };
        const errorMessages = serverError.errors
          ? Object.values(serverError.errors).flat().join(", ")
          : serverError.message;

        if (serverError.errors) {
          setErrors(
            Object.fromEntries(
              Object.entries(serverError.errors).map(([key, value]) => [
                key,
                value[0],
              ]),
            ),
          );
        }
        console.log("Server error:", serverError.message, serverError.errors);
        toast({
          title: serverError.message,
          description: errorMessages,
          variant: "destructive",
        });
      } else {
        console.log("Unknown error:", error);
        setBackendErrors({ general: ["An unexpected error occurred"] });
      }
    }
  };

  const verifyOtpMutation = useVerifyOtp();

  const handleVerifyEmail = async (verificationCode: string) => {
    console.log("Verifying email with code:", verificationCode);
    try {
      const response = await verifyOtpMutation.mutateAsync({
        email: formData.email,
        otp: verificationCode,
      });

      if (response.status) {
        console.log("Email verified successfully:", response.user);
        router.push("/login");
      } else {
        setErrors({ otp: response.message });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data as VerifyOtpError;
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          setErrors({ otp: errorData.message });
        }
      } else {
        setErrors({ otp: "An unexpected error occurred" });
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
