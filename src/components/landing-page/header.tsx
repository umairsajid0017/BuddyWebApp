import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  return (
    <header className="w-full border-b">
      <div className="max-w-8xl container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center">
            <Image src={"/assets/logo.png"} alt="logo" width={72} height={72} />
            <span className="text-3xl font-bold text-text-900">Buddy</span>
          </Link>
          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              href="#"
              className="text-base font-semibold hover:text-primary"
            >
              Explore
            </Link>
            <div className="flex items-center">
              <Globe className="mr-1 h-4 w-4" />
              <span className="text-base font-semibold">English</span>
            </div>
            <Link
              href="#"
              className="text-base font-semibold hover:text-primary"
            >
              Become a Worker
            </Link>
            <Link
              href="/login"
              className="text-base font-semibold hover:text-primary"
            >
              Sign Up
            </Link>
            <Button
              size={"lg"}
              className=""
              onClick={() => router.push("/register")}
            >
              Sign in
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
