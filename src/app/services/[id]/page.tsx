'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Star } from 'lucide-react'
import { useService, useServices } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PopularServices from '@/components/services/popular-services-component'
import useServicesStore from '@/store/servicesStore'
import Main from '@/components/ui/main'
import PopularServicesSection from '@/components/services/popular-services-section'

interface ServiceDetailsProps {
  params: {
    id: string
  }
}

const ServiceDetailsSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <Skeleton className="w-full aspect-square rounded-lg" />
      </div>
      <div className="md:w-1/2">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-4 w-1/3 mb-4" />
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-10 w-1/3" />
      </div>
    </div>
  </div>
)

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ params }) => {
  const { services, setServices } = useServicesStore();
  const { data: service, isLoading, error } = useService(+params.id)
  const { data: servicesResponse, isLoading: allServicesLoading, error: allServicesError } = useServices();

  
  useEffect(() => {
    if (servicesResponse) {
      setServices(servicesResponse.data)
    }
  }, [servicesResponse, allServicesLoading])

  if (isLoading) {
    return <ServiceDetailsSkeleton />
  }

  if (error || !service) {
    notFound()
  }

  return (
      <Main>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt={service.name}
                width={400}
                height={400}
                className="rounded-lg w-full"
              />
            </div>
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
              <div className="flex items-center mb-4">
                <span className="text-lg font-semibold mr-2">{"Joh Doe"}</span>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1">{Array.isArray(service.ratings) ? service.ratings.join(', ') : service.ratings}</span>
                  {/* <span className="ml-2 text-muted-foreground">({service.} reviews)</span> */}
                </div>
              </div>
              <div className="mb-4">
                <span className="inline-block bg-secondary rounded-full px-3 py-1 text-sm font-semibold text-secondary-foreground mr-2">
                  {service.category_id} 
                </span>
                {/* <span className="text-muted-foreground">{service.location}</span> */}
              </div>
              <p className="text-2xl font-bold mb-4">
                ${service.price} <span className="text-sm font-normal text-muted-foreground">(Floor price)</span>
              </p>
              <h2 className="text-xl font-semibold mb-2">About me</h2>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <Button size="lg" onClick={() => console.log(`Booking service: ${service.id}`)}>
                Book Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <PopularServicesSection services={services} />
      </Main>

  )
}

export default ServiceDetails