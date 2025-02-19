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
import { CalendarIcon } from "lucide-react";
import { format, setDate } from "date-fns";
import { type Service } from "@/lib/types";
import { PlaceOrderSheet } from "./create-booking/place-order-sheet";
import { StartBookingDialog } from "./create-booking/offer-bid";
import { BookingConfirmation } from "./create-booking/booking-create-confirmation";
import { ServiceCard } from "./create-booking/booking-service-card";
import { useServices } from "@/lib/api";
import { useCreateBid, useDirectBooking } from "@/lib/api/bookings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type MediaFiles } from "@/lib/types/common";
import { useAuth } from "@/store/authStore";
import {
  type CreateBidData,
  type CreateBidResponse,
  type CreateBookingData,
} from "@/lib/types/booking-types";
import { CURRENCY } from "@/utils/constants";
import { useCategories } from "@/lib/apis/get-categories";

interface CreateBookingDialogProps {
  initialService?: Service;
  mode?: "book" | "bid";
}

type BookFormState = {
  service: Service | null;
  description: string;
  budget: number;
  time: string;
  date: Date | undefined;
  mediaFiles: MediaFiles | undefined;
  address: string;
};

type BidFormState = {
  category: { id: number; title: string } | null;
  description: string;
  budget: number;
  time: string;
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

  const [formState, setFormState] = useState<FormState>(() => {
    const baseState = {
      description: "",
      budget: 200,
      time: "",
      date: undefined,
      mediaFiles: undefined,
      address: "Oman",
    };

    if (mode === "book") {
      return {
        ...baseState,
        service: initialService ?? null,
      } as BookFormState;
    }

    return {
      ...baseState,
      category: null,
    } as BidFormState;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaceOrderOpen, setIsPlaceOrderOpen] = useState(false);
  const [isStartBookingOpen, setIsStartBookingOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [bidDetails, setBidDetails] = useState<
    CreateBidResponse["records"] | null
  >(null);

  const { data: servicesResponse, isLoading } = useServices();
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useCategories();

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
            time: "",
            date: undefined,
            mediaFiles: undefined,
            address: "Oman",
          } as BookFormState)
        : ({
            category: null,
            description: "",
            budget: 200,
            time: "",
            date: undefined,
            mediaFiles: undefined,
            address: "Oman",
          } as BidFormState),
    );
  };

  const handleSaveBooking = () => {
    console.log("Form state:", formState);
    const isValid =
      mode === "book"
        ? isBookingForm(formState) &&
          Boolean(formState.service && formState.date && formState.time)
        : isBidForm(formState) &&
          Boolean(formState.category && formState.date && formState.time);

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
      mediaFiles,
    }));
    setIsPlaceOrderOpen(false);
    if (mode === "bid") {
      console.log("Bid mode");
      setIsStartBookingOpen(true);
    } else {
      //TODO: There is a bug here that need to be resolved as the mediafiles are not in the correct state
      await handleDirectBooking();
    }
  };

  const handleDirectBooking = async () => {
    const bookingState = formState as BookFormState;
    if (!user || !bookingState.service) return;

    try {
      const payload: CreateBookingData = {
        description: bookingState.description,
        images: bookingState.mediaFiles?.images,
        audio: bookingState.mediaFiles?.audio,
        address: bookingState.address,
        booking_date: bookingState.date?.toString() ?? "",
        worker_id: initialService?.user.id.toString() ?? "",
      };
      const response = await directBooking.mutateAsync(payload);

      if (!response.error) {
        toast.success("Booking created successfully");
        router.push("/bookings");
      } else {
        toast.error(response.message || "Failed to create booking");
      }
    } catch (error) {
      toast.error("Error creating booking");
      console.error("Booking error:", error);
    }
  };

  const handleBidPlacement = async (bidAmount: number) => {
    const bidState = formState as BidFormState;
    if (!user || !bidState.category) return;

    try {
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
    setFormState((prev) => ({
      ...prev,
      time: e.target.value,
    }));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="default">
            {mode === "book" ? "Book Now" : "Create a Bid"}
          </Button>
        </DialogTrigger>
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
                      const category = categoriesResponse?.find(
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
                    ) : categoriesResponse?.length ? (
                      categoriesResponse.map((category) => (
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
                  onClick={() =>
                    setFormState((prev) => ({ ...prev, date: new Date() }))
                  }
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formState.date ? (
                    format(formState.date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </div>
            </div>

            <Calendar
              mode="single"
              selected={formState.date}
              onSelect={(date) => setFormState((prev) => ({ ...prev, date }))}
              className="flex w-full items-center justify-center rounded-md border"
            />

            <div className="grid grid-cols-4 items-center gap-4">
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
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
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
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSaveBooking}
              disabled={
                mode === "book"
                  ? !initialService || !formState.date || !formState.time
                  : !isBidForm(formState) ||
                    !formState.category ||
                    !formState.date ||
                    !formState.time
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
        isLoading={createBid.isLoading}
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
