"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, MessageCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { CancelBookingDialog } from "./cancel-booking-dialog";
import { BookingChat } from "./booking-chat";
import { Booking } from "@/lib/types/booking-types";

type BookingDetailsSheetProps = {
  booking: Booking;
};

const BookingDetailsSheet: React.FC<BookingDetailsSheetProps> = ({
  booking,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleCancel = () => {
    console.log("Cancelling booking:", booking.id);
  };

  const handleChat = () => {
    setIsChatOpen(true);
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            Details
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{booking.service.name}</SheetTitle>
            <SheetDescription>{booking.worker.name}</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <Image
              src={process.env.NEXT_PUBLIC_IMAGE_URL! + booking.images[0]?.name}
              alt={booking.service.name}
              width={500}
              height={300}
              className="w-full rounded-lg"
            />
            <div className="space-y-2">
              {/*<Badge*/}
              {/*  variant={*/}
              {/*    booking.status === "confirmed"*/}
              {/*      ? "secondary"*/}
              {/*      : booking.status === "completed"*/}
              {/*        ? "default"*/}
              {/*        : "destructive"*/}
              {/*  }*/}
              {/*  className={`${booking.status === "completed" ? "bg-green-500 hover:bg-green-400" : ""}`}*/}
              {/*>*/}
              {/*  {booking.status}*/}
              {/*</Badge>*/}
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {booking.updated_at.split("T")[0] ?? "Date not specified"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>
                  {booking.updated_at?.split("T")[1]?.split(".")[0] ??
                    "Time not specified"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {booking.service.address || "Location not specified"}
                </span>
              </div>
            </div>
            <div className="flex space-x-4">
              {/*{booking.status === "confirmed" && (*/}
              <Button onClick={handleChat} className="flex-1">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat
              </Button>
              {/*)}*/}

              {/*{booking.status === "pending" && (*/}
              {/*  <CancelBookingDialog*/}
              {/*    booking={booking}*/}
              {/*    onConfirm={handleCancel}*/}
              {/*    onCancel={() => console.log("Cancellation aborted")}*/}
              {/*  />*/}
              {/*)}*/}
              {/*{booking.status === "completed" && (*/}
              {/*  <Button className="flex-1">Book Again</Button>*/}
              {/*)}*/}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <BookingChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        taskId={booking.id.toString()}
        provider={booking.worker}
      />
    </>
  );
};

export default BookingDetailsSheet;
