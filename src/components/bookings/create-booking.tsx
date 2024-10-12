"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { PlaceOrderSheet } from './create-booking/place-order-sheet'
import { StartBookingDialog } from './create-booking/offer-bid'
import { BookingConfirmation } from './create-booking/booking-create-confirmation'

export function NewBookingDialog() {
    const [date, setDate] = useState<Date>()
    const [service, setService] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isPlaceOrderOpen, setIsPlaceOrderOpen] = useState(false)
    const [isStartBookingOpen, setIsStartBookingOpen] = useState(false)
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
    
  const handleSaveBooking = () => {
    setIsDialogOpen(false)
    setIsPlaceOrderOpen(true)
  }

  const handlePlaceOrderContinue = () => {
    setIsPlaceOrderOpen(false)
    setIsStartBookingOpen(true)
  }

  const handleFindWorker = (budget: number) => {
    setIsStartBookingOpen(false)
    setIsConfirmationOpen(true)
    // Here you would typically send the booking data to your backend
    console.log('Booking placed with budget:', budget)
  }

  return (
    <>
   <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Make New Booking</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Booking</DialogTitle>
            <DialogDescription>
              Make a new booking for a service. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Service
              </Label>
              <Select onValueChange={setService}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cleaning">House Cleaning</SelectItem>
                  <SelectItem value="garage">Garage Cleaning</SelectItem>
                  <SelectItem value="painting">Painting the Walls</SelectItem>
                  <SelectItem value="laundry">Laundry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                  onClick={() => setDate(new Date())}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="flex items-center justify-center rounded-md border w-full"
            />
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                placeholder="Enter address"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveBooking}>Save Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    <PlaceOrderSheet
        isOpen={isPlaceOrderOpen}
        onClose={() => setIsPlaceOrderOpen(false)}
        onContinue={handlePlaceOrderContinue}
        service={service}
      />

      <StartBookingDialog
        isOpen={isStartBookingOpen}
        onClose={() => setIsStartBookingOpen(false)}
        onFindWorker={handleFindWorker}
      />

      <BookingConfirmation
        isOpen={isConfirmationOpen}
        onClose={() => {
          setIsConfirmationOpen(false)
          // Reset all states here
          setDate(undefined)
          setService('')
        }}
      />
    </>
    
  )
}