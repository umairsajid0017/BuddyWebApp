import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import PopularServices from "./popular-services-component";
import Link from "next/link";
import { useCategories } from '@/apis/apiCalls'
import { Service } from "@/types/service-types";

interface PopularServicesSectionProps {
  services: Service[];
}

const PopularServicesSection: React.FC<PopularServicesSectionProps> = ({
  services,
}) => {
  const { categories } = useCategories();

  // State to store the selected category id for filtering
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Get the relevant categories based on the service category_id
  const popularCategories = categories.filter((category) =>
    services.some((service) => service.category_id === category.id),
  );

  // Filter the services based on the selected category
  const filteredServices = selectedCategory
    ? services.filter((service) => service.category_id === selectedCategory)
    : services;

  // Handler for category filter button click
  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  useEffect(() => {
    console.log("Selected Category:", selectedCategory);
  }, [selectedCategory]);

  return (
    <>
      {services.length > 0 && (
        <section className="mt-6 p-2 md:p-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Most Popular Services</h3>
            <Link href="/services">
              <Button variant="link" className="text-sm">
                See All
              </Button>
            </Link>
          </div>

          {/* Category filter buttons, including the "All" button */}
          <div className="no-scrollbar mt-4 flex items-center space-x-2 overflow-scroll">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => handleCategoryClick(null)}
            >
              All
            </Button>
            {popularCategories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.title}
              </Button>
            ))}
          </div>

          {/* Filtered services */}
          {/* <div className="no-scrollbar mt-4 flex items-center space-x-2 overflow-scroll">
            {filteredServices.map((service) => (
              <Button key={service.id} variant="outline">
                {service.name}
              </Button>
            ))}
          </div> */}

          <PopularServices services={filteredServices} />
        </section>
      )}
    </>
  );
};

export default PopularServicesSection;
