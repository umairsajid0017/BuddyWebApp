'use client'

import { useEffect, type ReactNode } from 'react'
import { useAuth } from '@/apis/apiCalls'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    // The auth state is now managed by React Query
    // No need for explicit initialization
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}