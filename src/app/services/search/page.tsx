'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useServices } from '@/lib/api'
import { type Service } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { StarIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'



//TODO: This service card component is used in multiple places. It should be moved to a shared component.
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

//TODO: This service skeleton component is used in multiple places. It should be moved to a shared component.
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

const NoResultsFound: React.FC<{ query: string }> = ({ query }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <Image
      src="/assets/no-results-found.svg"
      alt="No results found"
      width={300}
      height={300}
      className="mb-8"
    />
    <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
      No results found for &quot;{query}&quot;
    </h2>
    <p className="text-gray-600 text-center mb-8">
      We couldn&apos;t find any services matching your search. Try adjusting your search terms or browse our categories.
    </p>
    <Button asChild>
      <Link href="/">
        Browse All Services
      </Link>
    </Button>
  </div>
)

const SearchResults: React.FC = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const { data: servicesResponse, isLoading, error } = useServices()
  const services = servicesResponse?.data ?? []

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(query.toLowerCase()) ||
    service.description.toLowerCase().includes(query.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Search Results for &quot;{query}&quot;</h1>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for &quot;{query}&quot;</h1>
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredServices.map((service: Service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <NoResultsFound query={query} />
      )}
    </div>
  )
}

export default SearchResults