"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === ROUTES.LOGIN;

  return (

      <div className="relative mx-auto flex w-full flex-col items-center justify-center bg-background">
        {/* Background with gradient and pattern */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
          <div className="absolute inset-0 bg-[url('/assets/background.png')] bg-cover bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        {/* Top Navigation */}
        <header className="sticky top-0 z-50 flex w-full items-center justify-center border-b bg-gradient-to-b from-[#1D0D25] to-[#673086] py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 w-full items-center justify-between px-8 md:w-3/4">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/assets/logo.png"
                alt="Buddy Logo"
                width={72}
                height={72}
                // className="h-8 w-8"
              />
              <span className="hidden text-2xl font-bold text-white sm:inline-block">
                Buddy
              </span>
            </Link>

            {/* Main Navigation */}

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* <ModeToggle /> */}
              <div className="flex items-center space-x-4">
                {isLoginPage ? (
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="hidden sm:flex"
                  >
                    <Link href={ROUTES.REGISTER}>Sign up</Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="hidden sm:flex"
                  >
                    <Link href={ROUTES.LOGIN}>Sign in</Link>
                  </Button>
                )}
              </div>
              {/* Mobile Navigation Menu */}
              <div className="container flex items-center justify-between md:hidden">
                {isLoginPage ? (
                  <Button asChild variant="default" size="sm">
                    <Link href={ROUTES.REGISTER}>Sign up</Link>
                  </Button>
                ) : (
                  <Button asChild variant="default" size="sm">
                    <Link href={ROUTES.LOGIN}>Sign in</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative flex min-h-[calc(100vh-8rem)] w-full flex-col items-center justify-center py-8">
          {children}
        </main>
      </div>
  );
}
