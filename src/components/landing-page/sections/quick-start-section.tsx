import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function QuickStartSection() {
  const features = [
    "Easy access to manage service requests and providers",
    "Track and analyze service performance seamlessly",
    "Efficient tools to enhance service delivery and response times",
    "Simplify administration so you can focus on growth",
  ];

  return (
    <section className="py-12 md:py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg md:h-[600px]">
              <Image
                src="/assets/landing-page/dashboard.png"
                alt="Admin Dashboard Interface"
                fill
                className="object-contain"
              />
              {/* Browser dots decoration */}
              <div className="absolute left-4 top-0 flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              </div>
            </div>
          </div>
          <div className="order-1 flex flex-col justify-center lg:order-2">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="font-regular mb-8 leading-relaxed text-text-800 lg:text-5xl">
                  Quick start your management{" "}
                  <span className="text-primary">with an all-in-one panel</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Buddy provides an intuitive admin panel, giving you full
                  control over service management and performance tracking.
                </p>
              </div>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="w-fit">
                Know More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
