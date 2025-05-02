"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn, getImageUrl } from "@/helpers/utils";
import { ImageType } from "@/types/general-types";

interface ServiceImageGalleryProps {
  mainImage: string;
  images: ImageType[];
  serviceName: string;
}

export const ServiceImageGallery: React.FC<ServiceImageGalleryProps> = ({
  mainImage,
  images,
  serviceName,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(mainImage);

  console.log("Service Image Gallery", typeof images);
  // Filter out any duplicate images and ensure valid image objects
  const validImages = images.filter((img) => img && img.name && img.id);
  const allImages = [{ id: "main", name: mainImage }, ...validImages];

  console.log("All Images", allImages);


  return (
    <div className="w-full">
      {/* Main Image Container */}
      <div className="mb-4 h-[400px] w-full">
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          <Image
            src={getImageUrl(selectedImage)}
            alt={serviceName}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      </div>

      {/* Thumbnails Container - only show if we have more than one image */}
      {allImages.length > 1 && (
        <div className="grid auto-cols-max grid-flow-col gap-2 overflow-x-auto">
          {allImages.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image.name)}
              className={cn(
                "relative h-16 w-16 overflow-hidden rounded-md border-2 transition-all",
                selectedImage === image.name
                  ? "border-primary"
                  : "border-transparent hover:border-gray-300",
              )}
            >
              <Image
                src={getImageUrl(image.name)}
                alt={`${serviceName} thumbnail`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
