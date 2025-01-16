import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Menu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex w-full items-center justify-between md:mx-auto md:max-w-screen-xl">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/assets/logo.png" alt="logo" width={40} height={40} />
            <span className="text-xl font-bold text-text-900 sm:text-2xl">
              Buddy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 md:flex">
            <Link href="#" className="text-sm font-medium hover:text-primary">
              Explore
            </Link>
            <div className="flex items-center space-x-1">
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">English</span>
            </div>
            <Link href="#" className="text-sm font-medium hover:text-primary">
              Become a Worker
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary"
            >
              Sign In
            </Link>
            <Button onClick={() => router.push("/register")}>Join Now</Button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="#"
                  className="text-sm font-medium hover:text-primary"
                >
                  Explore
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium hover:text-primary"
                >
                  Become a Worker
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-medium hover:text-primary"
                >
                  Sign In
                </Link>
                <Button
                  onClick={() => router.push("/register")}
                  className="w-full"
                >
                  Join Now
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
