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

type ImageItem = {
  src: string;
  alt: string;
  title: string;
  description: string;
  discount: string;
};

export default function DashboardComponent() {
  const router = useRouter();
  const { services, isLoading: servicesLoading } = useServices();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { data: specialOffers, isLoading: offersLoading, isPending: offersPending } = useSpecialOffers();

  if (servicesLoading || categoriesLoading || offersLoading) {
    return <DashboardSkeleton />;
  }
  if(!offersPending) {
    console.log(specialOffers);
  }

  const specialOfferItems: ImageItem[] = specialOffers?.map((offer) => ({
    src: getImageUrl(offer.image),
    alt: offer.title,
    title: offer.title,
    description: offer.description,
    discount: offer.discount_percentage,
  })) || [];

  console.log(specialOfferItems);

  

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <DashboardStats /> */}
      <div className="h-[400px] mb-10">
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
      <PopularServicesSection services={services} />
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">All Categories</h3>
          <Button variant="link" className="text-sm" onClick={() => router.push('/categories')}>
            See All
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
          {categories.slice(0, 8).map((category) => (
            <CategoryComponent key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
