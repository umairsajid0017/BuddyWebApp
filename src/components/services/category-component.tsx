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
      className="cursor-pointer bg-primary-100 transition-all duration-300 hover:border-primary-400"
      onClick={handleCategoryClick}
    >
      <CardContent className="flex h-32 flex-col items-center justify-between p-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full p-3 shadow-sm">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${category.image}`}
            alt={category.title}
            width={60}
            height={60}
            className="object-contain"
          />
        </div>
        <h4 className="mt-2 line-clamp-2 text-center text-sm font-semibold text-gray-800">
          {category.title}
        </h4>
      </CardContent>
    </Card>
  );
};

export default CategoryComponent;
