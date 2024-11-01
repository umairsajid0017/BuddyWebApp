"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import kebabCase from "@/utils/helper-functions";
import { Category } from "@/lib/types/category-types";

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
      key={category.id}
      className="cursor-pointer bg-primary-100 p-4 font-medium transition-all duration-300 hover:border-primary-400"
      onClick={handleCategoryClick}
    >
      <CardContent className="flex flex-col items-center justify-center gap-2 p-2">
        <Image
          src={`/assets/icons/${kebabCase(category.title)}.svg`}
          alt={category.title}
          width={60}
          height={60}
        />
        <h4 className="mt-2 text-base font-semibold">{category.title}</h4>
      </CardContent>
    </Card>
  );
};

export default CategoryComponent;
