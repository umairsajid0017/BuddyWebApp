import React, { useEffect } from 'react';
import { useServices, useDeleteService } from '@/lib/api';
import useServicesStore from '@/store/servicesStore';
import SplashScreen from '../ui/splash-screen';
import { Card } from '../ui/card';
import { StarIcon } from 'lucide-react';
import { Service } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';


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
  )

const ServicesComponent: React.FC = () => {
  const { data: services, isLoading, error } = useServices();
  const deleteServiceMutation = useDeleteService();
  const { 
    services: storeServices, 
    setServices, 
    setLoading, 
    setError,
    deleteService 
  } = useServicesStore();

  
  useEffect(() => {
    console.log('Effect running');
    console.log('API services:', services);
    console.log('Is loading:', isLoading);
    console.log('Error:', error);
    
    if (services) {
      console.log('Services data available:', services.data);
      setServices(services.data);
      
      console.log('Services set in store', storeServices);
    } else {
      console.log('Services data not available');
    }
    
    console.log('Store services after potential update:', storeServices);
    
    setLoading(isLoading);
    setError(error ? error.message : null);
  }, [services, isLoading, error, setServices, setLoading, setError]);

  const handleDelete = (id: number) => {
    deleteServiceMutation.mutate(id, {
      onSuccess: () => {
        deleteService(id);
      },
      onError: (error) => {
        console.error('Failed to delete service:', error);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {[...Array(8)].map((_, index) => (
          <ServiceSkeleton key={index} />
        ))}
      </div>
    )
  }
//   if (error) return <div>Error: {error.message}</div>;

//   // Check if storeServices is an array
//   if (!Array.isArray(storeServices)) {
//     console.error('storeServices is not an array:', storeServices);
//     return <div>Error: Services data is not in the expected format.</div>;
//   }

  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
            {storeServices.map((service: Service) => (
              <Card key={service.id} className="p-4">
                <div className="h-32 bg-gray-200 rounded-lg" />
                <h4 className="mt-2 text-sm font-medium">{service.name}</h4>
                <p className="text-xs text-gray-600">{service.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-lg font-bold">Rs. {service.price}</p>
                  <div className="flex items-center text-xs text-gray-600">
                    <StarIcon className="w-4 h-4" />
                    <span className="ml-1">4.9 | 6182 reviews</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
  );
};

export default ServicesComponent;