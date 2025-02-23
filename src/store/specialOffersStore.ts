import { create } from "zustand";
import { SpecialOffer } from "@/lib/apis/get-special-offers";

interface SpecialOffersState {
  specialOffers: SpecialOffer[];
  loading: boolean;
  error: string | null;
  setSpecialOffers: (specialOffers: SpecialOffer[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const useSpecialOffersStore = create<SpecialOffersState>((set) => ({
  specialOffers: [],
  loading: false,
  error: null,
  setSpecialOffers: (specialOffers) => set({ specialOffers }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default useSpecialOffersStore;
