'use client'

import { useEffect, type ReactNode } from 'react'
import { useAuth } from '@/store/authStore'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuth, isInitialized, user } = useAuth()

  useEffect(() => {
    if (!isInitialized) {
      void checkAuth()
    }
    console.log('AuthProvider: User:', user)
  }, [checkAuth, isInitialized])

  return <>{children}</>
}