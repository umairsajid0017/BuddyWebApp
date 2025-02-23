import { Service } from "@/lib/types";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { CURRENCY } from "@/utils/constants";

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  console.log(service);

  const imageUrl = service.images?.[0]?.name
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${service.images[0].name}`
    : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${service.image}`;
  console.log("Image URL", imageUrl);
  return (
    <Link href={`/services/${service.id}`} className="block">
      <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        <div className="relative h-44 overflow-hidden bg-gray-200">
          <Image
            src={imageUrl}
            alt={service.name}
            layout="fill"
            objectFit="cover"
            unoptimized
          />
        </div>
        <CardContent>
          <h4 className="mt-2 text-lg font-medium">{service.name}</h4>
          <p className="text-xs text-gray-600">
            {service.description.slice(0, 50) + "..."}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-lg font-bold text-primary">
              {CURRENCY}. {service.fixed_price}
            </p>
            <div className="flex items-center text-xs text-gray-600">
              <StarIcon className="h-4 w-4" />
              {/* <span className="ml-1">
              {service.ratings?.length > 0
                ? (
                    service.ratings.reduce(
                      (acc, curr) => acc + curr.rating,
                      0,
                    ) / service.ratings?.length
                  ).toFixed(1)
                : "0.0"}
              | {service.ratings?.length} reviews
            </span> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ServiceCard;
