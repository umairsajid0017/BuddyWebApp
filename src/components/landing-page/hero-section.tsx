import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="my-6 rounded-lg bg-primary p-16 py-20 text-white">
      <div className="container relative">
        <div className="max-w-2xl">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            Find the right <span className="">freelance</span> service, right
            away
          </h1>
          <div className="flex">
            <Input
              type="text"
              placeholder="Search for any service..."
              className="h-14 rounded-r-none border-0 px-4 text-text-900 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button className="h-14 rounded-l-none bg-text-800 hover:bg-text-900">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
        <div className="mt-8 flex items-center space-x-4 text-sm">
          <span>Trusted by:</span>
          {["Meta", "Google", "Netflix", "P&G", "Paypal"].map((company) => (
            <span key={company} className="font-semibold">
              {company}
            </span>
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
