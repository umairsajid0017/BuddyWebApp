import React, { useEffect, useState } from "react";
import { useServices, useShowBookmarks } from "@/apis/apiCalls";
import { Card } from "../ui/card";
import { Service } from "@/types/service-types";
import { Skeleton } from "../ui/skeleton";
import ServiceCard from "./services-card";

interface PopularServicesProps {
  services: Service[];
}

const PEXELS_API_KEY =
  "p4VqT6asTRkRiLQZEaWabx14UQmR0P6Owm1RLS4GpN9iQU6ObazuNl1l"; // Replace with your actual Pexels API key

const ServiceSkeleton = () => (
  <Card className="p-4">
    <Skeleton className="h-32 w-full" />
    <Skeleton className="mt-2 h-4 w-3/4" />
    <Skeleton className="mt-2 h-3 w-full" />
    <div className="mt-2 flex items-center justify-between">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-4 w-24" />
    </div>
  </Card>
);

const PopularServices: React.FC<PopularServicesProps> = ({ services }) => {
  const { isLoading, error } = useServices();
  const showBookmarks = useShowBookmarks();
  const [bookmarkedServices, setBookmarkedServices] = useState<number[]>([]);

  useEffect(() => {
    if (showBookmarks.data?.records) {
      const bookmarkedIds = showBookmarks.data.records
        .filter(bookmark => bookmark.status === 1)
        .map(bookmark => parseInt(bookmark.service_id));
      
      setBookmarkedServices(bookmarkedIds);
    }
  }, [showBookmarks.data]);

  
  if (isLoading) {
    return (
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array<number>(8)].map((_, index) => (
          <ServiceSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {services.map((service: Service) => (
        <ServiceCard 
          key={service.id} 
          service={service} 
          bookmarked={bookmarkedServices.includes(service.id)} 
        />
      ))}
    </div>
  );
};

export default PopularServices;
