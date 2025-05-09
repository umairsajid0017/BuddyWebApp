"use client";
import { useState, useEffect } from "react";
import { BookmarkIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Service } from "@/types/service-types";
import { CURRENCY } from "@/constants/constantValues";
import { getImageUrl } from "@/helpers/utils";
import { Button } from "../ui/button";
import { useAddBookmark, useShowBookmarks } from "@/apis/apiCalls";
import { colors } from "@/constants/colors";

const ServiceCard: React.FC<{ service: Service, bookmarked?: boolean }> = ({ service, bookmarked: initialBookmarked }) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const imageUrl = service.images?.[0]?.name
    ? getImageUrl(service.images[0].name)
    : getImageUrl(service.image);

  const bookmarkMutation = useAddBookmark();
  const showBookmarks = useShowBookmarks();

  const handleBookmark = (e: React.MouseEvent<HTMLButtonElement>, serviceId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Update UI optimistically
    setIsBookmarked(!isBookmarked);
    
    // Update in the backend
    bookmarkMutation.mutateAsync({ 
      service_id: serviceId, 
      status: isBookmarked ? 0 : 1 
    }).then(() => {
      showBookmarks.refetch();
    }).catch(() => {
      // Revert UI if mutation fails
      setIsBookmarked(isBookmarked);
    });
  };

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
              <Button variant="ghost" size="icon" onClick={(e) => handleBookmark(e, service.id)}>
              <BookmarkIcon className="h-4 w-4" fill={isBookmarked ? colors.primary.DEFAULT : "none"} stroke={isBookmarked ? colors.primary.DEFAULT : colors.text.DEFAULT} />
              </Button>
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
