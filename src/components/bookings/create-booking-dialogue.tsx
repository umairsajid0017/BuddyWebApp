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
import { Service } from "@/lib/types";
import { PlaceOrderSheet } from "./create-booking/place-order-sheet";
import { StartBookingDialog } from "./create-booking/offer-bid";
import { BookingConfirmation } from "./create-booking/booking-create-confirmation";
import { ServiceCard } from "./create-booking/booking-service-card";
import { useServices } from "@/lib/api";
import { useCreateBid, useDirectBooking } from "@/lib/api/bookings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BookingFormData, MediaFiles } from "@/lib/types/common";
import { useAuth } from "@/store/authStore";
import { CreateBidResponse } from "@/lib/types/booking-types";

interface CreateBookingDialogProps {
  initialService?: Service;
  mode?: "book" | "bid";
}

export function CreateBookingDialog({
  initialService,
  mode = "bid",
}: CreateBookingDialogProps) {
  const router = useRouter();
  const { user } = useAuth();
  const createBid = useCreateBid();
  const directBooking = useDirectBooking();

  const [formData, setFormData] = useState<BookingFormData>({
    service: initialService || null,
    description: "",
    budget: 200,
    time: "",
    date: undefined,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaceOrderOpen, setIsPlaceOrderOpen] = useState(false);
  const [isStartBookingOpen, setIsStartBookingOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [bidDetails, setBidDetails] = useState<
    CreateBidResponse["record"] | null
  >(null);

  const { data: servicesResponse, isLoading } = useServices();
  console.log("servicesResponse", servicesResponse);
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      service: initialService || null,
      description: "",
      budget: 200,
      time: "",
      date: undefined,
    });
  };

  const handleSaveBooking = () => {
    if (!formData.service || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsOpen(false);
    setIsPlaceOrderOpen(true);
  };

  const handlePlaceOrderContinue = (
    description: string,
    mediaFiles?: MediaFiles,
  ) => {
    setFormData((prev) => ({
      ...prev,
      description,
      mediaFiles,
    }));
    setIsPlaceOrderOpen(false);

    if (mode === "bid") {
      setIsStartBookingOpen(true);
    } else {
      handleDirectBooking();
    }
  };

  const handleDirectBooking = async () => {
    if (!user || !formData.service) return;

    try {
      const response = await directBooking.mutateAsync({
        customer_id: Number(user.id),
        worker_id: Number(formData.service.user_id),
        service_id: formData.service.id,
        price: formData.budget.toString(),
        description: formData.description,
        images: formData.mediaFiles?.images,
        videos: formData.mediaFiles?.videos,
        audio: formData.mediaFiles?.audio,
      });

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
    if (!user || !formData.service) return;

    try {
      const response = await createBid.mutateAsync({
        customer_id: user.id,
        service_id: formData.service.id,
        worker_id: formData.service.user_id,
        description: formData.description,
        price: bidAmount.toString(),
        images: formData.mediaFiles?.images,
        audio: formData.mediaFiles?.audio,
      });

      if (!response.error) {
        setBidDetails({
          id: response?.record?.id,
          customer_id: response?.record?.customer_id,
          service_id: response?.record?.service_id,
          price: response?.record?.price,
          created_at: response?.record?.created_at,
          updated_at: response?.record?.updated_at,
          description: response?.record?.description,
          status: response?.record?.status ? "open" : "closed",
          images: response?.record?.images,
          audio: response?.record?.audio,
        });
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
    setFormData((prev) => ({
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
            {initialService ? (
              <ServiceCard service={initialService} compact />
            ) : (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">
                  Service
                </Label>
                <Select
                  onValueChange={(value) => {
                    const service = servicesResponse?.record.find(
                      (s) => s.id.toString() === value,
                    );
                    setFormData((prev) => ({
                      ...prev,
                      service: service || null,
                    }));
                  }}
                  value={formData.service?.id?.toString()}
                >
                  <SelectTrigger
                    className="col-span-3 w-full"
                    disabled={isLoading}
                  >
                    <SelectValue placeholder="Select a service">
                      {formData.service?.service_name || "Select a service"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading services...
                      </SelectItem>
                    ) : servicesResponse?.record &&
                      servicesResponse.record.length > 0 ? (
                      servicesResponse.record.map((service) => (
                        <SelectItem
                          key={service.id}
                          value={service.id.toString()}
                        >
                          {service.service_name || `Service #${service.id}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-services" disabled>
                        No services available
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
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${
                    !formData.date && "text-muted-foreground"
                  }`}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      date: new Date(),
                    }));
                  }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  date: date,
                }))
              }
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
                value={formData.time}
                onChange={handleTimeChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSaveBooking}
              disabled={!formData.service || !formData.date || !formData.time}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PlaceOrderSheet
        isOpen={isPlaceOrderOpen}
        onClose={() => setIsPlaceOrderOpen(false)}
        onContinue={(description: string, mediaFiles?: MediaFiles) =>
          handlePlaceOrderContinue(description, mediaFiles)
        }
        service={formData.service || undefined}
      />

      <StartBookingDialog
        isOpen={isStartBookingOpen}
        onClose={() => setIsStartBookingOpen(false)}
        onSubmitBid={handleBidPlacement}
        service={formData.service || undefined}
        isLoading={createBid.isLoading}
      />

      <BookingConfirmation
        isOpen={isConfirmationOpen}
        onClose={() => {
          setIsConfirmationOpen(false);
          resetForm();
        }}
        bidDetails={bidDetails || undefined}
      />
    </>
  );
}
