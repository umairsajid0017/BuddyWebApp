import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect } from "react";
import PopularServices from "../services/popular-services-component";
import useServicesStore from "@/store/servicesStore";
import DashboardSkeleton from "./dashboard-skeleton";
import { useServices } from "@/lib/api";
import TooltipWrapper from "../ui/tooltip-wrapper";
import DashboardStats from "./dashboard-stats";
import kebabCase from "@/utils/helper-functions";
import CardStack from "../ui/card-stack";
import { useRouter } from "next/navigation";
import PopularServicesSection from "../services/popular-services-section";
import { SearchComponent } from "../services/search-services/search-component";
import { useCategories } from "@/lib/apis/get-categories";
import useCategoriesStore from "@/store/categoriesStore";
import { Cat } from "lucide-react";
import CategoryComponent from "../services/category-component";

type ImageItem = {
  src: string;
  alt: string;
};
const images: ImageItem[] = [
  { src: "/assets/promo-2.png", alt: "Image 1" },
  { src: "/assets/cleaning.png", alt: "Image 2" },
  { src: "/assets/laundry.png", alt: "Image 3" },
  { src: "/assets/garage.png", alt: "Image 4" },
  // { src: "/assets/promo-2.png", alt: "Image 5" },
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
      setServices(servicesResponse.data);
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
      setCategories(categoriesResponse.data);
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
        <DashboardStats />
        <section className="mt-6 flex flex-col gap-4 lg:flex-row">
          <div className="relative flex flex-1 flex-col justify-center rounded-lg p-8 shadow">
            <Image
              src={"/assets/search-bg.svg"}
              alt="Search"
              width={"300"}
              height={"300"}
              className="absolute left-0 top-0 -z-10 h-full w-full rounded-lg object-cover"
            />
            <div className="absolute left-0 top-0 -z-20 h-full w-full rounded-lg bg-[#F3EEF5]" />
            <div className="text-center">
              <h3 className="text-2xl font-semibold">
                Start booking service to <br className="hidden sm:inline" /> get
                your work done!
              </h3>
            </div>
            <div className="mt-4 flex w-full items-center justify-center">
              <SearchComponent />
            </div>
          </div>
          <div className="flex h-48 flex-col justify-center rounded-lg bg-red-100 p-0 shadow md:h-64 lg:w-1/3">
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
            <Button variant="link" className="text-sm">
              See All
            </Button>
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
