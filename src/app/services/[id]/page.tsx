"use client";

import React, { useEffect, useState } from "react";
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
import { Service } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

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
  const { data: serviceResponse, isLoading, error } = useService(+params.id);
  const {
    data: servicesResponse,
    isLoading: allServicesLoading,
    error: allServicesError,
  } = useServices();

  const [service, setService] = useState<Service>();

  useEffect(() => {
    if (servicesResponse) {
      setServices(servicesResponse.data);
    }
    console.log("servicesResponse", services);
  }, [servicesResponse, allServicesLoading]);

  useEffect(() => {
    if (serviceResponse) {
      console.log("service", serviceResponse);
      setService(serviceResponse.data);
    }
  }, [service, isLoading]);
  if (isLoading) {
    return <ServiceDetailsSkeleton />;
  }

  if (error || !serviceResponse) {
    notFound();
    return null;
  }

  return (
    <Main>
      {service && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="md:w-1/2">
                {service.image && (
                  <Image
                    src={process.env.NEXT_PUBLIC_IMAGE_URL + service.image}
                    alt={service.name || "Service image"}
                    width={400}
                    height={400}
                    className="max-h-[400px] w-full rounded-lg object-cover"
                  />
                )}
              </div>
              <div className="md:w-1/2">
                <h1 className="mb-2 text-3xl font-bold">
                  {service.name || "Service Name"}
                </h1>
                <div className="mb-4 flex items-center">
                  <span className="mr-2 text-lg font-semibold">
                    {service.user.name || "User Name"}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-current text-yellow-400" />
                    <span className="ml-1">
                      {Array.isArray(service.ratings)
                        ? service.ratings.join(", ")
                        : service.ratings || "No ratings"}
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <Badge variant="secondary">
                    {service.category.title || "Category"}
                  </Badge>
                </div>
                <p className="mb-4 text-2xl font-bold">Rs. {service.price} </p>
                <h2 className="mb-2 text-xl font-semibold">About me</h2>
                <p className="mb-4 text-muted-foreground">
                  {service.description || "No description available."}
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
      )}
      <PopularServicesSection services={services} />
    </Main>
  );
};

export default ServiceDetails;
