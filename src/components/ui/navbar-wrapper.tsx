'use client'

import { usePathname } from 'next/navigation'
import NavBar from "@/components/ui/navbar"

export default function NavbarWrapper() {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')

  if (isAuthPage) {
    return null
  }

  return <NavBar />
}