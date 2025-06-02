import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash, X } from "lucide-react";
import { Booking } from "@/types/booking-types";
import BookingDetailsSheet from "./bookings-details-sheet";
import { BookingCancelDialog } from "./booking-cancel-dialog";
import { CURRENCY } from "@/constants/constantValues";
import { BookingStatus } from "@/constants/constantValues";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Clock } from "lucide-react";
import { getImageUrl, getStatusBadgeVariant, getStatusLabel } from "@/helpers/utils";
import { TaskCardProps } from "@/types/general-types";
import { useMarkAsCancelled } from "@/apis/apiCalls";
import { useToast } from "@/hooks/use-toast";

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.COMPLETED:
      return "#b4ffb4";
    case BookingStatus.CANCELED:
      return "red";
    case BookingStatus.STARTED:
    case BookingStatus.CONFIRMED:
      return "#4883ff";
    case BookingStatus.PENDING:
      return "#ffe3af";
    default:
      return "gray";
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ booking }) => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const markAsCancelled = useMarkAsCancelled();
  const { toast } = useToast();

  const statusVariant = getStatusBadgeVariant(booking.status);
  const statusLabel = getStatusLabel(booking.status);

  // Only show cancel option for bookings that can be cancelled
  const canBeCancelled = booking.status === BookingStatus.PENDING || 
                        booking.status === BookingStatus.CONFIRMED;

  const handleCancelBooking = (reason: string) => {
    markAsCancelled.mutate(
      {
        booking_id: booking.id,
        canceled_reason: reason,
      },
      {
        onSuccess: (response) => {
          toast({
            title: "Booking Cancelled",
            description: response.message || "Your booking has been cancelled.",
          });
          setIsCancelDialogOpen(false);
          setCancelReason(""); // Reset reason
          // Force page reload to ensure UI updates
          setTimeout(() => window.location.reload(), 500);
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to cancel booking.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleCloseDialog = () => {
    setIsCancelDialogOpen(false);
    setCancelReason(""); // Reset reason when closing
  };

  const handleOpenCancelDialog = () => {
    setIsCancelDialogOpen(true);
  };

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader className="p-0">
          <img
            src={getImageUrl(booking?.images[0]?.name)}
            alt={booking.service.name}
            className="h-40 w-full rounded-t-lg object-cover"
          />
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            {booking.service.name}
            <Badge variant={"secondary"} className="">
              {booking.bid_id ? "Bid" : "Direct"}
            </Badge>
          </CardTitle>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-500">{booking.worker.name}</p>
            <p className="text-sm font-semibold text-primary">
              {CURRENCY} {booking.price}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(booking.updated_at).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-end p-4 pt-0">
          <Badge 
            variant={statusVariant as any} 
            className="mt-2" 
            style={{ backgroundColor: getStatusColor(booking.status) }}
          >
            {statusLabel}
          </Badge>
          
          <div className="flex items-center gap-2">
            <BookingDetailsSheet booking={booking} />
            
            {canBeCancelled && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleOpenCancelDialog}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <BookingCancelDialog
        isOpen={isCancelDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleCancelBooking}
        isLoading={markAsCancelled.isPending}
        reason={cancelReason}
        onReasonChange={setCancelReason}
      />
    </>
  );
};

export default TaskCard;
