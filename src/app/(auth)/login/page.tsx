"use client";

import { useState, type FormEvent } from "react";
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
import { Mail, Lock, AlertTriangle, Eye } from "lucide-react";
import Loading from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/ui/google-signin-button";
import { GuestLoginButton } from "@/components/ui/guest-login-button";
import { Separator } from "@/components/ui/separator";
import { LoginType } from "@/constants/constantValues";
import { LoginCredentials } from "@/apis/api-request-types";
import backgroundSvg from '@/components/ui/assets/background-pattern.svg';

type LoginErrors = Partial<Record<keyof LoginCredentials, string>>;

export default function Login() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
    login_type: LoginType.MANUAL,
    role: "customer",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const router = useRouter();
  const backgroundImageUrl = backgroundSvg;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    try {
      const response = await loginMutation.mutateAsync(formData);
      const { records, token } = response;

      if (records.otp_verify === "0") {
        void router.push(`/verify-otp?email=${records.email}`);
      } else {
        await setAuthCookie(records, token);
        void router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("An unexpected error occurred");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setErrors((prev) => ({ ...prev, email: "" }));
    if (name === "password") setErrors((prev) => ({ ...prev, password: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
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
                    className="pl-10"
                  />
                </div>
                {errors.email && (
                  <Alert variant="destructive">
                    <AlertDescription className="flex items-center gap-2">
                      <AlertTriangle /> {errors.email}
                    </AlertDescription>
                  </Alert>
                )}{" "}
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
                    className="pl-10"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <Alert variant="destructive">
                    <AlertDescription className="flex items-center gap-2">
                      <AlertTriangle /> {errors.password}
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
              {/* {serverError && (
                <Alert variant="destructive">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )} */}
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                Sign In
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
