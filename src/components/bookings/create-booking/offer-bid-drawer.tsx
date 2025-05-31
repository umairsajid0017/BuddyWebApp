"use client";

import React, { useState } from "react";
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
import { Service } from "@/types/service-types";
import { DollarSign, Coins } from "lucide-react";
import { CURRENCY } from "@/constants/constantValues";

interface StartBookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBid: (amount: number) => void;
  service?: Service;
  isLoading?: boolean;
}

export function StartBookingDrawer({
  isOpen,
  onClose,
  onSubmitBid,
  service,
  isLoading = false,
}: StartBookingDrawerProps) {
  const [budget, setBudget] = useState(200);
  const predefinedAmounts = [100, 200, 500, 1000];

  const handleQuickSelect = (amount: number) => {
    setBudget(amount);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-center px-6 pt-6">
          <DrawerTitle className="flex items-center justify-center gap-2">
            <Coins className="h-6 w-6 text-primary" />
            Place Your Bid
          </DrawerTitle>
          <DrawerDescription>
            Choose your bid amount or enter a custom value
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 overflow-y-auto flex-1">
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
                  {CURRENCY}
                </span>
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="pl-14"
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
        </div>

        <DrawerFooter className="px-6 pb-6">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => onSubmitBid(budget)}
              disabled={isLoading || budget <= 0}
              className="flex-1"
            >
              {isLoading ? "Placing Bid..." : `Bid ${CURRENCY}. ${budget}`}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
} 