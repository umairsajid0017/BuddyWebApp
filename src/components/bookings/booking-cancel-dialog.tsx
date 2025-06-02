import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useIsMobile } from "@/hooks/useMediaQuery";

const CANCELLATION_REASONS = [
  { value: "scheduling_conflict", label: "Scheduling conflict" },
  { value: "found_alternative", label: "Found alternative service" },
  { value: "changed_mind", label: "Changed my mind" },
  { value: "emergency", label: "Emergency situation" },
  { value: "worker_issue", label: "Issue with assigned worker" },
  { value: "price_concern", label: "Price concerns" },
  { value: "other", label: "Other reason" },
];

interface BookingCancelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
  reason: string;
  onReasonChange: (reason: string) => void;
}

export const BookingCancelDialog: React.FC<BookingCancelDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  reason,
  onReasonChange,
}) => {
  const isMobile = useIsMobile();
  const [selectedReason, setSelectedReason] = React.useState("");
  const [customReason, setCustomReason] = React.useState("");

  // Update the main reason when either predefined or custom reason changes
  React.useEffect(() => {
    if (selectedReason === "other") {
      onReasonChange(customReason);
    } else if (selectedReason) {
      const reasonLabel = CANCELLATION_REASONS.find(r => r.value === selectedReason)?.label || selectedReason;
      onReasonChange(reasonLabel);
    } else {
      onReasonChange("");
    }
  }, [selectedReason, customReason, onReasonChange]);

  const handleConfirm = () => {
    const finalReason = selectedReason === "other" ? customReason : 
                       CANCELLATION_REASONS.find(r => r.value === selectedReason)?.label || "";
    if (finalReason.trim()) {
      onConfirm(finalReason.trim());
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    onClose();
  };

  if (!isOpen) return null;

  const content = (
    <>
      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium">
            Please select a reason for cancellation:
          </Label>
          <RadioGroup
            value={selectedReason}
            onValueChange={setSelectedReason}
            className="mt-3"
          >
            {CANCELLATION_REASONS.map((reasonOption) => (
              <div key={reasonOption.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={reasonOption.value}
                  id={reasonOption.value}
                />
                <Label
                  htmlFor={reasonOption.value}
                  className="text-sm font-normal cursor-pointer"
                >
                  {reasonOption.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {selectedReason === "other" && (
          <div>
            <Label htmlFor="custom-reason" className="text-sm font-medium">
              Please specify:
            </Label>
            <Textarea
              id="custom-reason"
              placeholder="Enter your reason for cancellation..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
        )}
      </div>
    </>
  );

  const footer = (
    <div className="flex gap-2 w-full">
      <Button
        variant="outline"
        onClick={handleClose}
        disabled={isLoading}
        className="flex-1"
      >
        Cancel
      </Button>
      <Button
        variant="destructive"
        onClick={handleConfirm}
        disabled={!selectedReason || (selectedReason === "other" && !customReason.trim()) || isLoading}
        className="flex-1"
      >
        {isLoading ? "Canceling..." : "Confirm Cancellation"}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleClose}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Cancel Booking</DrawerTitle>
            <DrawerDescription>
              Please provide a reason for canceling this booking. This action cannot be undone.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            {content}
          </div>
          <DrawerFooter>
            {footer}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Booking</DialogTitle>
          <DialogDescription>
            Please provide a reason for canceling this booking. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        {content}

        <DialogFooter>
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 