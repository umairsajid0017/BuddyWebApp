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
import { CreateBidResponse } from "@/lib/types/booking-types";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, IndianRupee, AlertCircle } from "lucide-react"; // Add icons
import { CURRENCY } from "@/utils/constants";

interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  bidDetails?: CreateBidResponse["record"];
}

export function BookingConfirmation({
  isOpen,
  onClose,
  bidDetails,
}: BookingConfirmationProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-2xl font-semibold">
            Bid Placed Successfully!
          </DialogTitle>
          <DialogDescription className="mt-2 text-center">
            Your bid has been submitted and is awaiting response from the
            service provider.
          </DialogDescription>
        </DialogHeader>

        {bidDetails && (
          <div className="mt-6 space-y-6">
            {/* Bid Amount Card */}
            <div className="rounded-xl bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Total Bid Amount
                </span>
                <div className="flex items-center text-lg font-bold text-green-600">
                  <span className="mr-1">{CURRENCY}.</span>
                  {bidDetails.price}
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <h4 className="mb-3 font-medium text-gray-700">Bid Details</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Created</span>
                  </div>
                  <span className="text-sm font-medium">
                    {new Date(bidDetails.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Status</span>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium capitalize text-yellow-800">
                    {bidDetails.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 text-sm font-medium text-gray-700">
                What&apos;s Next?
              </h4>
              <p className="text-sm text-gray-600">
                We&apos;ll notify you when the service provider responds to your
                bid. You can track all your offers in the offers section.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button
            onClick={() => {
              router.push("/bookings/offers");
              onClose();
            }}
            className="flex-1 bg-primary hover:bg-primary-800"
          >
            View Offers
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
