import {
  Monitor,
  PenTool,
  Smartphone,
  FileText,
  Video,
  Cpu,
  Music,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

const categories = [
  { icon: "/assets/icons/mason.svg", label: "Mason" },
  { icon: "/assets/icons/electrician.svg", label: "Electrician" },
  { icon: "/assets/icons/plumber.svg", label: "Plumber" },
  { icon: "/assets/icons/painter.svg", label: "Painter" },
  { icon: "/assets/icons/carpenter.svg", label: "Carpenter" },
  { icon: "/assets/icons/mechanic.svg", label: "Mechanic" },
  { icon: "/assets/icons/helper.svg", label: "Helper" },
  { icon: "/assets/icons/maid.svg", label: "Maid" },
  { icon: "/assets/icons/servant.svg", label: "Servant" },
  // { icon: "/assets/icons/cook.svg", label: "Cook" },
  // { icon: "/assets/icons/driver.svg", label: "Driver" },
  // { icon: "/assets/icons/security-guard.svg", label: "Security Guard" },
  // { icon: "/assets/icons/gardener.svg", label: "Gardener" },
  // { icon: "/assets/icons/tent-service.svg", label: "Tent Service" },
  // { icon: "/assets/icons/food-catering.svg", label: "Food Catering" },
  // { icon: "/assets/icons/party-planner.svg", label: "Party Planner" },
  // { icon: "/assets/icons/decorator.svg", label: "Decorator" },
];

export function ServiceCategories() {
  return (
    <section className="">
      <div className="container">
        <div className="grid grid-cols-3 gap-4 md:grid-cols-9">
          {categories.map((category) => (
            <Card
              key={category.label}
              className="hover-radial-gradient flex cursor-pointer flex-col items-start text-start text-text-700 shadow-md"
            >
              <CardContent className="flex flex-col items-start p-4 text-start">
                <Image
                  src={category.icon}
                  alt={category.label}
                  width={32}
                  height={32}
                  className="mb-4 h-12 w-12"
                />{" "}
                <span className="text-sm font-semibold">{category.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
