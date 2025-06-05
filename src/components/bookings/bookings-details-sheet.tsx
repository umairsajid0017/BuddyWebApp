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
import { MapPin, Calendar, Clock, MessageCircle, PlayCircle, Star } from "lucide-react";
import Image from "next/image";
import { CancelBookingDialog } from "./cancel-booking-dialog";
import { BookingChat } from "./booking-chat";
import { Booking } from "@/types/booking-types";
import { ImageViewer } from "@/components/ImageViewer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getImageUrl } from "@/helpers/utils";
import { format } from "date-fns";
import { BookingStatus } from "@/constants/constantValues";
import { AddReviewDialog } from "./add-review-dialog";
import { ReviewManager } from "@/components/services/review-manager";

type BookingDetailsSheetProps = {
  booking: Booking;
};

const BookingDetailsSheet: React.FC<BookingDetailsSheetProps> = ({
  booking,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);

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
          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="mt-6 space-y-6">
              {/* Images Gallery */}
              {booking.images && booking.images.length > 0 && (
                <div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Your Images
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {booking.images.map((image, index) => (
                      <div
                        key={image.id}
                        className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                        onClick={() =>
                          setSelectedImage(getImageUrl(image.name))
                        }
                      >
                        <Image
                          src={getImageUrl(image.name)}
                          alt={`Booking image ${index + 1}`}
                          fill
                          className="object-cover transition-transform hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audio Section */}
              {booking.audio && (
                <div>
                  <p className="text-sm text-muted-foreground">Audio Message</p>
                  <div className="rounded-lg bg-muted/50 p-4">
                    {playingAudioId === booking.id ? (
                      <audio
                        controls
                        className="h-10 w-full"
                        style={{ colorScheme: "normal" }}
                        onEnded={() => setPlayingAudioId(null)}
                        autoPlay
                      >
                        <source
                          src={`${process.env.NEXT_PUBLIC_AUDIO_URL}/${booking.audio}`}
                          type="audio/wav"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <Button
                        variant="outline"
                        className="flex w-full items-center justify-center gap-2"
                        onClick={() => setPlayingAudioId(booking.id)}
                      >
                        <PlayCircle className="h-5 w-5" />
                        Play Audio Description
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Booking Details */}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Booking Details</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {booking.updated_at
                        ? format(booking.updated_at, "MMM d, yyyy")
                        : "Date not specified"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {booking.updated_at
                        ? format(booking.updated_at, "h:mm a")
                        : "Time not specified"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {booking.service.address || "Location not specified"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {booking.description && (
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">
                      {booking.description}
                    </p>
                  </div>
                )}

                {booking.before_images && booking.before_images.length > 0 && (
                  <div>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Before Images
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {booking.before_images.map((image, index) => (
                        <div
                          key={image.id}
                          className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                          onClick={() =>
                            setSelectedImage(getImageUrl(image.name))
                          }
                        >
                          <Image
                            src={getImageUrl(image.name)}
                            alt={`Before image ${index + 1}`}
                            fill
                            className="object-cover transition-transform hover:scale-110"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {booking.after_images && booking.after_images.length > 0 && (
                  <div>
                    <p className="mb-4 text-sm text-muted-foreground">
                      After Images
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {booking.after_images.map((image, index) => (
                        <div
                          key={image.id}
                          className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                          onClick={() =>
                            setSelectedImage(getImageUrl(image.name))
                          }
                        >
                          <Image
                            src={getImageUrl(image.name)}
                            alt={`After image ${index + 1}`}
                            fill
                            className="object-cover transition-transform hover:scale-110"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-4 sm:flex-row">
                  {(booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.STARTED) && (
                    <Button onClick={handleChat} className="flex-1">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat
                    </Button>
                  )}
                  
                  {booking.status === BookingStatus.COMPLETED && (
                    <div className="w-full">
                      <ReviewManager 
                        serviceId={booking.service.id} 
                        showAddReview={true}
                        isServicePage={false}
                        bookingId={booking.id.toString()}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <ImageViewer
        src={selectedImage || ""}
        alt="Booking image"
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {(booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.STARTED) && (
          <BookingChat
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            taskId={booking.id.toString()}
            provider={booking.worker}
          />
        )}
    </>
  );
};

export default BookingDetailsSheet;
