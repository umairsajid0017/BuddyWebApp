import { type Service } from "@/lib/types";
import React, { use, useEffect } from "react";
import { Button } from "../ui/button";
import PopularServices from "./popular-services-component";
import Link from "next/link";
import useCategoriesStore from "@/store/categoriesStore";

interface PopularServicesSectionProps {
  services: Service[];
}

const PopularServicesSection: React.FC<PopularServicesSectionProps> = ({
  services,
}) => {
  const { categories } = useCategoriesStore();
  const popularServices = categories.filter((category) =>
    services.some((service) => service.category_id === category.id),
  );
  useEffect(() => {
    console.log(popularServices);
  }, [popularServices]);
  return (
    <>
      {services.length > 0 && (
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Most Popular Services</h3>
            <Link href="/services">
              <Button variant="link" className="text-sm">
                See All
              </Button>
            </Link>
          </div>
          <div className="no-scrollbar mt-4 flex items-center space-x-2 overflow-scroll">
            {services.map((filter) => (
              <Button key={filter.id} variant={"outline"}>
                {filter.name}
              </Button>
            ))}
          </div>
          <PopularServices services={services} />
        </section>
      )}
    </>
  );
};

export default PopularServicesSection;
