import { Grid3X3, HandshakeIcon, Zap, Award } from "lucide-react";

const features = [
  {
    icon: Grid3X3,
    title: "Over 700 categories",
    description: "Find any service you need",
  },
  {
    icon: HandshakeIcon,
    title: "Clear, transparent pricing",
    description: "No hidden fees or surprises",
  },
  {
    icon: Zap,
    title: "Quality work done faster",
    description: "Get your project completed on time",
  },
  {
    icon: Award,
    title: "24/7 award-winning support",
    description: "We're always here to help",
  },
];

export function Features() {
  return (
    <section className="py-10">
      <div className="container">
        <h2 className="font-regular mb-8 leading-relaxed text-text-800 lg:text-5xl text-center">
          A whole world of freelance <br />
          talent at your fingertips
        </h2>
        <div className="my-16 grid grid-cols-1 gap-8 py-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center"
            >
              <feature.icon className="mb-4 h-12 w-12 text-secondary-800" />
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
