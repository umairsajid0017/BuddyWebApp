"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { useServiceDetails, useServices } from "@/apis/apiCalls";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Main from "@/components/ui/main";
import PopularServicesSection from "@/components/services/popular-services-section";
import { Badge } from "@/components/ui/badge";
import { Service, ServiceRating } from "@/types/service-types";
import { ReviewManager } from "@/components/services/review-manager";
import UserProfileCard from "@/components/services/user-profile-card";
import { CreateBookingDialog } from "@/components/bookings/create-booking-dialogue";
import { CURRENCY, LoginType } from "@/constants/constantValues";
import { ServiceImageGallery } from "@/components/services/service-image-gallery";
import { CollapsibleText } from "@/components/ui/collapsible-text";
import { useAuth } from "@/store/authStore";
import { StarDisplay } from "@/components/ui/star-rating";

interface ServiceDetailsProps {
  params: {
    id: string;
  };
}

const ServiceDetailsSkeleton = () => (
  <Main>
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <Skeleton className="h-96 w-full rounded-lg" />
              </div>
              <div className="mt-6 md:mt-0 md:w-1/2 md:pl-6">
                <Skeleton className="mb-2 h-8 w-3/4" />
                <Skeleton className="mb-4 h-5 w-1/2" />
                <Skeleton className="mb-4 h-6 w-1/3" />
                <Skeleton className="mb-4 h-8 w-1/4" />
                <Skeleton className="mb-2 h-6 w-1/4" />
                <Skeleton className="mb-4 h-24 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="mx-auto mb-4 h-24 w-24 rounded-full" />
            <Skeleton className="mb-2 h-6 w-full" />
            <Skeleton className="mb-4 h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  </Main>
);

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ params }) => {
  const { user } = useAuth();
  const { data: serviceResponse, isLoading, error } = useServiceDetails(+params.id);
  const { services } = useServices();
  const [service, setService] = useState<Service>();

  const isGuestUser = user?.login_type === LoginType.GUEST;

  useEffect(() => {
    if (serviceResponse) {
      setService({
        ...serviceResponse.records,
        long: serviceResponse.records.long ? Number(serviceResponse.records.long) : null,
        lat: serviceResponse.records.lat ? Number(serviceResponse.records.lat) : null,
        fixed_price: serviceResponse.records.fixed_price,
      });
    }
    console.log(serviceResponse);
  }, [serviceResponse]);

 
  const reviewCount = service?.total_reviews ? Number(service.total_reviews) : 0;

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
                      serviceName={service.name}
                    />
                  </div>
                  <div className="mt-6 md:mt-0 md:w-1/2 md:pl-6">
                    <h1 className="mb-2 text-3xl font-bold">
                      {service.name || "Service Name"}
                    </h1>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="font-regular text-base font-bold">
                        {service.user.name ?? "User Name"}
                      </span>
                    </div>
                    
                    {/* Enhanced Rating Display */}
                    <div className="mb-4 flex items-center gap-4">
                      {service.ratings && Number(service.ratings) > 0 ? (
                        <div className="flex items-center gap-2">
                          <StarDisplay 
                            rating={Number(service.ratings)}
                            size="md"
                            showValue={true}
                            showCount={true}
                            reviewCount={reviewCount}
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No ratings yet</span>
                      )}
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
                      {service.description ? <CollapsibleText text={service.description} /> : "No description available."}
                    </p>
                    <CreateBookingDialog initialService={service} mode="book" isGuest={isGuestUser} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <UserProfileCard user={service.user} />
          </section>
          <PopularServicesSection services={services} />
          <ReviewManager serviceId={service.id} showAddReview={false} isServicePage={true}  />
        </div>
      )}
    </Main>
  );
};

export default ServiceDetails;
