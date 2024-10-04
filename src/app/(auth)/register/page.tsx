'use client'
import React, { useState } from "react";
import { useRegister } from "@/lib/api";
import { type RegisterData } from "@/lib/types";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/schemas";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import backgroundSvg from "@/components/ui/assets/background-pattern.svg";
import Image from "next/image";

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterData, string>>>({});
  const router = useRouter();
  const registerMutation = useRegister();

  const backgroundImageUrl = (backgroundSvg as { src: string }).src;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    try {
      registerSchema.pick({ name: true, email: true, phone: true }).parse(formData);
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

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };
  const handleBackStep = () => {
    setStep(1);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = registerSchema.parse(formData);
      const response = await registerMutation.mutateAsync(validatedData);
      console.log("User registered:", response);
      router.push("/login");
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof RegisterData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof RegisterData] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({ email: "An unexpected error occurred" });
      }
    }
  };

  return (
    <main
      className="min-h-screen min-w-screen w-full   flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <Image src="/assets/logo.png" alt="App Icon" className="h-16 w-16"  width={'64'} height={'64'} />
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            {step === 1 ? "Welcome to Buddy" : "Create Password"}
          </CardTitle>
          <p className="text-center text-sm text-gray-600">
            {step === 1 ? "Get started for free" : "Your password must have at least one symbol & 8 or more characters."}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
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
                  />
                  {errors.name && (
                    <Alert variant="destructive" className="text-xs text-red-600">{errors.name}</Alert>
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
                  />
                  {errors.email && (
                    <Alert variant="destructive" className="text-xs text-red-600">{errors.email}</Alert>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="text"
                    required
                    placeholder="Your mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <Alert variant="destructive" className="text-xs text-red-600">{errors.phone}</Alert>
                  )}
                </div>
              </>
            ) : (
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
            )}
            <p className="text-xs text-muted-foreground">
              Creating an account means you&#39;re okay with our Terms of Service, Privacy Policy, and our default Notification Settings.
            </p>
            <div className="flex space-x-2">
              {step === 2 && (
                <Button
                  type="button"
                  className="w-1/2"
                  onClick={handleBackStep}
                  variant="outline"
                >
                  Back
                </Button>
              )}
              <Button
                type={step === 1 ? "button" : "submit"}
                className={step === 1 ? "w-full" : "w-1/2"}
                onClick={step === 1 ? handleNextStep : undefined}
                disabled={registerMutation.isLoading}
              >
                {step === 1 ? "Next" : registerMutation.isLoading ? "Signing up..." : "Sign up"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Register;