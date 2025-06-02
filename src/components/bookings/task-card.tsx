import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, X } from "lucide-react";
import { Booking } from "@/types/booking-types";
import BookingDetailsSheet from "./bookings-details-sheet";
import { BookingCancelDialog } from "./booking-cancel-dialog";
import { CURRENCY } from "@/constants/constantValues";
import { BookingStatus } from "@/constants/constantValues";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Clock } from "lucide-react";
import { getImageUrl, getStatusBadgeVariant, getStatusLabel } from "@/helpers/utils";
import { TaskCardProps } from "@/types/general-types";
import { useBookingCancellation } from "@/hooks/use-booking-cancellation";

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
  console.log(booking.status);
  const statusVariant = getStatusBadgeVariant(booking.status);
  const statusLabel = getStatusLabel(booking.status);

  const {
    isCancelDialogOpen,
    isLoading,
    openCancelDialog,
    closeCancelDialog,
    handleCancelBooking,
  } = useBookingCancellation();

  // Only show cancel option for bookings that can be cancelled
  const canBeCancelled = booking.status === BookingStatus.PENDING || 
                        booking.status === BookingStatus.CONFIRMED;

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer"
                    onClick={() => openCancelDialog(booking.id)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel Booking
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardFooter>
      </Card>

      <BookingCancelDialog
        isOpen={isCancelDialogOpen}
        onClose={closeCancelDialog}
        onConfirm={handleCancelBooking}
        isLoading={isLoading}
      />
    </>
  );
};

export default TaskCard;
