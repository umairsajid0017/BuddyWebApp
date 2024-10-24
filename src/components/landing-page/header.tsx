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
          <Link href="/" className="">
            <Image src={"/assets/logo.jpg"} alt="logo" width={54} height={54} />
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
              Become a Seller
            </Link>
            <Link
              href="/login"
              className="text-base font-semibold hover:text-primary"
            >
              Sign In
            </Link>
            <Button
              size={"lg"}
              className=""
              onClick={() => router.push("/register")}
            >
              Join
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
