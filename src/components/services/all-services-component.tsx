"use client";

import React from "react";
import { useServices } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import type { Service } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import ServiceCard from "./services-card";

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

// const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
//   <Link href={`/services/${service.id}`} className="block">
//     <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
//       <div className="relative h-44 overflow-hidden bg-gray-200">
//         <Image
//           src={process.env.NEXT_PUBLIC_IMAGE_URL + service.image}
//           alt={service.name}
//           layout="fill"
//           objectFit="cover"
//         />
//       </div>
//       <CardContent>
//         <h4 className="mt-2 text-xl font-medium">{service.name}</h4>
//         <p className="text-xs text-gray-600">{service.description}</p>
//         <div className="mt-2 flex items-center justify-between">
//           <p className="text-lg font-bold text-primary">Rs. {service.price}</p>
//           <div className="flex items-center text-xs text-gray-600">
//             <StarIcon className="h-4 w-4" />
//             <span className="ml-1">4.9 | 6182 reviews</span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   </Link>
// );

const AllServices: React.FC = () => {
  const { data: servicesResponse, isLoading, error } = useServices();
  const services = servicesResponse?.data ?? [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">All Services</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array<number>(12)].map((_, index) => (
            <ServiceSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading services: {error.message}
      </div>
    );
  }

  if (!services) {
    return <div className="text-center">No services available.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">All Services</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {services.length > 0 &&
          services.map((service: Service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
      </div>
    </div>
  );
};

export default AllServices;
