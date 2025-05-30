"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import FilterBar from "@/components/services/filter-bar";
import ServiceCard from "@/components/services/services-card";

import { useServicesByCategory } from "@/hooks/useServicesByCategories";
import { useCategory, useFilters } from "@/apis/apiCalls";
import { Service } from "@/types/service-types";

// Loading skeleton component for services
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

// Empty state component when no services are found
const NoResultsFound: React.FC = () => (
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
      We couldn&apos;t find any services in this category. Try browsing other categories.
    </p>
    <Button asChild>
      <Link href="/">Browse All Services</Link>
    </Button>
  </div>
);

// Category header with title and description
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
      <h1 className="text-2xl font-bold text-text-800">
        {category.records.title}
      </h1>
      <p className="mt-2 text-sm text-text-600">
        Browse all services in {category.records.title}
      </p>
    </div>
  );
};

// Services grid component
const ServicesGrid: React.FC<{ services: Service[] }> = ({ services }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {services.map((service) => (
      <ServiceCard key={service.id} service={service} />
    ))}
  </div>
);

// Loading state component
const LoadingState: React.FC<{ categoryId: string }> = ({ categoryId }) => (
  <div className="container mx-auto px-4 py-8">
    <CategoryHeader categoryId={categoryId} />
    <FilterBar />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 12 }, (_, index) => (
        <ServiceSkeleton key={index} />
      ))}
    </div>
  </div>
);

// Error state component
const ErrorState: React.FC<{ categoryId: string; error: Error }> = ({ 
  categoryId, 
  error 
}) => (
  <div className="container mx-auto px-4 py-8">
    <CategoryHeader categoryId={categoryId} />
    <FilterBar />
    <div className="mt-8 text-center text-red-500">
      Error loading services: {error.message || 'Failed to load services'}
    </div>
  </div>
);

// Main page component
const CategoryPage: React.FC = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id") ?? "";
  const { filters } = useFilters();

  const { 
    data: services,
    isLoading,
    error,
    isError,
    isFetching
  } = useServicesByCategory(categoryId);

  // Filter and sort services based on selected filters
  const processedServices = React.useMemo(() => {
    if (!services?.length) return [];

    const sortedServices = [...services];

    switch (filters.sortBy) {
      case "price_asc":
        sortedServices.sort((a, b) => Number(a.fixed_price) - Number(b.fixed_price));
        break;
      case "price_desc":
        sortedServices.sort((a, b) => Number(b.fixed_price) - Number(a.fixed_price));
        break;
      default:
        break;
    }

    return sortedServices;
  }, [services, filters.sortBy]);

  // Handle loading state
  if (isLoading || isFetching) {
    return <LoadingState categoryId={categoryId} />;
  }

  // Handle error state
  if (isError && error) {
    return <ErrorState categoryId={categoryId} error={error as Error} />;
  }

  // Main content
  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryHeader categoryId={categoryId} />
      <FilterBar />
      {processedServices.length > 0 ? (
        <ServicesGrid services={processedServices} />
      ) : (
        <NoResultsFound />
      )}
    </div>
  );
};

export default CategoryPage;
