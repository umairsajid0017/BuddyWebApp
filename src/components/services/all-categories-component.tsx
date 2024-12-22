"use client";

import { useCategories } from "@/lib/apis/get-categories";
import CategoryComponent from "./category-component";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  const { data: categoriesResponse, isLoading, error } = useCategories();
  const categories = categoriesResponse?.record ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {[...Array(12)].map((_, index) => (
          <CategorySkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading categories: {error.message}
      </div>
    );
  }

  if (!categories.length) {
    return <NoCategories />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
      {categories.map((category) => (
        <CategoryComponent key={category.id} category={category} />
      ))}
    </div>
  );
};

export default AllCategoriesComponent;
