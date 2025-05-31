"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { CURRENCY } from "@/constants/constantValues";
import { Badge } from "@/components/ui/badge";
import { BidResponse } from "@/apis/api-response-types";

interface BookingCreateMobileConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  bidDetails?: BidResponse["records"];
}

export function BookingCreateMobileConfirmation({
  isOpen,
  onClose,
  bidDetails,
}: BookingCreateMobileConfirmationProps) {
  const router = useRouter();

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-center px-6 pt-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <DrawerTitle className="text-xl font-semibold">
            Bid Placed Successfully!
          </DrawerTitle>
          <DrawerDescription className="text-center text-gray-600">
            Your bid has been submitted and is awaiting response from the service provider.
          </DrawerDescription>
        </DrawerHeader>

        {bidDetails && (
          <div className="px-6 pb-6">
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex justify-center">
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-50 px-4 py-2 text-sm font-medium">
                  {bidDetails.status ? "Open" : "Closed"}
                </Badge>
              </div>

              {/* Bid Amount Display */}
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <span className="text-sm text-gray-600 block mb-1">Total Bid Amount</span>
                <div className="text-2xl font-bold text-green-600">
                  {CURRENCY}{bidDetails.expected_price}
                </div>
              </div>

              {/* Essential Details */}
              <div className="rounded-lg border bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Status</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-50 text-xs font-medium">
                    {bidDetails.status ? "Open" : "Closed"}
                  </Badge>
                </div>
              </div>

              {/* Success Message */}
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600 text-center">
                  We&apos;ll notify you when the service provider responds to your bid. Track all your offers in the offers section.
                </p>
              </div>
            </div>
          </div>
        )}

        <DrawerFooter className="px-6 pb-6">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                router.push("/bids");
                onClose();
              }}
              className="flex-1 bg-primary hover:bg-primary-800"
            >
              View Offers
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
} 