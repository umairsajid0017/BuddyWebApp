import React, { useEffect } from 'react';
import { useServices, useDeleteService } from '@/lib/api';
import useServicesStore from '@/store/servicesStore';

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

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   // Check if storeServices is an array
//   if (!Array.isArray(storeServices)) {
//     console.error('storeServices is not an array:', storeServices);
//     return <div>Error: Services data is not in the expected format.</div>;
//   }

  return (
    <div>
      <h1>Services</h1>
      {storeServices.length === 0 ? (
        <p>No services available.</p>
      ) : (
        <ul>
          {storeServices.map((service) => (
            <li key={service.id}>
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <p>Price: {service.price}</p>
              {/* <button onClick={() => handleDelete(service.id)}>Delete</button> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServicesComponent;