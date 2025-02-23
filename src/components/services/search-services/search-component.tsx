"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchResponse } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Search, Search as SearchIcon, Star } from "lucide-react";
import { useSearchServices } from "@/lib/apis/search-services";
import { cn } from "@/lib/utils";
import { CURRENCY } from "@/utils/constants";
import { Button } from "@/components/ui/button";

const CategoryResult = ({
  category,
  onSelect,
}: {
  category: { id: number; title: string; image: string };
  onSelect: (category: { id: number; title: string; image: string }) => void;
}) => (
  <div
    className="cursor-pointer rounded-lg p-3 transition-all hover:bg-accent/50"
    onClick={() => onSelect(category)}
  >
    <div className="flex items-center gap-4">
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        {category.image ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${category.image}`}
            alt={category.title}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <SearchIcon className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-foreground">{category.title}</h4>
      </div>
    </div>
  </div>
);

const ServiceResult = ({
  service,
  onSelect,
}: {
  service: SearchResponse["records"]["services"][0];
  onSelect: (service: SearchResponse["records"]["services"][0]) => void;
}) => (
  <div
    className="cursor-pointer rounded-lg p-3 transition-all hover:bg-accent/50"
    onClick={() => onSelect(service)}
  >
    <div className="flex items-center gap-4">
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        {service.images?.[0] ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${service.images[0].name}`}
            alt={service.name}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <SearchIcon className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-foreground">{service.name}</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {CURRENCY}{" "}
              {service.price_mode === "fixed"
                ? service.fixed_price
                : service.hourly_price}
              {service.price_mode === "hourly" && "/hr"}
            </p>
          </div>
          {service.address && (
            <p className="text-xs text-muted-foreground">{service.address}</p>
          )}
        </div>
        {service.description && (
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {service.description}
          </p>
        )}
      </div>
    </div>
  </div>
);

const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export function SearchComponent({
  onClose,
  className,
}: {
  onClose?: () => void;
  className?: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data: searchResults, isLoading } = useSearchServices({
    keyword: debouncedSearchTerm,
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCategory = (category: {
    id: number;
    title: string;
    image: string;
  }) => {
    setSearchTerm(category.title);
    setShowDropdown(false);
    const slug = createSlug(category.title);
    router.push(`/categories/${slug}?id=${category.id}`);
  };

  const handleSelectService = (
    service: SearchResponse["records"]["services"][0],
  ) => {
    setSearchTerm(service.name);
    setShowDropdown(false);
    router.push(`/services/${service.id}`);
  };

  const renderSearchResults = () => {
    // if (!searchResults?.records) return null;

    const { categories = [], services = [] } = searchResults?.records || {};
    const hasResults = categories.length > 0 || services.length > 0;

    if (searchResults?.error)
      return (
        <div className="p-4 text-center text-muted-foreground">
          No results found
        </div>
      );

    return (
      <>
        {categories.length > 0 && (
          <div>
            <div className="border-b px-3 py-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Categories
              </h3>
            </div>
            {categories.map((category) => (
              <CategoryResult
                key={category.id}
                category={category}
                onSelect={handleSelectCategory}
              />
            ))}
          </div>
        )}
        {services.length > 0 && (
          <div>
            <div className="border-b px-3 py-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Services
              </h3>
            </div>
            {services.map((service) => (
              <ServiceResult
                key={service.id}
                service={service}
                onSelect={handleSelectService}
              />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <div className="relative">
        <div className="relative flex items-center gap-2">
          <div className="pointer-events-none absolute left-4 flex items-center">
            <SearchIcon className="h-5 w-5 text-muted-foreground/60" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Looking for a service?"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className={cn(
              "h-12 w-full rounded-lg bg-background px-11 py-3 text-sm",
              "border border-input/90 shadow-sm",
              "placeholder:text-muted-foreground/60",
              "focus:border-input focus:outline-none focus:ring-1 focus:ring-ring/20",
              "transition-all duration-200",
            )}
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                inputRef.current?.focus();
              }}
              className="absolute right-20 rounded-full p-1 hover:bg-muted"
            >
              <svg
                className="h-4 w-4 text-muted-foreground/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <Button className="h-12 rounded-r-lg bg-primary hover:bg-primary-600">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showDropdown && searchTerm && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-border/50 bg-background/95 shadow-lg backdrop-blur-sm">
          {isLoading ? (
            <div className="p-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-2">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="mb-2 h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              {renderSearchResults()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
