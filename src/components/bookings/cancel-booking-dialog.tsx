"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Booking } from "@/types/booking-types";
import { getImageUrl } from "@/helpers/utils";

type CancelBookingDialogProps = {
  booking: Booking;
  onConfirm: () => void;
  onCancel: () => void;
};

export const CancelBookingDialog: React.FC<CancelBookingDialogProps> = ({
  booking,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="flex-1">
          Cancel Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Cancel Booking
          </DialogTitle>
        </DialogHeader>
        <Card className="flex items-center justify-start">
          <CardHeader>
            <Image
              src={getImageUrl(booking?.service?.images[0]?.name)}
              alt={booking.service.name}
              width={96}
              height={96}
              className="rounded-lg"
            />
          </CardHeader>
          <CardContent className="flex h-full flex-col justify-center p-0">
            <h3 className="font-semibold">{booking.service.name}</h3>
            <p className="text-sm text-text-700">{booking.worker.name}</p>
          </CardContent>
        </Card>
        <DialogDescription className="mb-4 text-center">
          Are you sure want to cancel your service booking?
        </DialogDescription>
        <p className="mb-6 text-center text-sm text-destructive">
          Only 80% of the money you can refund from your payment according to
          our policy
        </p>
        <div className="flex justify-between space-x-4">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="flex-1">
            Yes, Cancel Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
