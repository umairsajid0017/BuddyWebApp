'use client'
import { useState, type FormEvent, type ChangeEvent } from 'react';
import useAuthStore from '@/store/authStore';
import { loginSchema } from '@/lib/schemas';
import { type LoginCredentials } from '@/lib/types';
import { ZodError } from 'zod';
import { useRouter } from "next/navigation";

type LoginErrors = Partial<Record<keyof LoginCredentials, string>>;

const Login = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const loginUser = useAuthStore((state) => state.loginUser);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    try {
      loginSchema.parse(credentials);
      await loginUser(credentials);
      void router.push('/dashboard');
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const newErrors: LoginErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof LoginCredentials;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Login failed', error);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={credentials.email}
        onChange={handleInputChange}
        placeholder="Email"
      />
      {errors.email && <p>{errors.email}</p>}
      <input
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleInputChange}
        placeholder="Password"
      />
      {errors.password && <p>{errors.password}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;