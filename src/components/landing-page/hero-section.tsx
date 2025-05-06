import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { IMAGE_PATHS } from "@/constants/imagePaths";
import { useCategories } from "@/apis/apiCalls";
import { Category } from "@/types/category-types";
import { useState } from "react";

export function HeroSection() {
    const { categories, isLoading: categoriesLoading } = useCategories();
    const [category, setCategory] = useState<Category | null>(null);
    const [search, setSearch] = useState<string>("");
    const handleCategoryClick = (category: Category) => {
        setCategory(category);
        setSearch(category.title);
    }

  return (
    <section
      className="relative my-6 flex min-h-[438px] items-center justify-between rounded-lg py-20 text-white"
      style={{
        backgroundImage: `url(${IMAGE_PATHS.LANDING_PAGE.MAIN_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container relative z-10 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          <h1 className="mb-6 text-center text-3xl font-medium sm:text-4xl md:text-5xl lg:text-6xl">
            Find the right service, <br className="hidden sm:block" /> right
            away
          </h1>
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <Input
              type="text"
              placeholder="Search for any service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 rounded-lg border-0 px-4 text-text-900 focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-14 sm:rounded-r-none"
            />
            <Button className="h-12 rounded-lg bg-primary hover:bg-primary-600 sm:h-14 sm:rounded-l-none">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span>Quick Find:</span>
          {categories.map((category) => (
            <Button
              size="sm"
              key={category.id}
              variant="outline"
              className="border-white bg-transparent font-semibold text-white hover:bg-white hover:text-primary"
              onClick={() => handleCategoryClick(category)}
            >
              {category.title}
            </Button>
          ))}
        </div>
      </div>
      {/* Add overlay */}
      <div className="absolute inset-0 rounded-lg bg-black/40" />
    </section>
  );
}
