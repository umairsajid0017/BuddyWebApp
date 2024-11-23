"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Service } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useServicesByCategory } from "@/hooks/useServicesByCategories";

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
  <Link href={`/services/${service.id}`} className="block">
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="relative h-44 overflow-hidden bg-gray-200">
        <Image
          src={process.env.NEXT_PUBLIC_IMAGE_URL + service.image}
          alt={service.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <CardContent>
        <h4 className="mt-2 text-xl font-medium">{service.name}</h4>
        <p className="text-xs text-gray-600">{service.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-primary">Rs. {service.price}</p>
          <div className="flex items-center text-xs text-gray-600">
            <StarIcon className="h-4 w-4" />
            <span className="ml-1">{service.ratings?.length || 0} reviews</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

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

const NoResultsFound: React.FC<{ categoryId: string }> = ({ categoryId }) => (
  <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <Image
      src="/assets/no-results-found.svg"
      alt="No results found"
      width={300}
      height={300}
      className="mb-8"
    />
    <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
      No services found in this category
    </h2>
    <p className="mb-8 text-center text-gray-600">
      We couldn&apos;t find any services in this category. Try browsing other
      categories.
    </p>
    <Button asChild>
      <Link href="/">Browse All Services</Link>
    </Button>
  </div>
);

const CategoryPage: React.FC = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id") ?? "";

  const { services, isLoading, error } = useServicesByCategory(categoryId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(12)].map((_, index) => (
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
      {services && services.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {services.map((service: Service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <NoResultsFound categoryId={categoryId} />
      )}
    </div>
  );
};

export default CategoryPage;
