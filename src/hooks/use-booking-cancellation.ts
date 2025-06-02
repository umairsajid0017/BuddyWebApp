import { useState } from "react";
import { useMarkAsCancelled } from "@/apis/apiCalls";
import { useToast } from "@/hooks/use-toast";

export const useBookingCancellation = () => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  
  const markAsCancelled = useMarkAsCancelled();
  const { toast } = useToast();

  const openCancelDialog = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setIsCancelDialogOpen(true);
  };

  const closeCancelDialog = () => {
    setIsCancelDialogOpen(false);
    setSelectedBookingId(null);
  };

  const handleCancelBooking = async (reason: string) => {
    if (!selectedBookingId) return false;

    try {
      const response = await markAsCancelled.mutateAsync({
        booking_id: selectedBookingId,
        canceled_reason: reason,
      });

      toast({
        title: "Booking Cancelled",
        description: response.message || "Your booking has been successfully cancelled.",
      });

      closeCancelDialog();
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    isCancelDialogOpen,
    isLoading: markAsCancelled.isPending,
    openCancelDialog,
    closeCancelDialog,
    handleCancelBooking,
  };
}; 