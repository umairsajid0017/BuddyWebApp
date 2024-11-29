import { create } from "zustand";

export interface Filters {
  serviceOptions: string;
  sellerDetails: string;
  budget: string;
  deliveryTime: string;
  sortBy: string;
}

interface FiltersState {
  filters: Filters;
  setFilter: (key: keyof Filters, value: string) => void;
  resetFilters: () => void;
}

const initialFilters: Filters = {
  serviceOptions: "",
  sellerDetails: "",
  budget: "",
  deliveryTime: "",
  sortBy: "best_selling",
};

const useFiltersStore = create<FiltersState>((set) => ({
  filters: initialFilters,
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () => set({ filters: initialFilters }),
}));

export default useFiltersStore;
