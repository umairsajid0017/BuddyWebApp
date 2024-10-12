import React, { useEffect, useState } from 'react';
import { useServices, useDeleteService } from '@/lib/api';
import useServicesStore from '@/store/servicesStore';
import { Card, CardContent } from '../ui/card';
import { StarIcon } from 'lucide-react';
import { Service } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';


interface PopularServicesProps {
  services: Service[];
}

const PEXELS_API_KEY = 'p4VqT6asTRkRiLQZEaWabx14UQmR0P6Owm1RLS4GpN9iQU6ObazuNl1l'; // Replace with your actual Pexels API key

const ServiceSkeleton = () => (
  <Card className="p-4">
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-4 w-3/4 mt-2" />
    <Skeleton className="h-3 w-full mt-2" />
    <div className="flex items-center justify-between mt-2">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-4 w-24" />
    </div>
  </Card>
);

const PopularServices: React.FC<PopularServicesProps> = ({services}) => {
  const { isLoading, error } = useServices();
 
  const [images, setImages] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (services) {
      fetchImages(services);
    }
    
  }, [isLoading, services]);

  interface PexelsPhoto {
    src: {
      medium: string;
    };
  }
  
  interface PexelsResponse {
    photos?: PexelsPhoto[];  // Mark photos as optional
  }
  
  interface ImageResult {
    id: number;
    url: string;
  }
  
  const fetchImages = async (services: Service[]) => {
    const imagePromises = services.map(service =>
      fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(service.name)}&per_page=1`, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch image");
          }
          return response.json() as Promise<PexelsResponse>;
        })
        .then(data => {
          // Add null/undefined check for `data` and `data.photos`
          if (data?.photos && data.photos.length > 0) {
            return { id: service.id, url: data!.photos[0]!.src.medium } as ImageResult;
          }
          return null;
        })
        .catch(error => {
          console.error('Error fetching image:', error);
          return null;
        })
    );
  
    const imageResults = await Promise.all(imagePromises);
  
    // Use a more specific type for imageResults
    const newImages = imageResults.reduce((acc: { [key: number]: string }, result) => {
      if (result) {
        acc[result.id] = result.url;
      }
      return acc;
    }, {});
  
    setImages(newImages);
  };
  


  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {[...Array<number>(8)].map((_: any, index) => (
          <ServiceSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {services.map((service: Service) => (
        <Card key={service.id} className="">
          <div className="h-44 bg-gray-200 rounded-lg relative overflow-hidden">
            {images[service.id] && (
              <Image
                src={images[service.id]!}
                alt={service.name}
                layout="fill"
                objectFit="cover"
              />
            )}
          </div>
          <CardContent>

          <h4 className="mt-2 text-xl font-medium">{service.name}</h4>
          <p className="text-xs text-gray-600">{service.description}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-lg text-primary font-bold">Rs. {service.price}</p>
            <div className="flex items-center text-xs text-gray-600">
              <StarIcon className="w-4 h-4" />
              <span className="ml-1">4.9 | 6182 reviews</span>
            </div>
          </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PopularServices;