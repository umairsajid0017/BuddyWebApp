"use client";

import { Button } from "@/components/ui/button";
import DashboardSkeleton from "./dashboard-skeleton";
import { useServices, useCategories, useSpecialOffers } from "@/apis/apiCalls";
import DashboardStats from "./dashboard-stats";
import CardStack from "../ui/card-stack";
import { useRouter } from "next/navigation";
import PopularServicesSection from "../services/popular-services-section";
import CategoryComponent from "../services/category-component";
import { getImageUrl } from "@/helpers/utils";
import { useEffect } from "react";
import { SearchComponent } from "../services/search-services/search-component";
import { CheckCircle, Shield } from "lucide-react";
import Link from "next/link";

type ImageItem = {
  src: string;
  alt: string;
  title: string;
  description: string;
  discount: string;
};

export default function DashboardComponent() {
  const { services, isLoading: servicesLoading } = useServices();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const {
    data: specialOffers,
    isLoading: offersLoading,
    isPending: offersPending,
  } = useSpecialOffers();

  if (servicesLoading || categoriesLoading || offersLoading) {
    return <DashboardSkeleton />;
  }
  if (!offersPending) {
    console.log(specialOffers);
  }

  const specialOfferItems: ImageItem[] =
    specialOffers?.map((offer) => ({
      src: getImageUrl(offer.image),
      alt: offer.title,
      title: offer.title,
      description: offer.description,
      discount: offer.discount_percentage,
    })) || [];

  console.log(specialOfferItems);

  return (
    <div className="container mx-auto md:px-4 py-8">
      {/* <DashboardStats /> */}
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
              <h2 className="text-3xl font-bold text-text-900">
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
