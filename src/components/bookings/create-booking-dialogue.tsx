"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import { useServices } from "@/lib/api";
import { Service } from "@/lib/types";
import { PlaceOrderSheet } from "./create-booking/place-order-sheet";
import { StartBookingDialog } from "./create-booking/offer-bid";
import { BookingConfirmation } from "./create-booking/booking-create-confirmation";
import { ServiceCard } from "./create-booking/booking-service-card";

interface CreateBookingDialogProps {
  initialService?: Service;
}

export function CreateBookingDialog({
  initialService,
}: CreateBookingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>(
    initialService,
  );
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(200);
  const [isPlaceOrderOpen, setIsPlaceOrderOpen] = useState(false);
  const [isStartBookingOpen, setIsStartBookingOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const { data: servicesResponse, isLoading, error } = useServices();

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialService]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedService(initialService);
    setDescription("");
    setBudget(200);
  };

  const handleContinue = () => {
    setIsOpen(false);
    setIsPlaceOrderOpen(true);
  };

  const handlePlaceOrderContinue = () => {
    setIsPlaceOrderOpen(false);
    setIsStartBookingOpen(true);
  };

  const handleFindWorker = (newBudget: number) => {
    setBudget(newBudget);
    setIsStartBookingOpen(false);
    setIsConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
    resetForm();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="default">
            {initialService ? "Book Now" : "Create a Bid"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {initialService ? "Book Service" : "Create New Booking"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!initialService && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">
                  Service
                </Label>
                <Select
                  value={selectedService?.id.toString()}
                  onValueChange={(value) =>
                    setSelectedService(
                      servicesResponse?.data.find(
                        (s) => s.id.toString() === value,
                      ),
                    )
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicesResponse?.data.map((service) => (
                      <SelectItem
                        key={service.id}
                        value={service.id.toString()}
                      >
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {selectedService && <ServiceCard service={selectedService} />}
          </div>
          <Button onClick={handleContinue} disabled={!selectedService}>
            Continue
          </Button>
        </DialogContent>
      </Dialog>

      <PlaceOrderSheet
        isOpen={isPlaceOrderOpen}
        onClose={() => setIsPlaceOrderOpen(false)}
        onContinue={handlePlaceOrderContinue}
        service={selectedService}
      />

      <StartBookingDialog
        isOpen={isStartBookingOpen}
        onClose={() => setIsStartBookingOpen(false)}
        onFindWorker={handleFindWorker}
      />

      <BookingConfirmation
        isOpen={isConfirmationOpen}
        onClose={handleConfirmationClose}
      />
    </>
  );
}
