"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/ui/star-rating";
import { Edit, Loader2 } from "lucide-react";
import { useEditReview } from "@/apis/apiCalls";
import { toast } from "@/hooks/use-toast";
import { Review } from "@/types/service-types";

interface EditReviewDialogProps {
  review: Review;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export const EditReviewDialog: React.FC<EditReviewDialogProps> = ({
  review,
  trigger,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  
  const editReviewMutation = useEditReview();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setRating(review.rating);
      setComment(review.comment);
    }
  }, [open, review.rating, review.comment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "You must provide a star rating for your review.",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Comment too short",
        description: "Please provide a comment with at least 10 characters.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await editReviewMutation.mutateAsync({
        review_id: review.id.toString(),
        rating: rating.toString(),
        comment: comment.trim(),
        booking_id: review.booking_Id.toString(),
      });

      toast({
        title: "Review updated",
        description: "Your review has been successfully updated!",
      });

      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Failed to update review",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset to original values when closing
    setRating(review.rating);
    setComment(review.comment);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Review
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            Update your review to share your current experience with this service.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rating">Your Rating</Label>
            <StarRating
              value={rating}
              onChange={setRating}
              size="lg"
              className="justify-start"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="Tell others about your experience with this service..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-right text-sm text-muted-foreground">
              {comment.length}/500
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={editReviewMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={editReviewMutation.isPending || rating === 0}
              className="min-w-[100px]"
            >
              {editReviewMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 