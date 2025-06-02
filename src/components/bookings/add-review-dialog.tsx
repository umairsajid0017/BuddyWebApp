"use client";

import React, { useState } from "react";
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
import { Star, Loader2 } from "lucide-react";
import { useAddReview } from "@/apis/apiCalls";
import { toast } from "@/hooks/use-toast";

interface AddReviewDialogProps {
  serviceId: number;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export const AddReviewDialog: React.FC<AddReviewDialogProps> = ({
  serviceId,
  trigger,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  
  const addReviewMutation = useAddReview();

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
      const response = await addReviewMutation.mutateAsync({
        service_id: serviceId.toString(),
        rating: rating.toString(),
        comment: comment.trim(),
      });

    

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      setRating(0);
      setComment("");
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Failed to submit review",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setRating(0);
    setComment("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Add Review
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Review</DialogTitle>
          <DialogDescription>
            Share your experience with this service to help other customers.
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
              disabled={addReviewMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={addReviewMutation.isPending || rating === 0}
              className="min-w-[100px]"
            >
              {addReviewMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 