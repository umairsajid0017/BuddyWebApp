"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StartBookingDialogProps {
  isOpen: boolean
  onClose: () => void
  onFindWorker: (budget: number) => void
}

export function StartBookingDialog({ isOpen, onClose, onFindWorker }: StartBookingDialogProps) {
  const [budget, setBudget] = useState(200)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start Booking</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="budget" className="text-right">
              Offer Budget
            </Label>
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onFindWorker(budget)}>Find Worker</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}