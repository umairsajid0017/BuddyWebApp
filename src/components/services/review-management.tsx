"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Heart, MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useGetReviews } from "@/apis/apiCalls";
import { useAuth } from "@/store/authStore";
import { EditReviewDialog } from "@/components/bookings/edit-review-dialog";
import { DeleteReviewDialog } from "@/components/bookings/delete-review-dialog";
import { AddReviewDialog } from "@/components/bookings/add-review-dialog";
import { Review } from "@/types/service-types";
import { getImageUrl } from "@/helpers/utils";

interface ReviewManagementProps {
  serviceId: number;
  showAddReview?: boolean;
}

export const ReviewManagement: React.FC<ReviewManagementProps> = ({
  serviceId,
  showAddReview = false,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<number | 'all'>('all');
  const { user } = useAuth();
  const { data: reviewsResponse, isLoading, error, refetch } = useGetReviews(serviceId);

  const reviews = reviewsResponse?.records || [];

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const filteredReviews = selectedFilter === 'all'
    ? reviews
    : reviews.filter(review => review.rating === selectedFilter);

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(review => review.rating === stars).length
  }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
    return date.toLocaleDateString();
  };

  // Check if the current user owns this review
  const isUserReview = (review: Review) => {
    return user && user.id === review.customer_Id;
  };

  // Check if user has already reviewed this service
  const userReview = reviews.find(review => isUserReview(review));

  const handleReviewUpdate = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load reviews</p>
            <Button variant="outline" onClick={() => refetch()} className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-current text-primary" />
            <span className="text-lg font-semibold">{averageRating}</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">{reviews.length} reviews</span>
          </div>
          
          {showAddReview && !userReview && (
            <AddReviewDialog
              serviceId={serviceId}
              onSuccess={handleReviewUpdate}
              trigger={
                <Button className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Add Review
                </Button>
              }
            />
          )}
          
          {userReview && (
            <div className="flex gap-2">
              <EditReviewDialog
                review={userReview}
                onSuccess={handleReviewUpdate}
                trigger={
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Review
                  </Button>
                }
              />
              <DeleteReviewDialog
                review={userReview}
                onSuccess={handleReviewUpdate}
                trigger={
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Review
                  </Button>
                }
              />
            </div>
          )}
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant={selectedFilter === 'all' ? "default" : "outline"}
            onClick={() => setSelectedFilter('all')}
            className={selectedFilter === 'all' ? "bg-primary" : ""}
          >
            All
          </Button>
          {ratingCounts.map(({ stars, count }) => (
            <Button
              key={stars}
              variant={selectedFilter === stars ? "default" : "outline"}
              onClick={() => setSelectedFilter(stars)}
              className={selectedFilter === stars ? "bg-primary" : ""}
            >
              <Star className="mr-1 h-4 w-4 fill-current" />
              {stars}
              <span className="ml-1 text-xs text-muted-foreground">({count})</span>
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reviews found</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.customer.image ? getImageUrl(review.customer.image) : undefined} />
                      <AvatarFallback>
                        {review.customer.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">
                        {isUserReview(review) ? "You" : review.customer.name}
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current text-primary" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(review.created_at)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {isUserReview(review) ? (
                          <>
                            <EditReviewDialog
                              review={review}
                              onSuccess={handleReviewUpdate}
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Review
                                </DropdownMenuItem>
                              }
                            />
                            <DeleteReviewDialog
                              review={review}
                              onSuccess={handleReviewUpdate}
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Review
                                </DropdownMenuItem>
                              }
                            />
                            <DropdownMenuSeparator />
                          </>
                        ) : null}
                        <DropdownMenuItem>Report</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
                <div className="mt-2 flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Heart className="mr-1 h-4 w-4" />
                    0
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 