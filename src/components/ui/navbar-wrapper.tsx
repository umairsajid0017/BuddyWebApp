"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/ui/navbar";
import { Header } from "../landing-page/header";
import { useAuth } from '@/apis/apiCalls'

export default function NavbarWrapper() {
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verify-otp") ||
    pathname.startsWith("/reset-password");

  const { user } = useAuth();

  if (!user && !isAuthPage) return <Header />;

  if (isAuthPage) {
    return null;
  }

  return <NavBar />;
}
