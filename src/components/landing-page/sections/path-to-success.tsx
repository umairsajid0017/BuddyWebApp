import Image from "next/image";
import { Mail, Users, BarChart3, Shield } from "lucide-react";

export function PathToSuccess() {
  const features = [
    {
      icon: Mail,
      title: "Mail Management",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aut autem eum laudantium quas recusandae.",
    },
    {
      icon: Users,
      title: "Customers Tracking",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aut autem eum laudantium quas recusandae.",
    },
    {
      icon: BarChart3,
      title: "Advanced Reporting",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aut autem eum laudantium quas recusandae.",
    },
  ];

  return (
    <section className="py-12 md:py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-lg font-medium text-primary">
                  We are your only
                </p>
                <h2 className="text-4xl font-bold tracking-tight lg:text-5xl">
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
                src=""
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
