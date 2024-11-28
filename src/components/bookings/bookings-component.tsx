"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBookings } from "@/lib/api/bookings";
import { CreateBookingDialog } from "./create-booking-dialogue";

import { Skeleton } from "@/components/ui/skeleton";
import TaskCard from "./task-card";
import Image from "next/image";

const statusMapping = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
} as const;

type BookingStatus = keyof typeof statusMapping;

const LoadingBookings = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[1, 2, 3, 4].map((i) => (
      <Skeleton key={i} className="h-[200px] w-full" />
    ))}
  </div>
);

const NoBookingsView: React.FC<{ status: string }> = ({ status }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="pointer-events-none flex items-center justify-center">
      <Image
        src="/assets/verify-email.svg"
        alt="Verify Email"
        className="h-[180px] w-[180px]"
        width={180}
        height={180}
      />
    </div>
    <h2 className="mb-2 text-center text-2xl font-semibold">
      You have no {status} booking
    </h2>
    <p className="mb-6 text-center text-gray-500">
      You do not have any {status} booking. Make a new booking by clicking the
      button below.
    </p>
    <CreateBookingDialog />
  </div>
);
const BookingsComponent: React.FC = () => {
  const { data: bookingsResponse, isLoading, error } = useBookings();

  if (error) {
    return <div>Error loading bookings: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <CreateBookingDialog />
      </div>
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          {Object.entries(statusMapping).map(([value, label]) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.keys(statusMapping).map((status) => (
          <TabsContent key={status} value={status}>
            {isLoading ? (
              <LoadingBookings />
            ) : (bookingsResponse?.data ?? []).filter(
                (booking) => booking.status === status,
              ).length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {(bookingsResponse?.data ?? [])
                  .filter((booking) => booking.status === status)
                  .map((booking) => (
                    <TaskCard key={booking.id} booking={booking} />
                  ))}
              </div>
            ) : (
              <NoBookingsView status={statusMapping[status as BookingStatus]} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default BookingsComponent;
