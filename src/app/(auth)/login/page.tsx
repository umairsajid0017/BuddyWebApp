"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ZodError, ZodIssue } from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import { loginSchema } from "@/lib/schemas";
import { User, type LoginCredentials } from "@/lib/types";
import { useLogin } from "@/lib/api";
import backgroundSvg from "@/components/ui/assets/background-pattern.svg";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { setAuthCookie } from "./authOptions";
import { Mail, Lock, AlertCircle, AlertTriangle } from "lucide-react";
import Loading from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";

type LoginErrors = Partial<Record<keyof LoginCredentials, string>>;

export default function Login() {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
    loginType: "email",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const loginMutation = useLogin();
  const router = useRouter();
  const backgroundImageUrl = backgroundSvg.src;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);
    try {
      const validatedCredentials = loginSchema.parse(credentials);
      const data = await loginMutation.mutateAsync(validatedCredentials);

      if (data.status && data.token && data.user) {
        const { user, token } = data;
        console.log("User logged in:", user, token);
        useAuthStore.getState().setUser(user);
        useAuthStore.getState().setToken(token);
        void setAuthCookie(token);
        void router.push("/");
      } else {
        throw new Error(data.message ?? "Login failed");
      }
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const newErrors: LoginErrors = {};
        (error.errors as ZodIssue[]).forEach((err) => {
          const path = err.path[0] as keyof LoginCredentials;
          newErrors[path] = err.message;
        });
        //@ts-ignore
        setErrors(newErrors);
        console.log("Validation errors:", newErrors);
      } else if (error instanceof Error) {
        setServerError(error.message);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setServerError("An unexpected error occurred");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setErrors((prev) => ({ ...prev, email: "" }));
    if (name === "password") setErrors((prev) => ({ ...prev, password: "" }));
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main
      className="flex min-h-screen w-full items-center justify-center p-4"
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
              src="/assets/logo.jpg"
              alt="App Icon"
              width={64}
              height={64}
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
          <form onSubmit={handleSubmit} method="POST">
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
                    value={credentials.email}
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
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="pl-10"
                    // required
                  />
                </div>
                {errors.password && (
                  <Alert variant="destructive">
                    <AlertDescription className="flex items-center gap-2">
                      <AlertTriangle /> {errors.password}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              {/* {serverError && (
                <Alert variant="destructive">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )} */}
              <Button
                type="submit"
                className="w-full"
                variant={loginMutation.isLoading ? "outline" : "default"}
                disabled={loginMutation.isLoading}
              >
                {loginMutation.isLoading ? <Loading /> : "Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
