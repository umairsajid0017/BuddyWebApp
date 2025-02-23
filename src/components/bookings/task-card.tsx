import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Booking } from "@/lib/types/booking-types";
import BookingDetailsSheet from "./bookings-details-sheet";
import { CURRENCY } from "@/utils/constants";
import { BookingStatus, getStatusLabel } from "@/lib/types/status";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Clock } from "lucide-react";

interface TaskCardProps {
  booking: Booking;
}

const getStatusBadgeVariant = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.OPEN:
    case BookingStatus.CONFIRMED:
    case BookingStatus.STARTED:
    case BookingStatus.WORKER_HAS_STARTED_THE_WORK:
    case BookingStatus.WORKER_IS_ON_HIS_WAY:
    case BookingStatus.WORKER_IS_ON_YOUR_DOORSTEP:
      return "default";
    case BookingStatus.COMPLETED:
      return "success";
    case BookingStatus.CANCELED:
    case BookingStatus.CANCELED_BY_WORKER:
    case BookingStatus.CANCELED_BY_CUSTOMER:
    case BookingStatus.TIMEOUT_CANCELED:
    case BookingStatus.DECLINED:
      return "destructive";
    case BookingStatus.PENDING:
    case BookingStatus.NOT_STARTED:
      return "outline";
    default:
      return "secondary";
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ booking }) => {
  const statusVariant = getStatusBadgeVariant(booking.status);
  const statusLabel = getStatusLabel(booking.status);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0">
        <img
          src={process.env.NEXT_PUBLIC_IMAGE_URL! + booking?.images[0]?.name}
          alt={booking.service.name}
          className="h-40 w-full rounded-t-lg object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          {booking.service.name}
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
      <CardFooter className="flex justify-between p-4 pt-0">
        <Badge variant={statusVariant as any} className="mt-2">
          {statusLabel}
        </Badge>
        <BookingDetailsSheet booking={booking} />
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
