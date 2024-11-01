import Image from "next/image";
import { Code2, Clock, Wand2, Layout } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      icon: Code2,
      title: "Development",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      color: "#00b286",
    },
    {
      icon: Layout,
      title: "Web Design",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      color: "#fbbf24",
    },
    {
      icon: Wand2,
      title: "Do Magic",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      color: "#ef4444",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      color: "#3b82f6",
    },
  ];

  return (
    <section className="py-12 md:py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25">
                <div
                  className="rounded-full bg-sky-100 shadow-lg"
                  style={{ width: "600px", height: "600px" }}
                />
              </div>
            </div>
            <div className="relative h-[500px] w-[300px] md:h-[600px] md:w-[400px]">
              <Image
                src="/assets/landing-page/benefits.png"
                alt="Mobile app interface"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h2 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
                Ton of benefits
              </h2>
              <p className="text-lg text-muted-foreground">
                DashCore will maximize your time and money
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="space-y-3">
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: benefit.color }}
                  >
                    <benefit.icon
                      className="h-6 w-6 text-primary"
                      color={benefit.color}
                    />
                  </div>

                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
