import { create, type StateCreator } from 'zustand';
import { createJSONStorage, persist, type PersistOptions } from "zustand/middleware";
import { login, logout, register, getUser } from "@/lib/api";
import { userSchema } from "@/lib/schemas";
import { type User, type LoginCredentials, type RegisterData } from "@/lib/types";
import { AxiosError } from 'axios';
import { ZodError } from 'zod';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  loginUser: (credentials: LoginCredentials) => Promise<User>;
  registerUser: (userData: RegisterData) => Promise<User>;
  logoutUser: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

type AuthPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState>
) => StateCreator<AuthState>;

const handleError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
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
      loading: true,
      error: null,
      isInitialized: false,
      loginUser: async (credentials) => {
        try {
          const { data } = await login(credentials);
          const user = userSchema.parse(data.user);
          set({ user, error: null });
          return user;
        } catch (error: unknown) {
          const errorMessage = handleError(error);
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },
      registerUser: async (userData) => {
        try {
          const { data } = await register(userData);
          const user = userSchema.parse(data.user);
          set({ user, error: null });
          return user;
        } catch (error: unknown) {
          const errorMessage = handleError(error);
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },
      logoutUser: async () => {
        try {
          await logout();
          set({ user: null, error: null });
        } catch (error: unknown) {
          const errorMessage = handleError(error);
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },
      checkAuth: async () => {
        try {
          const { data } = await getUser();
          const user = userSchema.parse(data);
          set({ user, loading: false, error: null, isInitialized: true });
        } catch (error: unknown) {
          const errorMessage = handleError(error);
          set({ user: null, loading: false, error: errorMessage, isInitialized: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;