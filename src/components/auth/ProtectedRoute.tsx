'use client'

import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import useAuthStore from "@/store/authStore";

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isInitialized } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !user && !loading) {
      router.push('/login')
    }
  }, [user, loading, isInitialized, router])

  if (!isInitialized || loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute