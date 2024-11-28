"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BidResponse } from "@/lib/types/bid-types";
import { useRouter } from "next/navigation";

interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  bidDetails?: BidResponse["data"];
}

export function BookingConfirmation({
  isOpen,
  onClose,
  bidDetails,
}: BookingConfirmationProps) {
  const router = useRouter();
  useEffect(() => {
    console.log("bidDetails", bidDetails);
  }, [isOpen, bidDetails]);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bid Placed Successfully</DialogTitle>
          <DialogDescription>
            Your bid of Rs. {bidDetails?.price} has been placed successfully.
            You will be notified when the service provider responds.
          </DialogDescription>
        </DialogHeader>
        {bidDetails && (
          <div className="mt-4 rounded-lg bg-muted p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Bid Amount:
                </span>
                <span className="font-medium">Rs. {bidDetails.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="font-medium capitalize">
                  {bidDetails.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="font-medium">
                  {new Date(bidDetails.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
        <Button
          onClick={() => {
            router.push("/bookings/offers");
            onClose();
          }}
          className="mt-4 w-full"
        >
          View Offers
        </Button>
      </DialogContent>
    </Dialog>
  );
}
