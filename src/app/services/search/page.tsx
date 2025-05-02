"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useServices } from "@/apis/apiCalls";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchServices } from "@/apis/apiCalls";
import { CURRENCY } from "@/constants/constantValues";
import { SearchResponse } from "@/apis/api-response-types";
import { Service } from "@/types/service-types";
import { getImageUrl } from "@/helpers/utils";

//TODO: This service card component is used in multiple places. It should be moved to a shared component.
const ServiceCard: React.FC<{ service: SearchResponse["records"]["services"][0] }> = ({
  service,
}) => (
  <Link href={`/services/${service.id}`} className="block">
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="relative h-44 overflow-hidden bg-gray-200">
        <Image
          src={service.images?.[0]?.name 
            ? getImageUrl(service.images[0].name)
            : `/placeholder.svg?height=176&width=264`}
          alt={service.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <CardContent>
        <h4 className="mt-2 text-xl font-medium">{service.name}</h4>
        <p className="text-xs text-gray-600">{service.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-primary">
            {CURRENCY} {service.price_mode === "fixed" ? service.fixed_price : service.hourly_price}
            {service.price_mode === "hourly" && "/hr"}
          </p>
          <div className="flex items-center text-xs text-gray-600">
            <StarIcon className="h-4 w-4" />
            <span className="ml-1">
              {service.address}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

//TODO: This service skeleton component is used in multiple places. It should be moved to a shared component.
const ServiceSkeleton: React.FC = () => (
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

const NoResultsFound: React.FC<{ query: string }> = ({ query }) => (
  <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <Image
      src="/assets/no-results-found.svg"
      alt="No results found"
      width={300}
      height={300}
      className="mb-8"
    />
    <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
      No results found for &quot;{query}&quot;
    </h2>
    <p className="mb-8 text-center text-gray-600">
      We couldn&apos;t find any services matching your search. Try adjusting
      your search terms or browse our categories.
    </p>
    <Button asChild>
      <Link href="/">Browse All Services</Link>
    </Button>
  </div>
);

const SearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const {
    data: services,
    isLoading,
    error,
  } = useSearchServices({
    name: query,
  });
  // const services = servicesResponse?.data ?? []


  // const filteredServices = services?.filter(
  //   (service) =>
  //     service.name.toLowerCase().includes(query.toLowerCase()) ||
  //     service.description.toLowerCase().includes(query.toLowerCase()),
  // );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">
          Search Results for &quot;{query}&quot;
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array<number>(12)].map((_, index) => (
            <ServiceSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading services: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        Search Results for &quot;{query}&quot;
      </h1>
      {services?.records?.services && services.records.services.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {services.records.services.map((service: Service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <NoResultsFound query={query} />
      )}
    </div>
  );
};

export default SearchResults;
