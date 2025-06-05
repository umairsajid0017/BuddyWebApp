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
import TooltipWrapper from "../ui/tooltip-wrapper";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { StarDisplay } from "../ui/star-rating";

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const showBookmarks = useShowBookmarks();
  const bookmarkMutation = useAddBookmark();

  useEffect(() => {
    if (showBookmarks.data?.records) {
      const isServiceBookmarked = showBookmarks.data.records.some(
        bookmark => bookmark.status === 1 && parseInt(bookmark.service_id) === service.id
      );
      setIsBookmarked(isServiceBookmarked);
    }
  }, [showBookmarks.data, service.id]);

  const imageUrl = service.images?.[0]?.name
    ? getImageUrl(service.images[0].name)
    : getImageUrl(service.image);

  const handleBookmark = (e: React.MouseEvent<HTMLButtonElement>, serviceId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsBookmarked(!isBookmarked);
    
    bookmarkMutation.mutateAsync({ 
      service_id: serviceId, 
      status: isBookmarked ? 0 : 1 
    }).then(() => {
      showBookmarks.refetch();
    }).catch(() => {
      setIsBookmarked(isBookmarked);
    });
  };

  // Calculate average rating
  const averageRating = service.ratings && service.ratings.length > 0
    ? service.ratings.reduce((acc, rating) => acc + rating.rating, 0) / service.ratings.length
    : 0;

  const reviewCount = service.ratings ? service.ratings.length : 0;

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
          
          {service.category && (
            <div className="absolute top-3 left-3">
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm">
                {service.category.title}
              </Badge>
            </div>
          )}
          
          {/* Rating Badge */}
          {averageRating > 0 && (
            <div className="absolute top-3 right-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
                <StarDisplay 
                  rating={averageRating} 
                  size="sm" 
                  showValue={true}
                  showCount={false}
                  className="gap-0.5"
                />
              </div>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900 leading-tight">
              {service.name}
            </h4>
            
            {service.user && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage 
                    src={service.user.image ? getImageUrl(service.user.image) : undefined} 
                    alt={service.user.name || "Provider"} 
                  />
                  <AvatarFallback className="text-xs">
                    {service.user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600 font-medium">
                  {service.user.name || "Service Provider"}
                </span>
              </div>
            )}

            {/* Rating and Reviews */}
            {averageRating > 0 && (
              <div className="flex items-center gap-2">
                <StarDisplay 
                  rating={averageRating}
                  size="sm"
                  showValue={true}
                  showCount={true}
                  reviewCount={reviewCount}
                />
              </div>
            )}
            
            <p className="text-sm text-gray-600 leading-relaxed">
              {service.description.length > 80 
                ? service.description.slice(0, 80) + "..." 
                : service.description
              }
            </p>
            
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-primary">
                {CURRENCY}. {service.fixed_price}
              </p>
              <div className="flex items-center text-xs text-gray-600">
                <TooltipWrapper
                  content={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
                >
                  <Button variant="ghost" size="icon" onClick={(e) => handleBookmark(e, service.id)}>
                    <BookmarkIcon className="h-4 w-4" fill={isBookmarked ? colors.primary.DEFAULT : "none"} stroke={isBookmarked ? colors.primary.DEFAULT : colors.text.DEFAULT} />
                  </Button>
                </TooltipWrapper>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ServiceCard;
