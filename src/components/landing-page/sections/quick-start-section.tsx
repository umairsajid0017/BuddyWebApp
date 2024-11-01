import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function QuickStartSection() {
  const features = [
    "Perfect for modern and growing Apps & Startups",
    "Predesigned growing set of modern web components",
    "Modern & eye-catching design to enchant your visitors",
    "Focus on your business, don't worry about your website",
  ];

  return (
    <section className="py-12 md:py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg md:h-[600px]">
              <Image
                src=""
                alt="Dashboard Interface"
                fill
                className="object-cover"
              />
              {/* Browser dots decoration */}
              <div className="absolute left-4 top-4 flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              </div>
            </div>
          </div>
          <div className="order-1 flex flex-col justify-center lg:order-2">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                  Quick start your business{" "}
                  <span className="text-[#5850EC]">with the right tools</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  DashCore helps you build a modern & beautiful web presence.
                  Our growing set of components will make your life waaaay
                  easier.
                </p>
              </div>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-[#5850EC]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className="w-fit bg-[#5850EC] hover:bg-[#5850EC]/90"
              >
                Know More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
