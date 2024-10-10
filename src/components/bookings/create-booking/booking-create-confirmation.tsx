"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BookingConfirmationProps {
  isOpen: boolean
  onClose: () => void
}

export function BookingConfirmation({ isOpen, onClose }: BookingConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Booking Confirmed</DialogTitle>
          <DialogDescription>
            Your booking has been successfully placed. A worker will be assigned to your task shortly.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={onClose} className="w-full">Close</Button>
      </DialogContent>
    </Dialog>
  )
}