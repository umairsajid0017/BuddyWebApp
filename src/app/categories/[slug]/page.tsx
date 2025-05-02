"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BookmarkIcon, StarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useServicesByCategory } from "@/hooks/useServicesByCategories";
import { useCategory, useFilters } from "@/apis/apiCalls";
import FilterBar from "@/components/services/filter-bar";
import { CURRENCY } from "@/constants/constantValues";
import { getImageUrl } from "@/helpers/utils";
import { CategoryService, Service } from "@/types/service-types";

const ServiceCard: React.FC<{ service: CategoryService }> = ({ service }) => (
  <Link href={`/services/${service.service_id}`} className="block">
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="relative h-44 overflow-hidden bg-gray-200">
        <Image
          src={
            service.images?.[0]?.name
              ? getImageUrl(service.images[0].name)
              : '/assets/placeholder.jpg'
          }
          alt={service.service_name}
          layout="fill"
          objectFit="cover"
          unoptimized
        />
      </div>
      <CardContent>
        <h4 className="mt-2 text-xl font-medium">{service.service_name}</h4>
        <p className="text-xs text-gray-600">{service.description.slice(0, 50)}...</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-primary">
            {service.fixed_price !== "0.00" ? (
              `${service.fixed_price} ${CURRENCY}`
            ) : (
              `${service.hourly_price}/hr ${CURRENCY}`
            )}
          </p>
          <div className="flex items-center text-xs text-gray-600">
            <BookmarkIcon className="h-4 w-4" />
            <span className="ml-1">{service.total_reviews} reviews</span>
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

const CategoryHeader: React.FC<{ categoryId: string }> = ({ categoryId }) => {
  const { data: category, isLoading } = useCategory(categoryId);

  if (isLoading) {
    return (
      <div className="mb-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
    );
  }

  if (!category) return null;

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-text-800">{category.records.title}</h1>
      <p className="mt-2 text-sm text-text-600">
        Browse all services in {category.records.title}
      </p>
    </div>

  );
};

const CategoryPage: React.FC = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id") ?? "";
  const { filters } = useFilters();

  console.log("Category ID from query:", categoryId);

  const { 
    data: services,
    isLoading,
    error,
    isError,
    isFetching
  } = useServicesByCategory(categoryId);

  const filteredAndSortedServices = React.useMemo(() => {
    if (!services?.length) return [];

    let filtered = [...services];

    switch (filters.sortBy) {
      case "price_asc":
        filtered.sort((a, b) => Number(a.fixed_price) - Number(b.fixed_price));
        break;
      case "price_desc":
        filtered.sort((a, b) => Number(b.fixed_price) - Number(a.fixed_price));
        break;
      default:
        break;
    }

    return filtered;
  }, [services, filters]);

  if (isLoading || isFetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CategoryHeader categoryId={categoryId} />
        <FilterBar />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(12)].map((_, index) => (
            <ServiceSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CategoryHeader categoryId={categoryId} />
        <FilterBar />
        <div className="text-center text-red-500 mt-8">
          Error loading services: {(error as Error).message || 'Failed to load services'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryHeader categoryId={categoryId} />
      <FilterBar />
      {filteredAndSortedServices.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredAndSortedServices.map((service: CategoryService) => (
            <ServiceCard key={service.service_id} service={service} />
          ))}
        </div>
      ) : (
        <NoResultsFound categoryId={categoryId} />
      )}
    </div>
  );
};

export default CategoryPage;
