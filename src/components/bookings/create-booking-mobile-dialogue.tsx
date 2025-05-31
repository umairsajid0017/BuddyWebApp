"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
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
import { format } from "date-fns";
import { ServiceCard } from "./create-booking/booking-service-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Service } from "@/types/service-types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreateBookingMobileDialogueProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "book" | "bid";
  initialService?: Service;
  formState: any;
  setFormState: (state: any) => void;
  categories?: any[];
  categoriesLoading: boolean;
  isLoading: boolean;
  isLoadingAvailability: boolean;
  isDateAvailable: (date: Date) => boolean;
  handleDateSelect: (date: Date | undefined) => void;
  handleSaveBooking: () => void;
}

export function CreateBookingMobileDialogue({
  isOpen,
  onOpenChange,
  mode,
  initialService,
  formState,
  setFormState,
  categories,
  categoriesLoading,
  isLoading,
  isLoadingAvailability,
  isDateAvailable,
  handleDateSelect,
  handleSaveBooking,
}: CreateBookingMobileDialogueProps) {
  const isBookingForm = (form: any): boolean => {
    return "service" in form;
  };

  const isBidForm = (form: any): boolean => {
    return "category" in form;
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[95vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0 text-center px-6 pt-6">
          <DrawerTitle className="text-xl font-semibold">
            {mode === "book" ? "Book Service" : "Create New Bid"}
          </DrawerTitle>
          <DrawerDescription className="text-center text-gray-600">
            {mode === "book"
              ? "Book this service directly"
              : "Create a new bid for a service"}
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6 pb-6">
            {mode === "book" ? (
              <div className="rounded-lg border bg-white p-4">
                <ServiceCard service={initialService!} compact />
              </div>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="service" className="text-base font-medium">
                  Select Category
                </Label>
                <Select
                  onValueChange={(value) => {
                    if (isBidForm(formState)) {
                      const category = categories?.find(
                        (s) => s.id.toString() === value,
                      );
                      setFormState((prev: any) => ({
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
                  <SelectTrigger className="h-12 w-full text-base" disabled={isLoading}>
                    <SelectValue placeholder="Choose a category">
                      {isBidForm(formState)
                        ? (formState.category?.title ?? "Choose a category")
                        : "Choose a category"}
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

            {/* Date Selection */}
            {mode === "book" && (
              <div className="space-y-3">
                <Label htmlFor="date" className="text-base font-medium">
                  Select Date
                </Label>
              </div>
            )}

            {/* Calendar */}
            {isLoadingAvailability ? (
              <Skeleton className="h-[300px] w-full rounded-lg" />
            ) : (
              mode !== "bid" && (
                <div className="rounded-lg border bg-white p-4">
                  <Calendar
                    mode="single"
                    selected={formState.date}
                    onSelect={handleDateSelect}
                    className="flex w-full items-center justify-center"
                    disabled={
                      mode === "book"
                        ? (date) => {
                            const isAvailable = isDateAvailable(date);
                            return !isAvailable;
                          }
                        : (date) =>
                            format(date, "yyyy-MM-dd") !==
                            format(new Date(), "yyyy-MM-dd")
                    }
                    modifiers={
                      mode === "book"
                        ? {
                            available: (date) => {
                              return isDateAvailable(date);
                            },
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
                </div>
              )
            )}

            {/* Address Input */}
            <div className="space-y-3">
              <Label htmlFor="address" className="text-base font-medium">
                Your Address
              </Label>
              <Input
                id="address"
                type="text"
                className="h-12 text-base focus:outline-none focus-visible:ring-0"
                value={formState.address}
                onChange={(e) =>
                  setFormState((prev: any) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                placeholder="Enter your full address"
              />
            </div>

            {/* Info Card */}
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-700">
                {mode === "book"
                  ? "Review your booking details and continue to proceed with the service booking."
                  : "Fill in all required fields to create your bid. Service providers will be able to respond to your request."}
              </p>
            </div>
          </div>
        </ScrollArea>

        <DrawerFooter className="flex-shrink-0 px-6 pb-6">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveBooking}
              className="flex-1 h-12 text-base bg-primary hover:bg-primary-800"
              disabled={
                mode === "book"
                  ? !initialService || !formState.date || !formState.address.trim()
                  : !isBidForm(formState) ||
                    !formState.category ||
                    !formState.date ||
                    !formState.address.trim()
              }
            >
              Continue
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
} 