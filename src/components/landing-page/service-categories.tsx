
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
import { useCategories } from "@/apis/apiCalls";
import { useEffect } from "react";
import { getImageUrl } from "@/helpers/utils";

// const categories = [
//   { icon: "/assets/icons/mason.svg", label: "Mason" },
//   { icon: "/assets/icons/electrician.svg", label: "Electrician" },
//   { icon: "/assets/icons/plumber.svg", label: "Plumber" },
//   { icon: "/assets/icons/painter.svg", label: "Painter" },
//   { icon: "/assets/icons/carpenter.svg", label: "Carpenter" },
//   { icon: "/assets/icons/mechanic.svg", label: "Mechanic" },
//   { icon: "/assets/icons/helper.svg", label: "Helper" },
//   { icon: "/assets/icons/maid.svg", label: "Maid" },
//   { icon: "/assets/icons/servant.svg", label: "Servant" },
//   // { icon: "/assets/icons/cook.svg", label: "Cook" },
//   // { icon: "/assets/icons/driver.svg", label: "Driver" },
//   // { icon: "/assets/icons/security-guard.svg", label: "Security Guard" },
//   // { icon: "/assets/icons/gardener.svg", label: "Gardener" },
//   // { icon: "/assets/icons/tent-service.svg", label: "Tent Service" },
//   // { icon: "/assets/icons/food-catering.svg", label: "Food Catering" },
//   // { icon: "/assets/icons/party-planner.svg", label: "Party Planner" },
//   // { icon: "/assets/icons/decorator.svg", label: "Decorator" },
// ];

export function ServiceCategories() {
    const { categories, isLoading: categoriesLoading } = useCategories();

    useEffect(()=> {
      console.log(categories);
    }, []);

  return (
    <section className="my-8">
      <div className="container px-4">
        <h2 className="mb-8 text-2xl font-semibold sm:text-3xl">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group transition-all duration-300 hover:border-primary hover:shadow-lg"
            >
              <CardContent className="flex flex-col items-center p-4 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                  <Image
                    src={getImageUrl(category.image)}
                    alt={category.title}
                    width={32}
                    height={32}
                    className="w-10"
                  />
                </div>
                <span className="text-sm font-medium sm:text-base">
                  {category.title}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
