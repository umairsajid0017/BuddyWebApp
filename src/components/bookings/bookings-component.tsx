"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBookingsByStatus } from "@/lib/api/bookings";
import { CreateBookingDialog } from "./create-booking-dialogue";
import { Skeleton } from "@/components/ui/skeleton";
import TaskCard from "./task-card";
import Image from "next/image";
import { BookingStatus, getStatusLabel } from "@/lib/types/status";

const DISPLAY_STATUSES = [
  {
    key: "pending",
    status: BookingStatus.PENDING,
    label: getStatusLabel(BookingStatus.PENDING),
  },
  {
    key: "confirmed",
    status: BookingStatus.CONFIRMED,
    label: getStatusLabel(BookingStatus.CONFIRMED),
  },
  {
    key: "completed",
    status: BookingStatus.COMPLETED,
    label: getStatusLabel(BookingStatus.COMPLETED),
  },
  {
    key: "canceled",
    status: BookingStatus.CANCELED,
    label: getStatusLabel(BookingStatus.CANCELED),
  },
] as const;

type BookingStatusKey = (typeof DISPLAY_STATUSES)[number]["key"];

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
      You have no {status} bookings
    </h2>
    <p className="mb-6 text-center text-gray-500">
      You do not have any {status} bookings. Make a new booking by clicking the
      button below.
    </p>
    <CreateBookingDialog />
  </div>
);

const BookingsComponent: React.FC = () => {
  const [currentStatusKey, setCurrentStatusKey] =
    useState<BookingStatusKey>("pending");
  const currentStatus = DISPLAY_STATUSES.find(
    (s) => s.key === currentStatusKey,
  )!;

  const {
    data: bookingsResponse,
    isLoading,
    error,
  } = useBookingsByStatus(currentStatus.status);

  if (error) {
    return <div>Error loading bookings: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <CreateBookingDialog />
      </div>
      <Tabs
        value={currentStatusKey}
        onValueChange={(value) =>
          setCurrentStatusKey(value as BookingStatusKey)
        }
      >
        <TabsList className="mb-4">
          {DISPLAY_STATUSES.map(({ key, label }) => (
            <TabsTrigger key={key} value={key}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {DISPLAY_STATUSES.map(({ key, label }) => (
          <TabsContent key={key} value={key}>
            {isLoading ? (
              <LoadingBookings />
            ) : (bookingsResponse?.records ?? []).length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {bookingsResponse?.records.map((booking) => (
                  <TaskCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <NoBookingsView status={label.toLowerCase()} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default BookingsComponent;
