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
import { useServices, useCategories } from "@/apis/apiCalls";
import { useCreateBid, useDirectBooking } from "@/apis/apiCalls";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/apis/apiCalls";

import { CURRENCY } from "@/utils/constants";
import { useLocationUpdate } from "@/helpers/location";
import { useCalendarAvailability } from "@/hooks/useCalendarAvailability";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingDirectConfirmation } from "./create-booking/booking-direct-confirmation";
import { BackgroundGradient } from "../ui/background-gradient";
import { Service } from "@/types/service-types";
import { MediaFiles } from "@/types/general-types";
import { CreateBookingResponse } from "@/apis/api-response-types";
import { CreateBidData, CreateBookingData } from "@/apis/api-request-types";
import { Category } from "@/types/category-types";
import { Bid } from "@/types/bid-types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CreateBookingDialogProps {
  initialService?: Service;
  mode?: "book" | "bid";
}

interface BidFormState {
  category_id: number;
  expected_price: string;
  address: string;
  description?: string;
  images?: File[];
  audio?: File;
  category?: Category;
  date?: Date;
}

interface BookFormState {
  worker_id: string;
  booking_date: string;
  address: string;
  description?: string;
  images?: File[];
  audio?: File;
  date?: Date;
}

type FormState = BidFormState | BookFormState;

const isBookingForm = (form: FormState): form is BookFormState => {
  return "worker_id" in form;
};

const isBidForm = (form: FormState): form is BidFormState => {
  return "category_id" in form;
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
  const { isLoading: isLoadingAvailability, isDateAvailable } =
    useCalendarAvailability(initialService?.user?.id?.toString());

  const { services, isLoading: servicesLoading } = useServices();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const [formState, setFormState] = useState<FormState>(() => {
    if (mode === "book") {
      return {
        worker_id: initialService?.user.id.toString() ?? "",
        booking_date: "",
        address: "",
        date: new Date(),
      } as BookFormState;
    }

    return {
      category_id: 0,
      expected_price: "",
      address: "",
      date: new Date(),
    } as BidFormState;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaceOrderOpen, setIsPlaceOrderOpen] = useState(false);
  const [isStartBookingOpen, setIsStartBookingOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isBookingConfirmationOpen, setIsBookingConfirmationOpen] =
    useState(false);
  const [bidDetails, setBidDetails] = useState<Bid>();
  const [bookingDetails, setBookingDetails] = useState<
    CreateBookingResponse["records"] | null
  >(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

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
            worker_id: initialService?.user.id.toString() ?? "",
            booking_date: "",
            address: "",
            date: new Date(),
          } as BookFormState)
        : ({
            category_id: 0,
            expected_price: "",
            address: "",
            date: new Date(),
          } as BidFormState),
    );
  };

  const handleSaveBooking = () => {
    console.log("Form state:", formState);
    const isValid =
      mode === "book"
        ? isBookingForm(formState) &&
          Boolean(
            formState.worker_id && formState.date && formState.address.trim(),
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
    setFormState((prev) => ({
      ...prev,
      description,
      images: mediaFiles?.images,
      audio: mediaFiles?.audio,
    }));
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
    if (!user || !initialService) return;

    try {
      setIsBookingLoading(true);

      // Update location
      await updateUserLocation();

      // Format date to YYYY-MM-DD
      const formattedDate = bookingState.date
        ? format(bookingState.date, "yyyy-MM-dd")
        : "";

      const payload: CreateBookingData = {
        description: bookingState.description,
        images: mediaFiles?.images,
        audio: mediaFiles?.audio,
        address: bookingState.address,
        booking_date: formattedDate,
        worker_id: initialService.user.id.toString(),
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
        images: bidState.images,
        audio: bidState.audio,
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
    setFormState((prev) => ({
      ...prev,
      time: e.target.value,
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (mode === "book" && !isDateAvailable(date)) {
      return;
    }

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

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;

    if (isBookingForm(formState)) {
      setFormState((prev) => {
        if (isBookingForm(prev)) {
          return {
            ...prev,
            booking_date: format(date, "yyyy-MM-dd"),
            date,
          };
        }
        return prev;
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <BackgroundGradient className="w-fit" containerClassName="w-fit">
          <DialogTrigger asChild>
            <Button variant="default" className="relative z-10 font-bold" effect={"shine"}>
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
                        (s: Category) => s.id.toString() === value,
                      );
                      setFormState((prev) => {
                        if (isBidForm(prev)) {
                          return {
                            ...prev,
                            category_id: category?.id ?? 0,
                            category,
                          };
                        }
                        return prev;
                      });
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
                    disabled={isLoadingAvailability}
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
                      categories.map((category: Category) => (
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
                  disabled={mode === "book" && isLoadingAvailability}
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
                      ? (date) => !isDateAvailable(date)
                      : (date) =>
                          format(date, "yyyy-MM-dd") !==
                          format(new Date(), "yyyy-MM-dd")
                  }
                  modifiers={
                    mode === "book"
                      ? {
                          available: (date) => isDateAvailable(date),
                        }
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
                  setFormState((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
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
        service={initialService}
      />

      <StartBookingDialog
        isOpen={isStartBookingOpen}
        onClose={() => setIsStartBookingOpen(false)}
        onSubmitBid={handleBidPlacement}
        service={initialService}
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
