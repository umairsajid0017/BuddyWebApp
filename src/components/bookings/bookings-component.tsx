"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBookingsByStatus } from "@/apis/apiCalls";
import { CreateBookingDialog } from "./create-booking-dialogue";
import { Skeleton } from "@/components/ui/skeleton";
import TaskCard from "./task-card";
import Image from "next/image";
import { getStatusLabel } from "@/helpers/utils";
import { BookingStatus } from "@/constants/constantValues";
import { Booking } from "@/types/booking-types";
import { ScrollArea } from "../ui/scroll-area";

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
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {[1, 2, 3, 4].map((i) => (
      <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
    ))}
  </div>
);

const NoBookingsView: React.FC<{ status: string }> = ({ status }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center sm:py-12">
    <div className="pointer-events-none mb-4 flex items-center justify-center">
      <Image
        src="/assets/verify-email.svg"
        alt="No Bookings"
        className="h-[150px] w-[150px] sm:h-[180px] sm:w-[180px]"
        width={180}
        height={180}
      />
    </div>
    <h2 className="mb-2 text-xl font-semibold sm:text-2xl">
      You have no {status} bookings
    </h2>
    <p className="mb-4 text-sm text-gray-500 sm:mb-6 sm:text-base">
      You do not have any {status} bookings. Make a new booking by clicking the
      button.
    </p>
    {/* <CreateBookingDialog /> */}
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
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">My Bookings</h1>
        {/* <CreateBookingDialog /> */}
      </div>
      <Tabs
        value={currentStatusKey}
        onValueChange={(value) =>
          setCurrentStatusKey(value as BookingStatusKey)
        }
        className="w-full"
      >
        <TabsList className="md:mb-6 mb-8 grid w-full grid-cols-2 sm:grid-cols-4">
          {DISPLAY_STATUSES.map(({ key, label }) => (
            <TabsTrigger key={key} value={key} className="px-3 py-2 text-xs sm:text-sm">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {DISPLAY_STATUSES.map(({ key, label }) => (
          <TabsContent key={key} value={key}>
            {isLoading ? (
              <LoadingBookings />
            ) : (bookingsResponse?.records ?? []).length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
                {bookingsResponse?.records.map((booking: Booking) => (
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
