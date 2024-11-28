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
  onFindWorker: (budget: number, bidId: number) => void;
  service?: Service;
  description?: string;
  mediaFiles?: {
    images?: File[];
    audio?: File;
  };
}

export function StartBookingDialog({
  isOpen,
  onClose,
  onFindWorker,
  service,
  description,
  mediaFiles,
}: StartBookingDialogProps) {
  const [budget, setBudget] = useState(200);
  const createBid = useCreateBid();
  const { user } = useAuth();

  const handleCreateBid = async () => {
    if (!service || !user) return;

    try {
      const response = await createBid.mutateAsync({
        customer_id: Number(user.id),
        service_id: Number(service.id),
        worker_id: Number(service.user_id),
        description: description,
        price: budget.toString(),
        images: mediaFiles?.images,
        audio: mediaFiles?.audio,
      });

      if (response.status) {
        toast.success(response.message);
        onFindWorker(budget, Number(response.data?.booking_id));
      } else {
        toast.error(response.message || "Failed to create bid");
      }
    } catch (error) {
      toast.error("Error creating bid");
      console.error("Bid creation error:", error);
    }
  };

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
          <Button onClick={handleCreateBid} disabled={createBid.isLoading}>
            {createBid.isLoading ? "Placing Bid..." : "Place Bid"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
