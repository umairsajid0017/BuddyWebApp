import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface BookingCancelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<boolean>;
  isLoading?: boolean;
}

const PREDEFINED_REASONS = [
  "Emergency situation",
  "Change of plans",
  "Service no longer needed",
  "Found another provider",
  "Personal reasons",
  "Other (specify below)",
];

export const BookingCancelDialog: React.FC<BookingCancelDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    onClose();
  };

  const handleConfirm = async () => {
    const finalReason = selectedReason === "Other (specify below)" 
      ? customReason.trim() 
      : selectedReason;
    
    if (finalReason) {
      const success = await onConfirm(finalReason);
      if (success) {
        // Reset local state only on success - parent will handle dialog closing
        setSelectedReason("");
        setCustomReason("");
      }
      // If not successful, keep dialog open with current state
    }
  };

  const isOtherSelected = selectedReason === "Other (specify below)";
  const isFormValid = selectedReason && (!isOtherSelected || customReason.trim());

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Booking</DialogTitle>
          <DialogDescription>
            Please select or provide a reason for canceling this booking. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Reason for cancellation:</Label>
            <RadioGroup
              value={selectedReason}
              onValueChange={setSelectedReason}
              className="mt-2 space-y-2"
            >
              {PREDEFINED_REASONS.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label 
                    htmlFor={reason} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {reason}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {isOtherSelected && (
            <div>
              <Label htmlFor="custom-reason" className="text-sm font-medium">
                Please specify:
              </Label>
              <Textarea
                id="custom-reason"
                placeholder="Enter your reason for cancellation..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Canceling..." : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 