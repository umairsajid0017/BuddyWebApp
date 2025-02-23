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
import { Search } from "lucide-react";
import { SearchComponent } from "../services/search-services/search-component";

type ImageItem = {
  src: string;
  alt: string;
};

const images: ImageItem[] = [
  { src: "/assets/promo-2.png", alt: "Image 1" },
  { src: "/assets/cleaning.png", alt: "Image 2" },
  { src: "/assets/laundry.png", alt: "Image 3" },
  { src: "/assets/garage.png", alt: "Image 4" },
];

export function DashboardComponent() {
  const { data: servicesResponse, isLoading, error } = useServices();
  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
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

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="flex min-h-screen flex-col md:mx-8 lg:px-24">
      <main className="flex-1 p-6">
        <section className="mt-6 flex flex-col gap-4 lg:flex-row">
          <div
            className="flex h-96 flex-col items-center justify-center rounded-lg bg-card p-6 shadow lg:w-[40%]"
            style={{
              backgroundImage: "url('/assets/search-bg.png')",
              backgroundSize: "contain",
              backgroundPosition: "center",
              // backgroundColor: "rgba(0,0,0,0.1)", // Add dark overlay
              // backgroundBlendMode: "multiply", // Blend the overlay with image
            }}
          >
            {/* <div className="flex w-full max-w-lg items-center justify-center gap-2">
              <Input
                type="text"
                placeholder="Search for any service..."
                className="h-12 rounded-lg border-input bg-background px-4 text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button
                className="h-12 rounded-lg bg-primary hover:bg-primary-600"
                effect="shine"
              >
                <Search className="h-4 w-4" />
              </Button>

            </div> */}
            <SearchComponent />
          </div>

          <div className="relative h-96 overflow-hidden rounded-lg lg:w-[60%]">
            <CardStack
              items={images}
              renderItem={(item) => (
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover"
                />
              )}
              interval={2000}
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
