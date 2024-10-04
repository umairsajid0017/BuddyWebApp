import { create, type StateCreator } from 'zustand';
import { createJSONStorage, persist, type PersistOptions } from "zustand/middleware";
import { userSchema } from "@/lib/schemas";
import { type User, type LoginCredentials, type RegisterData } from "@/lib/types";
import { AxiosError } from 'axios';
import { ZodError } from 'zod';
import { useRegister, useLogin, useLogout, useUser } from "@/lib/api";

interface AuthState {
  user: User | null;
  error: string | null;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setIsInitialized: (isInitialized: boolean) => void;
}

type AuthPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState>
) => StateCreator<AuthState>;

const handleError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
    return error.response?.data?.message || error.message;
  } else if (error instanceof ZodError) {
    return 'Invalid data received from server';
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

const useAuthStore = create<AuthState>(
  (persist as AuthPersist)(
    (set) => ({
      user: null,
      error: null,
      isInitialized: false,
      setUser: (user) => set({ user }),
      setError: (error) => set({ error }),
      setIsInitialized: (isInitialized) => set({ isInitialized }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useAuth = () => {
  const { user, error, isInitialized, setUser, setError, setIsInitialized } = useAuthStore();
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const userQuery = useUser();

  const loginUser = async (credentials: LoginCredentials) => {
    try {
      const { data } = await loginMutation.mutateAsync(credentials);
      const parsedUser = userSchema.parse(data.user);
      setUser(parsedUser);
      setError(null);
      return parsedUser;
    } catch (error: unknown) {
      const errorMessage = handleError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const registerUser = async (userData: RegisterData) => {
    try {
      const { data } = await registerMutation.mutateAsync(userData);
      const parsedUser = userSchema.parse(data.user);
      setUser(parsedUser);
      setError(null);
      return parsedUser;
    } catch (error: unknown) {
      const errorMessage = handleError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logoutUser = async () => {
    try {
      await logoutMutation.mutateAsync();
      setUser(null);
      setError(null);
    } catch (error: unknown) {
      const errorMessage = handleError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const checkAuth = async () => {
    if (!isInitialized) {
      try {
        const { data } = await userQuery.refetch();
        const parsedUser = userSchema.parse(data);
        setUser(parsedUser);
        setError(null);
      } catch (error: unknown) {
        const errorMessage = handleError(error);
        setUser(null);
        setError(errorMessage);
      } finally {
        setIsInitialized(true);
      }
    }
  };

  return {
    user,
    error,
    isInitialized,
    loginUser,
    registerUser,
    logoutUser,
    checkAuth,
    isLoading: userQuery.isLoading || !isInitialized,
  };
};

export default useAuthStore;