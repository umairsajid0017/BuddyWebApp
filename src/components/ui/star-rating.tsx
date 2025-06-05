"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/helpers/utils";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

interface StarDisplayProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  showCount?: boolean;
  reviewCount?: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  max = 5,
  size = "md",
  className,
  disabled = false,
}) => {
  const [hover, setHover] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(max)].map((_, index) => {
        const ratingValue = index + 1;
        const isFilled = ratingValue <= (hover || value);
        
        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              "cursor-pointer transition-colors",
              isFilled 
                ? "fill-yellow-400 text-yellow-400" 
                : "fill-transparent text-muted-foreground hover:text-yellow-400",
              disabled && "cursor-not-allowed opacity-50"
            )}
            onClick={() => !disabled && onChange(ratingValue)}
            onMouseEnter={() => !disabled && setHover(ratingValue)}
            onMouseLeave={() => !disabled && setHover(0)}
          />
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">
          {value} out of {max}
        </span>
      )}
    </div>
  );
};

// Display-only star rating component
export const StarDisplay: React.FC<StarDisplayProps> = ({
  rating,
  maxRating = 5,
  size = "sm",
  showValue = true,
  showCount = false,
  reviewCount = 0,
  className,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, index) => (
          <Star
            key={`full-${index}`}
            className={cn(
              sizeClasses[size],
              "fill-yellow-400 text-yellow-400"
            )}
          />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star
              className={cn(
                sizeClasses[size],
                "fill-transparent text-muted-foreground"
              )}
            />
            <Star
              className={cn(
                sizeClasses[size],
                "absolute inset-0 fill-yellow-400 text-yellow-400"
              )}
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <Star
            key={`empty-${index}`}
            className={cn(
              sizeClasses[size],
              "fill-transparent text-muted-foreground"
            )}
          />
        ))}
      </div>
      
      {(showValue || showCount) && (
        <div className={cn("flex items-center gap-1 text-muted-foreground", textSizeClasses[size])}>
          {showValue && <span className="font-medium">{rating.toFixed(1)}</span>}
          {showCount && reviewCount > 0 && (
            <span>({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
          )}
        </div>
      )}
    </div>
  );
}; 