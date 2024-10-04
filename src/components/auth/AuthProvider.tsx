'use client'

import { useEffect, type ReactNode } from 'react'
import { useAuth } from '@/store/authStore'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuth, isInitialized } = useAuth()

  useEffect(() => {
    if (!isInitialized) {
      void checkAuth()
    }
  }, [checkAuth, isInitialized])

  return <>{children}</>
}