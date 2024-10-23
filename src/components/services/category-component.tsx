import TooltipWrapper from "../ui/tooltip-wrapper";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import kebabCase from "@/utils/helper-functions";
import { Category } from "@/lib/types/services-types";

interface CategoryComponentProps {
  category: Category;
}
const CategoryComponent: React.FC<CategoryComponentProps> = ({ category }) => {
  return (
    //   <TooltipWrapper key={category.id} content={category.}>

    <Card
      key={category.id}
      className="cursor-pointer bg-primary-100 p-4 font-medium transition-all duration-300 hover:border-primary-400"
    >
      <CardContent className="flex flex-col items-center justify-center gap-2 p-2">
        <Image
          src={"/assets/icons/" + kebabCase(category.title) + ".svg"}
          alt={category.title}
          width={60}
          height={60}
        />

        <h4 className="mt-2 text-base font-semibold">{category.title}</h4>
      </CardContent>
    </Card>
    //     </TooltipWrapper>
  );
};

export default CategoryComponent;
