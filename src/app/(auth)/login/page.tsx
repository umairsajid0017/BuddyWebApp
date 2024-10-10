'use client'

import { useState, type FormEvent } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { ZodError } from 'zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';
import { loginSchema } from '@/lib/schemas';
import { type LoginCredentials } from '@/lib/types';
import { useLogin } from '@/lib/api';
import Lottie from 'react-lottie';
import Loading from '@/components/ui/loading';
import backgroundSvg from "@/components/ui/assets/background-pattern.svg";
import axios from 'axios';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { setAuthCookie } from './authOptions';


type LoginErrors = Partial<Record<keyof LoginCredentials, string>>;

export default function Login() {
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '', loginType: 'email' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [backendErrors, setBackendErrors] = useState<{ [key: string]: string[] }>({});
  const loginMutation = useLogin();
  const router = useRouter();
  const backgroundImageUrl = (backgroundSvg as { src: string }).src;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  setErrors({});
  setBackendErrors({});
  try {
    const validatedCredentials = loginSchema.parse(credentials);
    const data = await loginMutation.mutateAsync(validatedCredentials);
    
       // Check if data has the expected properties
       if (data && data.status && data.token && data.user) {
        const { user, token } = data;
        console.log('User logged in:', user, token);
        useAuthStore.getState().setUser(user);
        useAuthStore.getState().setToken(token);
        setAuthCookie(token);
        void router.push('/');
      } else {
        throw new Error("Login successful but received unexpected data format");
      }
    
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const newErrors: LoginErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof LoginCredentials;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      } else if (axios.isAxiosError(error)) {
        console.error('Login failed', error.response?.data);
        // Even for network errors, we might get a 200 status, so we need to check the response data
        if (error.response?.data) {
          if (error.response.data.status === false) {
            setBackendErrors({ general: [error.response.data.message] });
          } else {
            setBackendErrors({ general: ["An unexpected error occurred"] });
          }
        } else {
          setBackendErrors({ general: ["An unexpected error occurred"] });
        }
      } else {
        console.error('Login failed', error);
        setBackendErrors({ general: ["An unexpected error occurred"] });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <Image src="/assets/logo.png" alt="App Icon" width={64} height={64} />
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
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              {Object.keys(backendErrors).length > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {Object.entries(backendErrors).map(([field, messages]) => (
                      <div key={field}>
                        <strong>{field === 'general' ? '' : `${field}: `}</strong>
                        {messages.join(", ")}
                      </div>
                    ))}
                  </AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" variant={loginMutation.isLoading ? "outline" : "default"} disabled={loginMutation.isLoading}>
                {loginMutation.isLoading ? <Loading /> : "Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="font-medium text-primary hover:underline">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}