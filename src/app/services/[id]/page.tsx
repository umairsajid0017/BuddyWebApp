"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { useService, useServices } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useServicesStore from "@/store/servicesStore";
import Main from "@/components/ui/main";
import PopularServicesSection from "@/components/services/popular-services-section";
import { Service } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ServiceRating } from "@/lib/types/service-types";
import ReviewsSection from "@/components/services/reviews-section";
import UserProfileCard from "@/components/services/user-profile-card";
import { CreateBookingDialog } from "@/components/bookings/create-booking-dialogue";
import { CURRENCY } from "@/utils/constants";
import { ServiceImageGallery } from "@/components/services/service-image-gallery";

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
      setServices(servicesResponse);
    }
  }, [servicesResponse, allServicesLoading, setServices]);

  useEffect(() => {
    if (serviceResponse) {
      setService({
        ...serviceResponse,
        service_name: serviceResponse.name,
        ratings: [],
        long: serviceResponse.long ? Number(serviceResponse.long) : null,
        lat: serviceResponse.lat ? Number(serviceResponse.lat) : null,
        fixed_price: serviceResponse.fixed_price,
      });
      console.log(service);
    }
  }, [serviceResponse]);

  const averageRating =
    service && service.ratings.length > 0
      ? (
          service.ratings.reduce(
            (acc: number, rating: ServiceRating) => acc + rating.rating,
            0,
          ) / service.ratings.length
        ).toFixed(1)
      : null;

  const renderStars = (rating: number) => {
    const fullStars = Math.ceil(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="text-gray-900" size={16} fill={"#111827"} />
        ))}
      </>
    );
  };

  if (isLoading) {
    return <ServiceDetailsSkeleton />;
  }

  if (error || !serviceResponse) {
    notFound();
  }

  return (
    <Main>
      {service && (
        <div className="space-y-6">
          <section className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
            <Card className="w-full">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2">
                    <ServiceImageGallery
                      mainImage={service.images[0]?.name || ""}
                      images={service.images.slice(1)}
                      serviceName={service.service_name}
                    />
                  </div>
                  <div className="mt-6 md:mt-0 md:w-1/2 md:pl-6">
                    <h1 className="mb-2 text-3xl font-bold">
                      {service.service_name || "Service Name"}
                    </h1>
                    <div className="mb-4 flex items-center">
                      <span className="font-regular mr-2 text-base font-bold">
                        {service.user.name ?? "User Name"}
                      </span>
                      <div className="flex items-center">
                        <span className="ml-1">
                          {averageRating ? (
                            <span className="flex items-center">
                              <span className="mr-2 font-bold">
                                {averageRating}
                              </span>
                              {renderStars(parseFloat(averageRating))}
                            </span>
                          ) : (
                            "No ratings"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <Badge variant="secondary" className="bg-secondary-800">
                        {service.category.title || "Category"}
                      </Badge>
                    </div>
                    <p className="mb-4 text-2xl font-bold">
                      {CURRENCY}. {service.fixed_price}{" "}
                    </p>
                    <h2 className="mb-2 text-xl font-semibold">About me</h2>
                    <p className="mb-4 text-muted-foreground">
                      {service.description || "No description available."}
                    </p>
                    <CreateBookingDialog initialService={service} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <UserProfileCard user={service.user} />
          </section>
          <PopularServicesSection services={services} />
          <ReviewsSection ratings={service.ratings} />
        </div>
      )}
    </Main>
  );
};

export default ServiceDetails;
