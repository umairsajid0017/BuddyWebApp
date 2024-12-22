import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";

export function Hero() {
  return (
    <section
      className="hover:bg-[#ca2b2e]p-16 my-6 flex items-center justify-between rounded-lg py-20 text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1729194515785-fcd7d4f292d9?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        height: "438px",
        backgroundSize: "cover",
      }}
    >
      <div className="container relative flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl">
          <h1 className="mb-6 text-center text-4xl font-medium md:text-5xl">
            Find the right service, <br /> right away
          </h1>
          <div className="flex w-full">
            <Input
              type="text"
              placeholder="Search for any service..."
              className="h-14 rounded-r-none border-0 px-4 text-text-900 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button className="hover:bg-[#EC2D30 h-14 rounded-l-none">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
        <div className="mt-8 flex items-center space-x-4 text-sm">
          <span>Quick Find:</span>
          {["Mason", "Plumber", "Mechanic", "Decorator"].map((company) => (
            <Button
              size={"sm"}
              key={company}
              className="border border-white bg-transparent font-semibold hover:bg-secondary-800"
            >
              {company}
            </Button>
          ))}
        </div>
        {/* <div className="absolute right-0 top-0 h-full w-1/3">
          <Image
            src="/placeholder.svg?height=400&width=300"
            alt="Freelancer"
            width={300}
            height={400}
            className="rounded-lg object-cover"
          />
        </div> */}
      </div>
    </section>
  );
}
