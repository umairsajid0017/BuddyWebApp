"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus } from "lucide-react";
import { format, setDate } from "date-fns";
import { PlaceOrderSheet } from "./create-booking/place-order-sheet";
import { StartBookingDialog } from "./create-booking/offer-bid";
import { BookingConfirmation } from "./create-booking/booking-create-confirmation";
import { ServiceCard } from "./create-booking/booking-service-card";
import { useDirectBooking, useCreateBid, useServices, useCategories, useCalendarAvailability } from "@/apis/apiCalls";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";

import { Skeleton } from "@/components/ui/skeleton";
import { BookingDirectConfirmation } from "./create-booking/booking-direct-confirmation";
import { BackgroundGradient } from "../ui/background-gradient";
import { Service } from "@/types/service-types";
import { MediaFiles } from "@/types/general-types";
import { useLocationUpdate } from "@/helpers/location";
import { CreateBidData, CreateBookingData } from "@/apis/api-request-types";



interface CreateBookingDialogProps {
  initialService?: Service;
  mode?: "book" | "bid";
}

type BookFormState = {
  service: Service | null;
  description: string;
  budget: number;
  date: Date | undefined;
  mediaFiles: MediaFiles | undefined;
  address: string;
};

type BidFormState = {
  category: { id: number; title: string } | null;
  description: string;
  budget: number;
  date: Date | undefined;
  mediaFiles: MediaFiles | undefined;
  address: string;
};

type FormState = BookFormState | BidFormState;

const isBookingForm = (form: FormState): form is BookFormState => {
  return "service" in form;
};

const isBidForm = (form: FormState): form is BidFormState => {
  return "category" in form;
};

export function CreateBookingDialog({
  initialService,
  mode = "bid",
}: CreateBookingDialogProps) {
  const router = useRouter();
  const { user } = useAuth();
  const createBid = useCreateBid();
  const directBooking = useDirectBooking();
  const { updateUserLocation } = useLocationUpdate();
  if(mode === "book" && !initialService) {
    throw new Error("Initial service is required");
  }
  const { isLoading: isLoadingAvailability, isDateAvailable } =
    useCalendarAvailability(
      mode === "book" && initialService?.id 
        ? initialService.id.toString() 
        : undefined
    );

  const [formState, setFormState] = useState<FormState>(() => {
    const baseState = {
      description: "",
      budget: 200,
      time: "",
      date: mode === "bid" ? new Date() : undefined,
      mediaFiles: undefined,
      address: "",
    };

    if (mode === "book") {
      return { ...baseState, service: initialService ?? null } as BookFormState;
    }

    return { ...baseState, category: null } as BidFormState;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaceOrderOpen, setIsPlaceOrderOpen] = useState(false);
  const [isStartBookingOpen, setIsStartBookingOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isBookingConfirmationOpen, setIsBookingConfirmationOpen] =
    useState(false);

  //TODO: Fix the type for the bid details
  const [bidDetails, setBidDetails] = useState<
  any | null
  >(null);
  //TODO: Fix the type for the booking details
  const [bookingDetails, setBookingDetails] = useState<any | null
  >(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const { services, isLoading } = useServices();
  const { categories, isLoading: categoriesLoading } = useCategories();
  console.log("Services:", services);
  console.log("Categories:", categories)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormState(
      mode === "book"
        ? ({
            service: initialService ?? null,
            description: "",
            budget: 200,
            date: undefined,
            mediaFiles: undefined,
            address: "",
          } as BookFormState)
        : ({
            category: null,
            description: "",
            budget: 200,
            date: undefined,
            mediaFiles: undefined,
            address: "",
          } as BidFormState),
    );
  };

  const handleSaveBooking = () => {
    console.log("Form state:", formState);
    const isValid =
      mode === "book"
        ? isBookingForm(formState) &&
          Boolean(
            formState.service && formState.date && formState.address.trim(),
          )
        : isBidForm(formState) &&
          Boolean(
            formState.category && formState.date && formState.address.trim(),
          );

    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsOpen(false);
    setIsPlaceOrderOpen(true);
  };

  const handlePlaceOrderContinue = async (
    description: string,
    mediaFiles?: MediaFiles,
  ) => {
    setFormState((prev) => ({ ...prev, description, mediaFiles }));
    setIsPlaceOrderOpen(false);
    if (mode === "bid") {
      console.log("Bid mode");
      setIsStartBookingOpen(true);
    } else {
      setIsBookingConfirmationOpen(true);
      await handleDirectBooking(mediaFiles);
    }
  };

  const handleDirectBooking = async (mediaFiles?: MediaFiles) => {
    const bookingState = formState as BookFormState;
    if (!user || !bookingState.service) return;

    try {
      setIsBookingLoading(true);

      // Update location
      await updateUserLocation();

      // Format date to YYYY-MM-DD
      const formattedDate = bookingState.date
        ? format(bookingState.date, "yyyy-MM-dd")
        : "";

      if(!initialService) {
        throw new Error("Initial service is required");
      }
      const payload: CreateBookingData = {

        description: bookingState.description,
        images: mediaFiles?.images || bookingState.mediaFiles?.images,
        audio: mediaFiles?.audio || bookingState.mediaFiles?.audio,
        address: bookingState.address,
        booking_date: formattedDate,
        worker_id: initialService?.user.id.toString() ?? "",
        service_id: initialService.id.toString(),
      };

      console.log("Direct booking payload:", payload);
      const response = await directBooking.mutateAsync(payload);

      if (!response.error) {
        setBookingDetails(response.records);
        toast.success("Booking created successfully");
      } else {
        toast.error(response.message || "Failed to create booking");
      }
    } catch (error) {
      toast.error("Error creating booking");
      console.error("Booking error:", error);
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleBidPlacement = async (bidAmount: number) => {
    const bidState = formState as BidFormState;
    if (!user || !bidState.category) return;

    try {
      // Update location
      await updateUserLocation();

      const payload: CreateBidData = {
        category_id: bidState.category.id.toString(),
        description: bidState.description,
        expected_price: bidAmount.toString(),
        images: bidState.mediaFiles?.images,
        audio: bidState.mediaFiles?.audio,
        address: bidState.address,
      };

      const response = await createBid.mutateAsync(payload);

      if (!response.error) {
        setBidDetails(response.records);
        setIsStartBookingOpen(false);
        setIsConfirmationOpen(true);
      } else {
        toast.error(response.message || "Failed to create bid");
      }
    } catch (error) {
      toast.error("Error creating bid");
      console.error("Bid creation error:", error);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, time: e.target.value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    //TODO: Fix the date availability
    // if (mode === "book" && !isDateAvailable(date)) {
    //   return;
    // }

    if (mode === "bid") {
      const today = new Date();
      const isToday =
        format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
      if (!isToday) {
        toast.error("For bids, only today's date can be selected");
        return;
      }
    }

    setFormState((prev) => ({ ...prev, date }));
  };

  return (
    <>
       <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <BackgroundGradient className="w-fit" containerClassName="w-fit">
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="relative z-10 font-bold"
              effect={"shine"}
            >
              <Plus className="h-4 w-4" />
              {mode === "book" ? "Book Now" : "Create a Bid"}
            </Button>
          </DialogTrigger>
        </BackgroundGradient>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {mode === "book" ? "Book Service" : "New Bid"}
            </DialogTitle>
            <DialogDescription>
              {mode === "book"
                ? "Book this service directly."
                : "Create a new bid for a service."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {mode === "book" ? (
              <ServiceCard service={initialService!} compact />
            ) : (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">
                  Service
                </Label>
                <Select
                  onValueChange={(value) => {
                    if (isBidForm(formState)) {
                      const category = categories?.find(
                        (s) => s.id.toString() === value,
                      );
                      setFormState((prev) => ({
                        ...prev,
                        category: category ?? null,
                      }));
                    }
                  }}
                  value={
                    isBidForm(formState)
                      ? formState.category?.id?.toString()
                      : undefined
                  }
                >
                  <SelectTrigger
                    className="col-span-3 w-full"
                    disabled={isLoading}
                  >
                    <SelectValue placeholder="Select a category">
                      {isBidForm(formState)
                        ? (formState.category?.title ?? "Select a category")
                        : "Select a category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading categories...
                      </SelectItem>
                    ) : categories?.length ? (
                      categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.title || `Category #${category.id}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>
                        No categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!formState.date && "text-muted-foreground"}`}
                  onClick={() => handleDateSelect(new Date())}
                  disabled={mode === "book"}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {isLoadingAvailability ? (
                    <Skeleton className="h-4 w-[100px]" />
                  ) : formState.date ? (
                    format(formState.date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </div>
            </div>
            {isLoadingAvailability ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              mode !== "bid" && (
                <Calendar
                  mode="single"
                  selected={formState.date}
                  onSelect={handleDateSelect}
                  className="flex w-full items-center justify-center rounded-md border"
                  disabled={
                    mode === "book"
                      ? (date) => {
                          const isAvailable = isDateAvailable(date);
                          console.log("Is available:", isAvailable);
                          return !isAvailable;
                        }
                      : (date) =>
                          format(date, "yyyy-MM-dd") !==
                          format(new Date(), "yyyy-MM-dd")
                  }
                  modifiers={
                    mode === "book"
                      ? { available: (date) => {
                          return isDateAvailable(date);
                        } }
                      : {
                          available: (date) =>
                            format(date, "yyyy-MM-dd") ===
                            format(new Date(), "yyyy-MM-dd"),
                        }
                  }
                  modifiersClassNames={{
                    available: "bg-green-100 hover:bg-green-200",
                  }}
                />
              )
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                type="text"
                className="col-span-3"
                value={formState.address}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="Enter your address"
              />
            </div>

            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                className="col-span-3"
                value={formState.time}
                onChange={handleTimeChange}
              />
            </div> */}

            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">
                Budget
              </Label>
              <div className="relative col-span-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {CURRENCY}
                </span>
                <Input
                  id="budget"
                  type="number"
                  value={formState.budget}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      budget: Number(e.target.value),
                    }))
                  }
                  className="pl-14"
                />
              </div>
            </div> */}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSaveBooking}
              disabled={
                mode === "book"
                  ? !initialService || !formState.date
                  : !isBidForm(formState) ||
                    !formState.category ||
                    !formState.date
              }
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PlaceOrderSheet
        isOpen={isPlaceOrderOpen}
        onClose={() => setIsPlaceOrderOpen(false)}
        onContinue={handlePlaceOrderContinue}
        service={
          isBookingForm(formState)
            ? (formState.service ?? undefined)
            : undefined
        }
      />

      <StartBookingDialog
        isOpen={isStartBookingOpen}
        onClose={() => setIsStartBookingOpen(false)}
        onSubmitBid={handleBidPlacement}
        service={
          isBookingForm(formState)
            ? (formState.service ?? undefined)
            : undefined
        }
        isLoading={createBid.isPending}
      />

      <BookingDirectConfirmation
        isOpen={isBookingConfirmationOpen}
        onClose={() => {
          setIsBookingConfirmationOpen(false);
          resetForm();
          if (!isBookingLoading && bookingDetails) {
            router.push("/bookings");
          }
        }}
        bookingDetails={bookingDetails ?? undefined}
        isLoading={isBookingLoading}
      />

      <BookingConfirmation
        isOpen={isConfirmationOpen}
        onClose={() => {
          setIsConfirmationOpen(false);
          resetForm();
        }}
        bidDetails={bidDetails ?? undefined}
      />
    </>
  );
}
