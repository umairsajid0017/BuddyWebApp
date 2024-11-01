"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useServices } from "@/lib/api";
import { SearchServicesResponse, type Service } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { StarIcon, Search, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import TooltipWrapper from "@/components/ui/tooltip-wrapper";
import { useSearchServices } from "@/lib/apis/search-services";

type SearchResultProps = {
  service: SearchServicesResponse;
  onSelect: (service: SearchServicesResponse) => void;
};

const SearchResult: React.FC<SearchResultProps> = ({ service, onSelect }) => (
  <Card
    className="cursor-pointer transition-colors hover:bg-accent"
    onClick={() => onSelect(service)}
  >
    <CardContent className="flex items-center gap-4 p-3">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${service.image}`}
          alt={service.service_name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-foreground">{service.service_name}</h4>
        <div className="mt-1 flex items-center justify-between">
          <p className="font-regular text-primary">
            Rs. {parseFloat(service.price).toLocaleString()}
          </p>
          <div className="flex items-center px-8 text-sm text-muted-foreground">
            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{"4.8"}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SearchSkeleton: React.FC = () => (
  <Card className="p-2">
    <CardContent className="flex items-center">
      <Skeleton className="mr-4 h-16 w-16 rounded-md" />
      <div className="flex-1">
        <Skeleton className="mb-2 h-4 w-3/4" />
        <Skeleton className="mb-2 h-3 w-full" />
        <div className="flex items-center">
          <Skeleton className="mr-2 h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </CardContent>
  </Card>
);

interface SearchComponentProps {
  onClose?: () => void;
}

export function SearchComponent({ onClose }: SearchComponentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data: searchServices, isLoading } = useSearchServices({
    name: debouncedSearchTerm,
  });

  const searchResults = useMemo(() => {
    if (!searchServices) return [];
    return searchServices;
  }, [searchServices]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      //TODO: Implement search functionality

      console.log("Search Services inside search component: ", searchServices);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [debouncedSearchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e);
      if (window.innerWidth < 768 && onClose) {
        onClose();
      }
    }
  };

  const handleSearch = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (searchTerm) {
      router.push(`/services/search?q=${encodeURIComponent(searchTerm)}`);
      if (window.innerWidth < 768 && onClose) {
        onClose();
      }
    }
  };

  const handleSelect = (service: SearchServicesResponse) => {
    setSearchTerm(service.service_name);
    setShowDropdown(false);
    router.push(`/services/${service.service_id}`);
  };

  const handleClear = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search services"
          className="h-14 w-full pl-10 pr-20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 transform">
          {searchTerm && (
            <TooltipWrapper content={"Clear"}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mr-1 hidden md:flex"
                onClick={handleClear}
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            </TooltipWrapper>
          )}
        </div>
      </form>
      {showDropdown && (
        <div className="absolute z-10 mt-1 max-h-96 w-full overflow-y-auto rounded-md bg-transparent shadow-lg">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, index) => <SearchSkeleton key={index} />)
          ) : searchResults.length > 0 ? (
            searchResults.map((service) => (
              <SearchResult
                key={service.service_name}
                service={service}
                onSelect={handleSelect}
              />
            ))
          ) : (
            <Card className="p-4">
              <p className="text-center text-gray-500">No results found</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
