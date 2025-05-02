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
import { MapPin, Calendar, Clock, MessageCircle, PlayCircle } from "lucide-react";
import Image from "next/image";
import { CancelBookingDialog } from "./cancel-booking-dialog";
import { BookingChat } from "./booking-chat";
import { Booking } from "@/types/booking-types";
import { ImageViewer } from "@/components/ImageViewer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getImageUrl } from "@/helpers/utils";

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
                <div className="grid grid-cols-2 gap-2">
                  {booking.images.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                      onClick={() => setSelectedImage(getImageUrl(image.name))} 
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
              )}

              {/* Audio Section */}
              {booking.audio && (
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
              )}

              {/* Booking Details */}
              <div className="space-y-4">
                <div className="space-y-2">
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

                {/* Description */}
                {booking.description && (
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">{booking.description}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-4">
                  <Button onClick={handleChat} className="flex-1">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Image Viewer */}
      <ImageViewer
        src={selectedImage || ""}
        alt="Booking image"
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {/* Chat Dialog */}
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
