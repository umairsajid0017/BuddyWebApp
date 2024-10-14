'use client'

import React from 'react'
import { useServices } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { StarIcon } from 'lucide-react'
import type { Service } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import Link from 'next/link'

const ServiceSkeleton: React.FC = () => (
  <Card className="p-4">
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-4 w-3/4 mt-2" />
    <Skeleton className="h-3 w-full mt-2" />
    <div className="flex items-center justify-between mt-2">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-4 w-24" />
    </div>
  </Card>
)

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
    <Link href={`/services/${service.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="h-44 bg-gray-200 relative overflow-hidden">
          <Image
            src={`/placeholder.svg?height=176&width=264`}
            alt={service.name}
            layout="fill"
            objectFit="cover"
          />
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
    </Link>
  )

const AllServices: React.FC = () => {
  const { data: servicesResponse, isLoading, error } = useServices()
    const services = servicesResponse?.data ?? []
    
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">All Services</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array<number>(12)].map((_, index) => (
            <ServiceSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading services: {error.message}</div>
  }

  if (!services) {
    return <div className="text-center">No services available.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Services</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {services.length > 0 &&  services.map((service: Service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
}

export default AllServices;