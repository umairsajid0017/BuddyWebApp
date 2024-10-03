'use client'

import { useEffect, type ReactNode } from 'react'
import useAuthStore from '@/store/authStore'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    void checkAuth();
  }, [checkAuth])

  return <>{children}</>
}
