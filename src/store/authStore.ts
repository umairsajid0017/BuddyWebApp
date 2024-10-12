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
  token: string | null;  // Add token to persisted state
}

type AuthPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState, PersistedAuthState>
) => StateCreator<AuthState>;

const handleError = (error: unknown): string => {
  if (error instanceof AxiosError && error.response) {
    const responseData = error.response?.data as { message?: string };
    return responseData?.message ?? error.message;
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
      token: null,
      isInitialized: false,
      setUser: (user) => set({ user }),
      setError: (error) => set({ error }),
      setToken: (token) => set({ token }),
      setIsInitialized: (isInitialized) => set({ isInitialized }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedAuthState => ({ 
        user: state.user,
        token: state.token  // Persist the token as well
      }),
    }
  )
);

export const useAuth = () => {
  const { user, error, token, isInitialized, setUser, setError, setToken, setIsInitialized } = useAuthStore();
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const userQuery = useUser();

  const loginUser = async (credentials: LoginCredentials) => {
    try {
      const result = await loginMutation.mutateAsync(credentials);
      const parsedUser = userSchema.parse(result.user); 
      setUser(parsedUser);
      setToken(result.token);  // Save the token
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
      const data = await registerMutation.mutateAsync(userData);
      
   
      
      const parsedUser = data ? userSchema.parse(data) : null;     
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
      setToken(null);  // Clear the token
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
    loginUser,
    registerUser,
    logoutUser,
    checkAuth,
    isLoading: userQuery.isLoading || !isInitialized,
  };
};

export default useAuthStore;