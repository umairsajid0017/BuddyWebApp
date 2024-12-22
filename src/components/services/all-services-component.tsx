"use client";

import React from "react";
import { useServices } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceCard from "./services-card";
import FilterBar from "@/components/services/filter-bar";
import { Service } from "@/lib/types";
import useFiltersStore from "@/store/filterStore";
import { SearchIcon } from "lucide-react";

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

const AllServices: React.FC = () => {
  const { data: servicesResponse, isLoading, error } = useServices();
  const { filters } = useFiltersStore();
  const services = servicesResponse ?? [];

  const filteredAndSortedServices = React.useMemo(() => {
    if (!services) return [];

    let filtered = [...services];

    // Apply budget filter
    if (filters.budget) {
      const [min, max] = filters.budget.split("-").map(Number);
      filtered = filtered.filter((service) => {
        const price = Number(service.price);
        if (min === undefined || max === undefined) return true;
        if (max === 0) return price >= min;
        return price >= min && price <= max;
      });
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime(),
        );
        break;
      case "price_asc":
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price_desc":
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
    }

    return filtered;
  }, [services, filters]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">All Services</h1>
        <FilterBar />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(12)].map((_, index) => (
            <ServiceSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-center text-red-500">
        <div>
          <h2 className="text-xl font-semibold">Error loading services</h2>
          <p className="mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">All Services</h1>
        <p className="text-muted-foreground">
          Browse through our collection of professional services
        </p>
      </div>
      <FilterBar />
      {filteredAndSortedServices.length === 0 ? (
        <div className="mt-8 flex h-[40vh] flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <SearchIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No services found</h2>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your filters or search criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredAndSortedServices.map((service: Service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllServices;
