import Image from "next/image";
import { Hammer, UserCheck, BarChart, ShieldCheck } from "lucide-react"; // Replace with relevant icons

export function PathToSuccess() {
  const features = [
    {
      icon: Hammer,
      title: "Skilled Professionals",
      description:
        "Access a network of trusted experts for any home service, from repairs to renovations.",
    },
    {
      icon: UserCheck,
      title: "Customer Satisfaction",
      description:
        "We prioritize quality and ensure every job is completed to your satisfaction.",
    },
    {
      icon: BarChart,
      title: "Performance Insights",
      description:
        "Track service quality and performance to make informed decisions and improvements.",
    },
  ];

  return (
    <section className="py-12 md:py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-lg font-medium text-primary">
                  Your Trusted Partner
                </p>
                <h2 className="font-regular mb-8 leading-relaxed text-text-800 lg:text-5xl">
                  Path to Success
                </h2>
              </div>
            </div>
            <div className="space-y-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[500px] w-[300px] md:h-[600px] md:w-[400px]">
              <Image
                src="/assets/landing-page/success.png"
                alt="Mobile app interface"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
