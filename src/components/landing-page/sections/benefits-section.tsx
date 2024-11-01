import Image from "next/image";
import { Hammer, Wrench, PartyPopper, Clock } from "lucide-react"; // Replace with relevant icons

export function BenefitsSection() {
  const benefits = [
    {
      icon: Hammer,
      title: "Masonry",
      description:
        "Expert masonry services for all your home construction and repair needs.",
      bgColor: "#CCF0E7",
      color: "#00B286",
    },
    {
      icon: Wrench,
      title: "Mechanic",
      description:
        "Reliable mechanics to keep your appliances and vehicles running smoothly.",
      bgColor: "#FFF2D9",
      color: "#FFC041",
    },
    {
      icon: PartyPopper,
      title: "Party Planning",
      description:
        "Make your events unforgettable with professional party planning services.",
      bgColor: "#CFF4FC",
      color: "#0DCAF0",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Efficient service delivery to save you time and effort.",
      bgColor: "#DDD6FF",
      color: "#7A5FFF",
    },
  ];

  return (
    <section className="py-12">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex items-center justify-center">
            <div className="relative"></div>
            <div className="relative h-[500px] w-[300px] md:h-[600px] md:w-[400px]">
              <Image
                src="/assets/landing-page/benefits.png"
                alt="Mobile app interface"
                fill
                className="z-10 object-contain"
              />
              <div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 opacity-30">
                <div
                  className="rounded-full bg-[#FF9183] shadow-lg"
                  style={{ width: "600px", height: "600px" }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h2 className="font-regular mb-8 leading-relaxed text-text-800 lg:text-5xl">
                Discover the Buddy Advantage
              </h2>
              <p className="text-lg text-muted-foreground">
                Your one-stop solution for all home services, delivered with
                expertise and care.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="space-y-3">
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: benefit.bgColor }}
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
