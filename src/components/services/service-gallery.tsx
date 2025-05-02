"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button } from "../ui/button";
import { cn, getImageUrl } from "@/helpers/utils";
import { ImageType } from "@/types/general-types";
import Image from "next/image";

interface ServiceGalleryProps {
  mainImage: string;
  images: ImageType[];
  serviceName: string;
}

export const ServiceGallery: React.FC<ServiceGalleryProps> = ({
  mainImage,
  images,
  serviceName,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const allImages = [
    { id: "main", name: mainImage },
    ...images.map((img) => ({ id: img.id, name: img.name })),
  ] as const;

  if (!mainImage) {
    return null;
  }


  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1,
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  return (
    <div className="relative">
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={getImageUrl(allImages[0].name)}
            alt={`${serviceName} main`}
            layout="fill"
            objectFit="cover"
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleThumbnailClick(0)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {allImages.slice(1, 5).map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square w-full overflow-hidden rounded-lg"
            >
              <Image
                src={getImageUrl(image.name)}
                alt={`${serviceName} ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleThumbnailClick(index + 1)}
              />
              {index === 3 && allImages.length > 5 && (
                <div
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 text-white"
                  onClick={() => handleThumbnailClick(4)}
                >
                  <span className="text-lg font-semibold">
                    +{allImages.length - 5}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="relative mx-auto max-w-7xl px-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 text-white"
              onClick={() => setShowLightbox(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            {allImages[currentImageIndex] && (
              <div className="relative aspect-square max-h-[80vh] w-full">
                <Image
                  src={getImageUrl(allImages[currentImageIndex].name)}
                  alt={`${serviceName} ${currentImageIndex}`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
            {/* Thumbnails */}
            <div className="mt-4 flex justify-center gap-2 overflow-x-auto">
              {allImages.map((image, index) => (
                <div
                  key={image.id}
                  className={cn(
                    "relative h-16 w-16 cursor-pointer overflow-hidden rounded-lg border-2",
                    currentImageIndex === index
                      ? "border-primary"
                      : "border-transparent",
                  )}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={getImageUrl(image.name)}
                    alt={`${serviceName} thumbnail ${index}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
