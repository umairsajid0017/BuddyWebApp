import { type Service } from "@/lib/types";
import React from "react";
import { Button } from "../ui/button";
import PopularServices from "./popular-services-component";

interface PopularServicesSectionProps {
    services: Service[];
}

const PopularServicesSection: React.FC<PopularServicesSectionProps> = ({ services }) => {
  return (
    <>
       {services.length > 0 &&
      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Most Popular Services</h3>
          <Button variant="link" className="text-sm">
            See All
          </Button>
        </div>
        <div className="flex items-center mt-4 space-x-2 overflow-scroll no-scrollbar">
          {services.map((filter) => (
            <Button key={filter.id} variant={"outline"}>
              {filter.name}
            </Button>
          ))}
        </div>
        <PopularServices services={services} />
      </section>
    }
    </>
  );
};

export default PopularServicesSection;