"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { useService, useServices } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PopularServices from "@/components/services/popular-services-component";
import useServicesStore from "@/store/servicesStore";
import Main from "@/components/ui/main";
import PopularServicesSection from "@/components/services/popular-services-section";

interface ServiceDetailsProps {
  params: {
    id: string;
  };
}

const ServiceDetailsSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex flex-col gap-8 md:flex-row">
      <div className="md:w-1/2">
        <Skeleton className="aspect-square w-full rounded-lg" />
      </div>
      <div className="md:w-1/2">
        <Skeleton className="mb-4 h-10 w-3/4" />
        <Skeleton className="mb-4 h-6 w-1/2" />
        <Skeleton className="mb-2 h-4 w-1/4" />
        <Skeleton className="mb-4 h-4 w-1/3" />
        <Skeleton className="mb-4 h-8 w-1/4" />
        <Skeleton className="mb-2 h-6 w-1/3" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-3/4" />
        <Skeleton className="h-10 w-1/3" />
      </div>
    </div>
  </div>
);

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ params }) => {
  const { services, setServices } = useServicesStore();
  const { data: service, isLoading, error } = useService(+params.id);
  const {
    data: servicesResponse,
    isLoading: allServicesLoading,
    error: allServicesError,
  } = useServices();

  useEffect(() => {
    if (servicesResponse) {
      setServices(servicesResponse.data);
    }
    console.log("servicesResponse", services);
  }, [servicesResponse, allServicesLoading]);

  if (isLoading) {
    return <ServiceDetailsSkeleton />;
  }

  if (error || !service) {
    notFound();
  }

  return (
    <Main>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="md:w-1/2">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt={service.name}
                width={400}
                height={400}
                className="w-full rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h1 className="mb-2 text-3xl font-bold">{service.name}</h1>
              <div className="mb-4 flex items-center">
                <span className="mr-2 text-lg font-semibold">{"Joh Doe"}</span>
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-current text-yellow-400" />
                  <span className="ml-1">
                    {Array.isArray(service.ratings)
                      ? service.ratings.join(", ")
                      : service.ratings}
                  </span>
                  {/* <span className="ml-2 text-muted-foreground">({service.} reviews)</span> */}
                </div>
              </div>
              <div className="mb-4">
                <span className="mr-2 inline-block rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
                  {service.category_id}
                </span>
                {/* <span className="text-muted-foreground">{service.location}</span> */}
              </div>
              <p className="mb-4 text-2xl font-bold">
                ${service.price}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  (Floor price)
                </span>
              </p>
              <h2 className="mb-2 text-xl font-semibold">About me</h2>
              <p className="mb-4 text-muted-foreground">
                {service.description}
              </p>
              <Button
                size="lg"
                onClick={() => console.log(`Booking service: ${service.id}`)}
              >
                Book Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <PopularServicesSection services={services} />
    </Main>
  );
};

export default ServiceDetails;
