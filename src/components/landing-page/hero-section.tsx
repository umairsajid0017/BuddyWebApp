import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";

export function Hero() {
  return (
    <section
      className="relative my-6 flex min-h-[438px] items-center justify-between rounded-lg py-20 text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1729194515785-fcd7d4f292d9?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container relative z-10 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          <h1 className="mb-6 text-center text-3xl font-medium sm:text-4xl md:text-5xl lg:text-6xl">
            Find the right service, <br className="hidden sm:block" /> right
            away
          </h1>
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <Input
              type="text"
              placeholder="Search for any service..."
              className="h-12 rounded-lg border-0 px-4 text-text-900 focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-14 sm:rounded-r-none"
            />
            <Button className="h-12 rounded-lg bg-primary hover:bg-primary-600 sm:h-14 sm:rounded-l-none">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span>Quick Find:</span>
          {["Mason", "Plumber", "Mechanic", "Decorator"].map((company) => (
            <Button
              size="sm"
              key={company}
              variant="outline"
              className="border-white bg-transparent font-semibold text-white hover:bg-white hover:text-primary"
            >
              {company}
            </Button>
          ))}
        </div>
      </div>
      {/* Add overlay */}
      <div className="absolute inset-0 rounded-lg bg-black/40" />
    </section>
  );
}
