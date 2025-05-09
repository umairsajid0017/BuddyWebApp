"use client";

import { Category } from "@/types/category-types";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import kebabCase, { getImageUrl } from "@/helpers/utils";

interface CategoryComponentProps {
  category: Category;
}

const CategoryComponent: React.FC<CategoryComponentProps> = ({ category }) => {
  const router = useRouter();

    const handleCategoryClick = () => {
      router.push(`/categories/${kebabCase(category.title)}?id=${category.id}`);
    };
  return (
    <Card
      className="cursor-pointer transition-all hover:scale-105"
      onClick={handleCategoryClick}
    >
      <CardContent className="flex flex-col items-center p-4">
        <img
          src={getImageUrl(category.image)}
          alt={category.title}
          className="h-16 w-16 rounded-full object-cover"
        />
        <h3 className="mt-2 text-center text-sm font-medium">{category.title}</h3>
      </CardContent>
    </Card>
  );
};

export default CategoryComponent;
