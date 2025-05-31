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
  Clock,
  MapPin,
  AlertCircle,
  Loader2,
  Wallet,
} from "lucide-react";
import { CURRENCY } from "@/constants/constantValues";
import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/constants/constantValues";
import { getStatusLabel } from "@/helpers/utils";
import { CreateBookingResponse } from "@/apis/api-response-types";

interface BookingMobileConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails?: CreateBookingResponse["records"];
  isLoading?: boolean;
  deductionInfo?: {
    deduct_amount: string;
    wallet_amount: string;
  } | null;
}

export function BookingMobileConfirmation({
  isOpen,
  onClose,
  bookingDetails,
  isLoading = false,
  deductionInfo,
}: BookingMobileConfirmationProps) {
  const router = useRouter();

  const getStatusBadgeColor = (status: number) => {
    switch (status) {
      case BookingStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-50";
      case BookingStatus.CONFIRMED:
        return "bg-green-100 text-green-800 hover:bg-green-50";
      case BookingStatus.COMPLETED:
        return "bg-blue-100 text-blue-800 hover:bg-blue-50";
      case BookingStatus.CANCELED:
        return "bg-red-100 text-red-800 hover:bg-red-50";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-50";
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-center px-6 pt-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            ) : (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            )}
          </div>
          <DrawerTitle className="text-xl font-semibold">
            {isLoading ? "Processing..." : bookingDetails ? "Booking Confirmed!" : "Action Required"}
          </DrawerTitle>
          <DrawerDescription className="text-center text-gray-600">
            {isLoading
              ? "Creating your booking..."
              : bookingDetails 
                ? "Your booking has been confirmed"
                : deductionInfo && parseFloat(deductionInfo.deduct_amount) > 0
                  ? "Payment required to complete"
                  : "Unable to process request"}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 pb-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Please wait...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex justify-center">
                {bookingDetails ? (
                  <Badge className={`${getStatusBadgeColor(bookingDetails.status)} px-4 py-2 text-sm font-medium`}>
                    {getStatusLabel(bookingDetails.status)}
                  </Badge>
                ) : (
                  <Badge className={deductionInfo && parseFloat(deductionInfo.deduct_amount) > 0 
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-50 px-4 py-2 text-sm font-medium"
                    : "bg-red-100 text-red-800 hover:bg-red-50 px-4 py-2 text-sm font-medium"
                  }>
                    {deductionInfo && parseFloat(deductionInfo.deduct_amount) > 0 ? "Payment Required" : "Error"}
                  </Badge>
                )}
              </div>

              {/* Amount Display */}
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <span className="text-sm text-gray-600 block mb-1">Total Amount</span>
                <div className="text-2xl font-bold text-green-600">
                  {CURRENCY}{bookingDetails ? bookingDetails.price : "-"}
                </div>
              </div>

              {/* Essential Details */}
              {bookingDetails && (
                <div className="rounded-lg border bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Date</span>
                    </div>
                    <span className="text-sm font-medium">
                      {new Date(bookingDetails.booking_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">Location</span>
                    </div>
                    <span className="text-sm font-medium text-right max-w-[60%]">
                      {bookingDetails.address}
                    </span>
                  </div>

                  {deductionInfo && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Payment</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        Wallet Deducted
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Error/Warning Messages */}
              {!bookingDetails && (
                <div className="rounded-lg border bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 flex-shrink-0">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        {deductionInfo && parseFloat(deductionInfo.deduct_amount) > 0
                          ? "Add funds to your wallet or try a different payment method."
                          : "Please try again or contact support if the issue persists."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {bookingDetails && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600 text-center">
                    Track your booking status in the bookings section. We&apos;ll notify you of updates.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DrawerFooter className="px-6 pb-6">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                router.push("/bookings");
                onClose();
              }}
              className="flex-1 bg-primary hover:bg-primary-800"
              disabled={isLoading}
            >
              View Bookings
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
} 