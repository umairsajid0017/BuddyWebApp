"use client";
import React, { useState, useCallback } from "react";
import {
  useRegister,
  useVerifyOtp,
  useCheckCredentials,
  useSendOtp,
} from "@/apis/apiCalls";
import { useRouter } from "next/navigation";
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
import { RegisterData } from "@/apis/api-request-types";
import { LoginType, RoleType } from "@/constants/constantValues";
import { VerifyOtpError } from "@/types/general-types";
import { validateName, validateEmail, validatePhone, validatePassword } from "@/utils/validations";

const Register: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    phone: "+968",  
    role: RoleType.CUSTOMER,
    login_type: LoginType.MANUAL,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterData, string>>>({});
  const [backendErrors, setBackendErrors] = useState<Record<string, string[]>>({});
  const [autoOtp, setAutoOtp] = useState<number | null>(null);
  const router = useRouter();
  const registerMutation = useRegister();
  const checkCredentialsMutation = useCheckCredentials();
  const sendOtpMutation = useSendOtp();

  const backgroundImageUrl = (backgroundSvg as { src: string }).src;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear backend errors for the field being edited
    if (errors[name as keyof RegisterData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNextStep = async () => {
    // Clear previous errors
    setErrors({});

    // Client-side validation first
    const nameValidation = validateName(formData.name);
    const emailValidation = validateEmail(formData.email);
    const phoneValidation = validatePhone(formData.phone);

    const validationErrors: Partial<Record<keyof RegisterData, string>> = {};

    if (!nameValidation.isValid) {
      validationErrors.name = nameValidation.message;
    }
    if (!emailValidation.isValid) {
      validationErrors.email = emailValidation.message;
    }
    if (!phoneValidation.isValid) {
      validationErrors.phone = phoneValidation.message;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors below.",
      });
      return;
    }

    try {
      const response = await checkCredentialsMutation.mutateAsync({
        email: formData.email,
        phone: formData.phone,
        role: RoleType.CUSTOMER,
      });

      if (response.error) {
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

      setStep(2);
    } catch (error) {
      console.error("Error checking credentials:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while checking credentials. Please try again.",
      });
    }
  };

  const handleBackStep = () => {
    setStep((prevStep) => prevStep - 1);
    setBackendErrors({});
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setBackendErrors({});

    // Client-side password validation
    const passwordValidation = validatePassword(formData.password || "");
    if (!passwordValidation.isValid) {
      setErrors({ password: passwordValidation.message });
      toast({
        variant: "destructive",
        title: "Password Validation Error",
        description: passwordValidation.message,
      });
      return;
    }

    try {
      const response = await registerMutation.mutateAsync(formData);

      if (response.error) {
        if (typeof response.message === "string") {
          toast({
            variant: "destructive",
            title: "Registration Error",
            description: response.message,
          });
        } else {
          const validationErrors: Partial<Record<keyof RegisterData, string>> = {};

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

      // Registration successful - move to step 3 and send OTP immediately
      toast({
        title: "Registration Successful",
        description: "Please verify your email to complete registration.",
      });
      setStep(3);
      
      // Send OTP immediately after moving to step 3
      handleSendOtp();

    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const verifyOtpMutation = useVerifyOtp();

  const handleSendOtp = useCallback(async () => {
    try {
      const otpResponse = await sendOtpMutation.mutateAsync({
        email: formData.email,
        role: RoleType.CUSTOMER,
      });

      // Check for your_otp regardless of error flag
      if (otpResponse.your_otp) {
        setAutoOtp(Number(otpResponse.your_otp));
        toast({
          title: "OTP Sent",
          description: "Verification code has been sent to your email.",
        });
      } else {
        toast({
          title: "OTP Sent", 
          description: "Please check your email for the verification code.",
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        variant: "destructive",
        title: "OTP Error",
        description: "Failed to send verification code. Please try again.",
      });
    }
  }, [formData.email, sendOtpMutation, toast]);

  const handleVerifyEmail = async (verificationCode: number) => {
    try {
      const response = await verifyOtpMutation.mutateAsync({
        email: formData.email,
        otp: verificationCode.toString(),
      });

      if (!response.error) {
        toast({
          title: "Success",
          description: "Email verified successfully. You can now log in.",
        });
        router.push("/login");
      } else {
        const errorMessage = response.message || "Verification failed";
        setErrors({ otp: errorMessage });
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: errorMessage,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data as VerifyOtpError;
        const errorMessage = errorData.message || "Verification failed";
        setErrors({ otp: errorMessage });
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: errorMessage,
        });
      } else {
        console.error("Verification error:", error);
        setErrors({ otp: "An unexpected error occurred" });
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <main
      className="min-w-screen flex w-full items-center justify-center p-4"
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
              alt="Buddy Logo"
              width={72}
              height={72}
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
                ? "Your password must meet the requirements below."
                : `We sent you a code to verify your email ${formData.email}`}
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
              isLoading={registerMutation.isPending}
            />
          )}
          {step === 3 && (
            <StepThree 
              handleVerifyEmail={handleVerifyEmail}
              autoOtp={autoOtp}
              handleSendOtp={handleSendOtp}
            />
          )}
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
