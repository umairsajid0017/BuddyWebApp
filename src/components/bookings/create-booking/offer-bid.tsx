"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Service } from "@/lib/types";
import { useAuth } from "@/store/authStore";
import { useCreateBid } from "@/lib/api/bookings";

interface StartBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBid: (amount: number) => void;
  service?: Service;
  isLoading?: boolean;
}

export function StartBookingDialog({
  isOpen,
  onClose,
  onSubmitBid,
  service,
  isLoading = false,
}: StartBookingDialogProps) {
  const [budget, setBudget] = useState(200);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place Your Bid</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="budget" className="text-right">
              Offer Amount
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSubmitBid(budget)} disabled={isLoading}>
            {isLoading ? "Placing Bid..." : "Place Bid"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
