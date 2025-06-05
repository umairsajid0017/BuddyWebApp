'use client'

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MoreHorizontal, Star, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Review } from "@/types/service-types"
import { EditReviewDialog } from "@/components/bookings/edit-review-dialog"
import { DeleteReviewDialog } from "@/components/bookings/delete-review-dialog"
import { useAuth } from "@/store/authStore"

interface ReviewsSectionProps {
  ratings: Review[]
  onReviewUpdated?: () => void
}

export default function ReviewsSection({ ratings = [], onReviewUpdated }: ReviewsSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<number | 'all'>('all')
  const { user } = useAuth()

  const averageRating = ratings.length > 0
    ? (ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length).toFixed(1)
    : '0.0'

  const filteredRatings = selectedFilter === 'all'
    ? ratings
    : ratings.filter(rating => rating.rating === selectedFilter)

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: ratings.filter(rating => rating.rating === stars).length
  }))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'week' : 'weeks'} ago`
    }
    return date.toLocaleDateString()
  }

  // Check if the current user owns this review
  const isUserReview = (rating: Review) => {
    return user && user.id === rating.customer_Id
  }

  const handleReviewUpdate = () => {
    onReviewUpdated?.()
  }

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-current text-primary" />
            <span className="text-lg font-semibold">{averageRating}</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">{ratings.length} reviews</span>
          </div>
          <Button variant="link" className="text-primary">
            See All
          </Button>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant={selectedFilter === 'all' ? "default" : "outline"}
            onClick={() => setSelectedFilter('all')}
            className={selectedFilter === 'all' ? "bg-primary " : ""}
          >
            All
          </Button>
          {ratingCounts.map(({ stars, count }) => (
            <Button
              key={stars}
              variant={selectedFilter === stars ? "default" : "outline"}
              onClick={() => setSelectedFilter(stars)}
              className={selectedFilter === stars ? "bg-primary " : ""}
            >
              <Star className="mr-1 h-4 w-4 fill-current" />
              {stars}
              <span className="ml-1 text-xs text-muted-foreground">({count})</span>
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredRatings.map((rating) => (
            <div key={rating.id} className="border-b pb-4 last:border-0">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">
                      {isUserReview(rating) ? "You" : rating.customer.name}
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: rating.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(rating.created_at)}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isUserReview(rating) ? (
                        <>
                          <EditReviewDialog
                            review={rating}
                            onSuccess={handleReviewUpdate}
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Review
                              </DropdownMenuItem>
                            }
                          />
                          <DeleteReviewDialog
                            review={rating}
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
              <p className="text-sm text-muted-foreground">{rating.comment}</p>
              <div className="mt-2 flex items-center gap-1">
                <Button variant="ghost" size="sm" className="text-primary">
                  <Heart className="mr-1 h-4 w-4" />
                  0
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}