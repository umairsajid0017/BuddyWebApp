import { create, type StateCreator } from "zustand";
import {
  createJSONStorage,
  persist,
  type PersistOptions,
} from "zustand/middleware";

import { AxiosError } from "axios";
import { ZodError } from "zod";
import { useRegister, useLogin, useLogout, useUser } from "@/apis/apiCalls";
import { User } from "@/types/general-types";
import { LoginCredentials, RegisterData } from "@/apis/api-request-types";
import { userSchema } from "@/types/schemas";

interface AuthState {
  user: User | null;
  error: string | null;
  token: string | null;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setIsInitialized: (isInitialized: boolean) => void;
  setToken: (token: string | null) => void;
}

// Define a separate interface for the persisted slice of the state
interface PersistedAuthState {
  user: User | null;
  token: string | null; // Add token to persisted state
}

type AuthPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState, PersistedAuthState>,
) => StateCreator<AuthState>;

const handleError = (error: unknown): string => {
  if (error instanceof AxiosError && error.response) {
    const responseData = error.response?.data as { message?: string };
    return responseData?.message ?? error.message;
  } else if (error instanceof ZodError) {
    return "Invalid data received from server";
  } else if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

const useAuthStore = create<AuthState>(
  (persist as AuthPersist)(
    (set) => ({
      user: null,
      error: null,
      token: null,
      isInitialized: false,
      setUser: (user) => set({ user }),
      setError: (error) => set({ error }),
      setToken: (token) => set({ token }),
      setIsInitialized: (isInitialized) => set({ isInitialized }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedAuthState => ({
        user: state.user,
        token: state.token, // Persist the token as well
      }),
    },
  ),
);

export const useAuth = () => {
  const {
    user,
    error,
    token,
    isInitialized,
    setUser,
    setError,
    setToken,
    setIsInitialized,
  } = useAuthStore();

  const logoutMutation = useLogout();
  const userQuery = useUser();

 


  const logoutUser = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      const errorMessage = handleError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const checkAuth = async () => {
    if (!isInitialized) {
      try {
        if (user && token) {
          const { data } = await userQuery.refetch();
          const parsedUser = userSchema.parse(data);
          setUser(parsedUser);
          setError(null);
        } else {
          const { data } = await userQuery.refetch();
          const parsedUser = userSchema.parse(data);
          setUser(parsedUser);
          setError(null);
        }
      } catch (error: unknown) {
        const errorMessage = handleError(error);
        setUser(null);
        setToken(null); 

        setError(errorMessage);
      } finally {
        setIsInitialized(true);
      }
    }
  };

  return {
    user,
    error,
    token,
    isInitialized,
    logoutUser,
    checkAuth,
    isLoading: userQuery.isLoading || !isInitialized,
  };
};

export default useAuthStore;
