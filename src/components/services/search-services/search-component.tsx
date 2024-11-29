"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { SearchServicesResponse } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Search as SearchIcon } from "lucide-react";
import { useSearchServices } from "@/lib/apis/search-services";
import { cn } from "@/lib/utils";

const SearchResult = ({
  service,
  onSelect,
}: {
  service: SearchServicesResponse;
  onSelect: (service: SearchServicesResponse) => void;
}) => (
  <div
    className="cursor-pointer rounded-lg p-3 transition-all hover:bg-accent/50"
    onClick={() => onSelect(service)}
  >
    <div className="flex items-center gap-4">
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${service.image}`}
          alt={service.service_name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-foreground">{service.service_name}</h4>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Rs. {parseFloat(service.price).toLocaleString()}
          </p>
          <div className="flex items-center text-xs text-muted-foreground">
            <svg
              className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-0.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
            </svg>
            <span>4.8</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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

  const { data: searchServices, isLoading } = useSearchServices({
    name: debouncedSearchTerm,
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

  const handleSelect = (service: SearchServicesResponse) => {
    setSearchTerm(service.service_name);
    setShowDropdown(false);
    router.push(`/services/${service.service_id}`);
  };

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <div className="relative">
        <div className="relative flex items-center">
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
              "h-12 w-full rounded-full bg-background px-11 py-3 text-sm",
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
              className="absolute right-4 rounded-full p-1 hover:bg-muted"
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
          ) : searchServices?.length ? (
            <div className="max-h-[60vh] overflow-y-auto">
              {searchServices.map((service) => (
                <SearchResult
                  key={service.service_id}
                  service={service}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No services found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
