"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Search, Search as SearchIcon, Star } from "lucide-react";
import { useSearchServices } from "@/apis/apiCalls";
import { cn, getImageUrl } from "@/helpers/utils";
import { Button } from "@/components/ui/button";
import TooltipWrapper from "@/components/ui/tooltip-wrapper";
import { CURRENCY } from "@/constants/constantValues";
import { Category } from "@/types/category-types";
import { Service } from "@/types/service-types";
import { SearchResponse } from "@/apis/api-response-types";
import { getCategoryRoute, getServiceRoute, ROUTES } from "@/constants/routes";

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
            src={getImageUrl(category.image)}
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
  service: Service;
  onSelect: (service: Service) => void;
}) => (
  <div
    className="cursor-pointer rounded-lg p-3 transition-all hover:bg-accent/50"
    onClick={() => onSelect(service)}
  >
    <div className="flex items-center gap-4">
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        {service.images?.[0] ? (
          <Image
            src={getImageUrl(service.images[0].name)}
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
  givenKeyword,
  isHeroSection = false,
}: {
  onClose?: () => void;
  className?: string;
  givenKeyword?: string;
  isHeroSection?: boolean;
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
    if (givenKeyword && givenKeyword.length > 1) {
      setSearchTerm(givenKeyword);
      setDebouncedSearchTerm(givenKeyword);
      setShowDropdown(true);
    }
  }, [givenKeyword]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if(searchTerm.length > 1) 
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
    if(isHeroSection) {
      router.push(ROUTES.LOGIN);
    } else {
      router.push(getCategoryRoute(slug, category.id));
    }
  };

  const handleSelectService = (
    service: SearchResponse["records"]["services"][0],
  ) => {
    setSearchTerm(service.name);
    setShowDropdown(false);
    if(isHeroSection) {
      router.push(ROUTES.LOGIN);
    } else {
      router.push(getServiceRoute(service.id.toString()));
    }
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
            {categories.map((category: Category) => (
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
            {services.map((service: Service) => (
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
          <TooltipWrapper content="Search for services by name, category or description">
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
                "text-text-900"
              )}
            />
          </TooltipWrapper>
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
