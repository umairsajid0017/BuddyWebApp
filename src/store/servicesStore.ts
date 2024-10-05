import { Service } from '@/lib/types';
import { create } from 'zustand';

interface ServicesState {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  setServices: (services: Service[]) => void;
  addService: (service: Service) => void;
  updateService: (updatedService: Service) => void;
  deleteService: (id: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useServicesStore = create<ServicesState>((set) => ({
  services: [],
  isLoading: false,
  error: null,
  setServices: (services) => set((state) => {
    console.log('Setting services in store:', services);
    return { services };
  }),
  addService: (service) => set((state) => ({ services: [...state.services, service] })),
  updateService: (updatedService) =>
    set((state) => ({
      services: state.services.map((service) =>
        service.id === updatedService.id ? updatedService : service
      ),
    })),
  deleteService: (id) =>
    set((state) => ({
      services: state.services.filter((service) => service.id !== id),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default useServicesStore;