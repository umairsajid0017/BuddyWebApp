"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useDeleteReview } from "@/apis/apiCalls";
import { toast } from "@/hooks/use-toast";
import { Review } from "@/types/service-types";

interface DeleteReviewDialogProps {
  review: Review;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export const DeleteReviewDialog: React.FC<DeleteReviewDialogProps> = ({
  review,
  trigger,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const deleteReviewMutation = useDeleteReview();

  const handleDelete = async () => {
    try {
      const response = await deleteReviewMutation.mutateAsync({
        review_id: review.id.toString(),
      });

      toast({
        title: "Review deleted",
        description: "Your review has been successfully deleted.",
      });

      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Failed to delete review",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex items-center gap-2 text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
            Delete Review
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Review</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this review? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteReviewMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteReviewMutation.isPending}
            className="bg-red-600 hover:bg-red-700 min-w-[100px]"
          >
            {deleteReviewMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 