"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import PopularServices from "../services/popular-services-component";
import useServicesStore from "@/store/servicesStore";
import DashboardSkeleton from "./dashboard-skeleton";
import { useServices } from "@/lib/api";
import DashboardStats from "./dashboard-stats";
import CardStack from "../ui/card-stack";
import { useRouter } from "next/navigation";
import PopularServicesSection from "../services/popular-services-section";
import { useCategories } from "@/lib/apis/get-categories";
import useCategoriesStore from "@/store/categoriesStore";
import CategoryComponent from "../services/category-component";
import Link from "next/link";
import { Input } from "../ui/input";
import { CheckCircle, Search, Shield } from "lucide-react";
import { SearchComponent } from "../services/search-services/search-component";
import { useSpecialOffers } from "@/lib/apis/get-special-offers";
import useSpecialOffersStore from "@/store/specialOffersStore";

type ImageItem = {
  src: string;
  alt: string;
};

export function DashboardComponent() {
  const { data: servicesResponse, isLoading, error } = useServices();
  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const {
    data: specialOffersResponse,
    isLoading: specialOffersLoading,
    error: specialOffersError,
  } = useSpecialOffers();
  const router = useRouter();
  const { services, setServices, setLoading, setError, deleteService } =
    useServicesStore();

  const {
    categories,
    setCategories,
    setLoading: setCategoriesLoading,
    setError: setCategoriesError,
    deleteCategory,
  } = useCategoriesStore();

  const {
    specialOffers,
    setSpecialOffers,
    setLoading: setSpecialOffersLoading,
    setError: setSpecialOffersError,
  } = useSpecialOffersStore();

  useEffect(() => {
    if (servicesResponse) {
      console.log("Services response in dashboard", servicesResponse);
      setServices(servicesResponse);
    }
    setLoading(isLoading);
    setError(error ? error.message : null);
  }, [
    services,
    isLoading,
    error,
    setServices,
    setLoading,
    setError,
    servicesResponse,
  ]);

  useEffect(() => {
    if (categoriesResponse) {
      setCategories(categoriesResponse);
      console.log("Categories responsee in dashboard", categoriesResponse);
    }
    setLoading(categoriesLoading);
    setError(categoriesError ? categoriesError.message : null);
  }, [
    categoriesResponse,
    categoriesLoading,
    categoriesError,
    setCategories,
    setLoading,
    setError,
  ]);

  useEffect(() => {
    if (specialOffersResponse) {
      setSpecialOffers(specialOffersResponse);
    }
    setSpecialOffersLoading(specialOffersLoading);
    setSpecialOffersError(
      specialOffersError ? (specialOffersError as any).message : null,
    );
  }, [
    specialOffersResponse,
    specialOffersLoading,
    specialOffersError,
    setSpecialOffers,
    setSpecialOffersLoading,
    setSpecialOffersError,
  ]);

  if (isLoading || categoriesLoading || specialOffersLoading)
    return <DashboardSkeleton />;

  const specialOfferItems = specialOffers.map((offer) => ({
    src: process.env.NEXT_PUBLIC_IMAGE_URL! + offer.image,
    alt: offer.title,
    title: offer.title,
    description: offer.description,
    discount: offer.discount_percentage,
  }));

  return (
    <div className="flex min-h-screen flex-col md:mx-8 lg:px-24">
      <main className="flex-1 p-6">
        <section className="mt-6 flex flex-col gap-4 lg:flex-row">
          <div
            className="flex h-96 flex-col items-center justify-center gap-6 rounded-lg bg-card p-8 shadow lg:w-[40%]"
            style={{
              backgroundImage: "url('/assets/search-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              backgroundBlendMode: "overlay",
            }}
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-primary">
                Find Your Perfect Service
              </h2>
              <p className="mt-2 text-lg text-text-700">
                Search from thousands of trusted service providers
              </p>
            </div>
            <SearchComponent className="w-full max-w-2xl" />
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm text-text-700">
                  Verified Providers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm text-text-700">Secure Booking</span>
              </div>
            </div>
          </div>

          <div className="relative h-96 overflow-hidden rounded-lg lg:w-[60%]">
            <CardStack
              items={specialOfferItems}
              renderItem={(item) => (
                <div className="relative h-full w-full">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent">
                    <div className="space-y-2 p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-bold text-text-100">
                          {item.title}
                        </h3>
                        {item.discount !== "0.00" && (
                          <span className="rounded-full bg-primary px-4 py-1 text-lg font-bold text-text-100">
                            {item.discount}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-base leading-relaxed text-text-100">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              interval={3000}
            />
          </div>
        </section>
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">All Categories</h3>
            <Link href="/categories">
              <Button variant="link" className="text-sm">
                See All
              </Button>
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
            {categories.slice(0, 8).map((category) => (
              <CategoryComponent key={category.id} category={category} />
            ))}
          </div>
        </section>
        <PopularServicesSection services={services} />
      </main>
    </div>
  );
}
