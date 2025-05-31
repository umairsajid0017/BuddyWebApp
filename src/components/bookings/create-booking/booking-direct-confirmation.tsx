"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { BookingMobileConfirmation } from "./booking-mobile-confirmation";

interface BookingDirectConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails?: CreateBookingResponse["records"];
  isLoading?: boolean;
  deductionInfo?: {
    deduct_amount: string;
    wallet_amount: string;
  } | null;
}

export function BookingDirectConfirmation({
  isOpen,
  onClose,
  bookingDetails,
  isLoading = false,
  deductionInfo,
}: BookingDirectConfirmationProps) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the md breakpoint
    };

    // Check on mount
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // Render mobile drawer
  if (isMobile) {
    return (
      <BookingMobileConfirmation
        isOpen={isOpen}
        onClose={onClose}
        bookingDetails={bookingDetails}
        isLoading={isLoading}
        deductionInfo={deductionInfo}
      />
    );
  }

  // Render desktop dialog
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            ) : (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            )}
          </div>
          <DialogTitle className="text-center text-2xl font-semibold">
            {isLoading ? "Processing Booking..." : "Booking Initiated!"}
          </DialogTitle>
          <DialogDescription className="mt-2 text-center">
            {isLoading
              ? "Please wait while we process your booking request..."
              : bookingDetails 
                ? "Your booking has been confirmed and the service provider has been notified."
                : deductionInfo && parseFloat(deductionInfo.deduct_amount) > 0
                  ? "Payment required to complete booking. Please try again."
                  : "Unable to process your booking request. Please try again."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="my-8 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Creating your booking...
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Status Badge */}
            {bookingDetails ? (
              <div className="flex justify-center">
                <Badge
                  className={`${getStatusBadgeColor(bookingDetails.status)} px-4 py-2 text-sm font-medium`}
                >
                  {getStatusLabel(bookingDetails.status)}
                </Badge>
              </div>
            ) : (
              deductionInfo && parseFloat(deductionInfo.deduct_amount) > 0 ? (
                <div className="flex justify-center">
                  <Badge
                    className="bg-yellow-100 text-yellow-800 hover:bg-yellow-50 px-4 py-2 text-sm font-medium"
                  >
                    Payment Required
                  </Badge>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Badge
                    className="bg-red-100 text-red-800 hover:bg-red-50 px-4 py-2 text-sm font-medium"
                  >
                    Processing Error
                  </Badge>
                </div>
              )
            )}

            {/* Booking Amount Card */}
            <div className="rounded-xl bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Total Amount
                </span>
                <div className="flex items-center text-lg font-bold text-green-600">
                  <span className="mr-1">{CURRENCY}</span>
                  {bookingDetails ? bookingDetails.price : "-"}
                </div>
              </div>
            </div>

            {/* Details Card */}
            {bookingDetails ? (
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <h4 className="mb-3 font-medium text-gray-700">
                  Booking Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Booking Date
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {new Date(
                        bookingDetails.booking_date,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-2">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Status</span>
                    </div>
                    <Badge
                      className={`text-xs font-medium ${getStatusBadgeColor(
                        bookingDetails.status,
                      )}`}
                    >
                      {getStatusLabel(bookingDetails.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Location</span>
                    </div>
                    <span className="text-sm font-medium">
                      {bookingDetails.address}
                    </span>
                  </div>
                  
                  {deductionInfo && (
                    <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-2">
                      <div className="flex items-center space-x-2">
                        <Wallet className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Wallet Status</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        Amount Deducted
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <h4 className="mb-3 font-medium text-gray-700">
                  Next Steps
                </h4>
                <div className="space-y-3">
                  {deductionInfo && parseFloat(deductionInfo.deduct_amount) > 0 ? (
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          Your booking could not be processed because payment was not completed. You can:
                        </p>
                        <ul className="mt-2 list-disc pl-4 text-sm text-gray-600">
                          <li>Add funds to your wallet</li>
                          <li>Try again with a different payment method</li>
                          <li>Contact support if the issue persists</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <p className="flex-1 text-sm text-gray-600">
                        We encountered an error processing your booking. Please try again or contact customer support if the issue persists.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next Steps */}
            {bookingDetails && (
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  What&apos;s Next?
                </h4>
                <p className="text-sm text-gray-600">
                  You can track your booking status and communicate with the
                  service provider in the bookings section. We&apos;ll notify
                  you of any updates.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex gap-3">
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
      </DialogContent>
    </Dialog>
  );
}
