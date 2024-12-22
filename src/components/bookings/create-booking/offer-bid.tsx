"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service } from "@/lib/types";
import { DollarSign, Coins } from "lucide-react";
import { CURRENCY } from "@/utils/constants";

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
  const predefinedAmounts = [100, 200, 500, 1000];

  const handleQuickSelect = (amount: number) => {
    setBudget(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-primary" />
            Place Your Bid
          </DialogTitle>
          <DialogDescription>
            Choose your bid amount or enter a custom value
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Quick select amounts */}
          <div className="grid grid-cols-2 gap-3">
            {predefinedAmounts.map((amount) => (
              <Button
                key={amount}
                variant={budget === amount ? "default" : "outline"}
                onClick={() => handleQuickSelect(amount)}
                className="relative overflow-hidden"
              >
                {CURRENCY}.{amount}
              </Button>
            ))}
          </div>

          {/* Custom amount input */}
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-sm font-medium">
              Custom Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {CURRENCY}.
              </span>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="pl-12"
                min={0}
              />
            </div>
          </div>

          {/* Market insights */}
          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-semibold">Market Insights</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Average Bid</p>
                <p className="font-medium">{CURRENCY}. 250</p>
              </div>
              <div>
                <p className="text-muted-foreground">Recommended</p>
                <p className="font-medium">
                  {CURRENCY}. 200 - {CURRENCY}. 300
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
          <Button
            onClick={() => onSubmitBid(budget)}
            disabled={isLoading || budget <= 0}
            className="w-full"
          >
            {isLoading ? "Placing Bid..." : `Bid ${CURRENCY}. ${budget}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
