"use client";

import { useCategories } from "@/apis/apiCalls";
import CategoryComponent from "./category-component";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Category } from "@/types/category-types";

const CategorySkeleton = () => (
  <Card className="p-4">
    <div className="flex flex-col items-center space-y-2">
      <Skeleton className="h-16 w-16 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  </Card>
);

const NoCategories = () => (
  <div className="flex flex-col items-center justify-center px-4 py-12">
    <Image
      src="/assets/no-results-found.svg"
      alt="No categories found"
      width={300}
      height={300}
      className="mb-8"
    />
    <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
      No categories available
    </h2>
    <p className="mb-8 text-center text-gray-600">
      We couldn&apos;t find any categories. Please try again later.
    </p>
    <Button asChild>
      <Link href="/">Back to Home</Link>
    </Button>
  </div>
);

const AllCategoriesComponent = () => {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <CategorySkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-center text-red-500">
        <div>
          <h2 className="text-xl font-semibold">Error loading categories</h2>
          <p className="mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">All Categories</h1>
        <p className="text-muted-foreground">
          Browse through our collection of service categories
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryComponent key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default AllCategoriesComponent;
