'use client'

import { useAuth } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode, useState } from 'react'
import SplashScreen from '../ui/splash-screen'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Wait until auth is initialized
    if (isInitialized) {
      if (!user && !isLoading) {
        // Redirect to login if no user and not loading
        router.push('/login');
      } else {
        // Set flag to true once we've checked auth state
        setHasCheckedAuth(true);
      }
    }
  }, []);

  // Show splash screen until initialization and auth check are done
  if (!isInitialized || isLoading || !hasCheckedAuth) {
    return <SplashScreen />;
  }

  // If no user after auth check, render nothing (redirect in effect will handle it)
  if (!user) {
    return null;
  }

  // Render the protected content if user is authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
