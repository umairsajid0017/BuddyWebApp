"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const navigationLinks = [
//   {
//     title: "Home",
//     href: "/",
//   },
//   {
//     title: "About",
//     href: "/about",
//   },
//   {
//     title: "Contact",
//     href: "/contact",
//   },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >

    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background">
      {/* Background with gradient and pattern */}  
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[url('/assets/background.png')] bg-cover bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full flex justify-center items-center border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="md:w-3/4 w-full flex h-16 items-center justify-between px-8">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/assets/logo.png"
              alt="Buddy Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="hidden font-bold sm:inline-block">Buddy</span>
          </Link>

          {/* Main Navigation */}
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* <ModeToggle /> */}
          <div className="flex items-center space-x-4">
            {isLoginPage ? (
              <Button asChild variant="default" size="sm" className="hidden sm:flex">
                <Link href="/register">Sign up</Link>
              </Button>
            ) : (
              <Button asChild variant="default" size="sm" className="hidden sm:flex">
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </div>
      {/* Mobile Navigation Menu */}
      <div className="container flex items-center justify-between md:hidden">      
        {isLoginPage ? (
          <Button asChild variant="default" size="sm">
            <Link href="/register">Sign up</Link>
          </Button>
        ) : (
          <Button asChild variant="default" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
        )}
        </div>
        </div>
      </div>
      </header>


      {/* Main Content */}
      <main className="w-full relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center py-8">
       
          {children}

        
      </main>
    </div>
          </ThemeProvider>
  );
}