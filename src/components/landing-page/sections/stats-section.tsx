import { Package, Download, Settings, Users } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: Package,
      value: "273",
      label: "Components",
    },
    {
      icon: Download,
      value: "654",
      label: "Downloads",
    },
    {
      icon: Settings,
      value: "7941",
      label: "Followers",
    },
    {
      icon: Users,
      value: "654",
      label: "New users",
    },
  ];

  return (
    <section className="relative py-12 md:py-24">
      <div className="absolute inset-0 bg-[#5850EC] [clip-path:polygon(0_10%,100%_0%,100%_90%,0%_100%)]" />
      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center text-white">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            Millions business rely on DashCore
          </h2>
          <p className="mb-8 text-lg text-white/90">
            These amazing stats can be wrong, many happy customers around the
            world trust our service to boost their products
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center text-white md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-2">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-white/90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
