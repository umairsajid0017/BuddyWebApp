"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus, XIcon } from "lucide-react";
import { format, setDate } from "date-fns";
import { PlaceOrderResponsive } from "./create-booking/place-order-responsive";
import { StartBookingResponsive } from "./create-booking/offer-bid-responsive";
import { BookingConfirmation } from "./create-booking/booking-create-confirmation";
import { ServiceCard } from "./create-booking/booking-service-card";
import {
  useDirectBooking,
  useCreateBid,
  useServices,
  useCategories,
  useCalendarAvailability,
  useCheckDeduction,
  useInitPaymentGateway,
  useGetPaymentInfo,
} from "@/apis/apiCalls";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";

import { Skeleton } from "@/components/ui/skeleton";
import { BookingDirectConfirmation } from "./create-booking/booking-direct-confirmation";
import { BackgroundGradient } from "../ui/background-gradient";
import { Service } from "@/types/service-types";
import { MediaFiles } from "@/types/general-types";
import { useLocationUpdate } from "@/helpers/location";
import {
  CreateBidData,
  CreateBookingData,
  AddToWalletData,
  GetPaymentInfoData,
} from "@/apis/api-request-types";
import { ROUTES } from "@/constants/routes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateBookingMobileDialogue } from "./create-booking-mobile-dialogue";
import { validateAddress } from "@/utils/validations";
import { PaymentGatewayDialog } from "@/components/common/payment-gateway-dialog";

interface CreateBookingDialogProps {
  initialService?: Service;
  mode?: "book" | "bid";
  isGuest?: boolean;
}

type BookFormState = {
  service: Service | null;
  description: string;
  budget: number;
  date: Date | undefined;
  mediaFiles: MediaFiles | undefined;
  address: string;
};

type BidFormState = {
  category: { id: number; title: string } | null;
  description: string;
  budget: number;
  date: Date | undefined;
  mediaFiles: MediaFiles | undefined;
  address: string;
};

type FormState = BookFormState | BidFormState;

const isBookingForm = (form: FormState): form is BookFormState => {
  return "service" in form;
};

const isBidForm = (form: FormState): form is BidFormState => {
  return "category" in form;
};

export function CreateBookingDialog({
  initialService,
  mode = "bid",
  isGuest = false,
}: CreateBookingDialogProps) {
  const router = useRouter();
  const { user } = useAuth();
  const createBid = useCreateBid();
  const directBooking = useDirectBooking();
  const checkDeduction = useCheckDeduction();
  const paymentGatewayMutation = useInitPaymentGateway();
  const getPaymentInfoMutation = useGetPaymentInfo();
  const { updateUserLocation } = useLocationUpdate();

  // Add mobile state detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (mode === "book" && !initialService) {
    throw new Error("Initial service is required");
  }
  const { isLoading: isLoadingAvailability, isDateAvailable } =
    useCalendarAvailability(
      mode === "book" && initialService?.id
        ? initialService.id.toString()
        : undefined,
    );

  const [formState, setFormState] = useState<FormState>(() => {
    const baseState = {
      description: "",
      budget: 200,
      time: "",
      date: mode === "bid" ? new Date() : undefined,
      mediaFiles: undefined,
      address: "",
    };

    if (mode === "book") {
      return { ...baseState, service: initialService ?? null } as BookFormState;
    }

    return { ...baseState, category: null } as BidFormState;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaceOrderOpen, setIsPlaceOrderOpen] = useState(false);
  const [isStartBookingOpen, setIsStartBookingOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isBookingConfirmationOpen, setIsBookingConfirmationOpen] =
    useState(false);

  //TODO: Fix the type for the bid details
  const [bidDetails, setBidDetails] = useState<any | null>(null);
  //TODO: Fix the type for the booking details
  const [bookingDetails, setBookingDetails] = useState<any | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const { services, isLoading } = useServices();
  const { categories, isLoading: categoriesLoading } = useCategories();
  console.log("Services:", services);
  console.log("Categories:", categories);

  // Add state to store deduction info
  const [deductionInfo, setDeductionInfo] = useState<{
    deduct_amount: string;
    wallet_amount: string;
  } | null>(null);

  // Payment gateway state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [pendingMediaFiles, setPendingMediaFiles] = useState<
    MediaFiles | undefined
  >(undefined);
  const [currentPaymentId, setCurrentPaymentId] = useState<number | null>(null);
  const [currentTransactionNumber, setCurrentTransactionNumber] = useState<string | undefined>(undefined);

  // State for bid payment flow - This will be removed
  // const [pendingBidPlacementInfo, setPendingBidPlacementInfo] = useState<{
  //   amount: number;
  //   mediaFiles?: MediaFiles;
  //   description: string;
  //   category: { id: number; title: string } | null;
  //   address: string;
  // } | null>(null);
  const [paymentFor, setPaymentFor] = useState<"booking" | null>(null); // Removed "bid" type

  const handleOpenChange = (open: boolean) => {
    console.log("Is guest:", isGuest);
    if (isGuest) {
      router.push(ROUTES.LOGIN);
      return;
    }
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormState(
      mode === "book"
        ? ({
            service: initialService ?? null,
            description: "",
            budget: 200,
            date: undefined,
            mediaFiles: undefined,
            address: "",
          } as BookFormState)
        : ({
            category: null,
            description: "",
            budget: 200,
            date: undefined,
            mediaFiles: undefined,
            address: "",
          } as BidFormState),
    );
    setDeductionInfo(null);
    setIsPaymentOpen(false);
    setPaymentUrl("");
    setPendingMediaFiles(undefined);
    setIsBookingLoading(false);
    // setPendingBidPlacementInfo(null); // Reset pending bid info - Removed
    setPaymentFor(null); // Reset payment context
  };

  const handleSaveBooking = () => {
    console.log("Form state:", formState);

    // Validate address first
    const addressValidation = validateAddress(formState.address);
    if (!addressValidation.isValid) {
      toast.error(addressValidation.message || "Invalid address");
      return;
    }

    const isValid =
      mode === "book"
        ? isBookingForm(formState) &&
          Boolean(
            formState.service && formState.date && formState.address.trim(),
          )
        : isBidForm(formState) &&
          Boolean(
            formState.category && formState.date && formState.address.trim(),
          );

    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsOpen(false);
    setIsPlaceOrderOpen(true);
  };

  const handleDirectBooking = useCallback(async (mediaFiles?: MediaFiles, transactionNumber?: string) => {
    const bookingState = formState as BookFormState;
    if (!user || !bookingState.service) return;

    try {
      if (!isBookingLoading) {
        setIsBookingLoading(true);
      }
      await updateUserLocation();
      const formattedDate = bookingState.date
        ? format(bookingState.date, "yyyy-MM-dd")
        : "";
      if (!initialService) {
        throw new Error("Initial service is required");
      }
      const payload: CreateBookingData = {
        description: bookingState.description,
        images: mediaFiles?.images || bookingState.mediaFiles?.images,
        audio: mediaFiles?.audio || bookingState.mediaFiles?.audio,
        address: bookingState.address,
        booking_date: formattedDate,
        worker_id: initialService?.user.id.toString() ?? "",
        service_id: initialService.id.toString(),
        transaction_number: transactionNumber,
      };
      const response = await directBooking.mutateAsync(payload);
      if (!response.error) {
        setBookingDetails(response.records);
        toast.success("Booking created successfully");
      } else {
        toast.error(response.message || "Failed to create booking");
      }
    } catch (error) {
      toast.error("Error creating booking");
      console.error("Booking error:", error);
    } finally {
      setIsBookingLoading(false);
    }
  }, [formState, user, initialService, directBooking, updateUserLocation, isBookingLoading]);

  const handlePaymentClose = useCallback(async () => {
    const currentPaymentContext = paymentFor;
    const paymentIdToCheck = currentPaymentId;

    setPaymentFor(null);
    setCurrentPaymentId(null); 
    setCurrentTransactionNumber(undefined);

    setIsPaymentOpen(false);
    setPaymentUrl("");

    if (!paymentIdToCheck) {
      toast.warning("Payment session ended. Status unknown as no payment ID was found.");
      if (currentPaymentContext === "booking") {
        setIsBookingConfirmationOpen(true); 
      } else if (currentPaymentContext === "bid") {
        setIsConfirmationOpen(true); 
      }
      setIsBookingLoading(false);
      return;
    }

    try {
      setIsBookingLoading(true); 
      const paymentInfo = await getPaymentInfoMutation.mutateAsync({ payment_id: paymentIdToCheck });

      if (paymentInfo.error || paymentInfo.records.status !== "paid") {
        const statusMessage = paymentInfo.records.status ? `Status: ${paymentInfo.records.status}.` : "Could not verify payment success.";
        toast.error(`Payment not successful. ${statusMessage} Your ${currentPaymentContext} may not be processed.`);
        if (currentPaymentContext === "booking") {
           setBookingDetails((prev: any) => ({ ...prev, paymentStatus: paymentInfo.records.status || "failed" }));
        } else if (currentPaymentContext === "bid") {
           setBidDetails((prev: any) => ({ ...prev, paymentStatus: paymentInfo.records.status || "failed" }));
        }
        setIsBookingLoading(false);
        if (currentPaymentContext === "booking") setIsBookingConfirmationOpen(true);
        else if (currentPaymentContext === "bid") setIsConfirmationOpen(true);
        return; 
      }

      const transactionNumber = paymentInfo.records.transaction_id;
      setCurrentTransactionNumber(transactionNumber);

      toast.success("Payment verified successfully.");

      if (currentPaymentContext === "booking") {
        try {
          const bookingState = formState as BookFormState;
          if (!bookingState.service) {
            toast.error("Service details missing for booking payment verification.");
            setIsBookingLoading(false);
            setIsBookingConfirmationOpen(true);
            return;
          }
           setDeductionInfo({ 
             deduct_amount: "0", 
             wallet_amount: deductionInfo?.wallet_amount || "N/A", 
           });
          setIsBookingConfirmationOpen(true);
          await handleDirectBooking(pendingMediaFiles, transactionNumber); 
        } catch (error) {
          toast.error("Error finalizing booking after payment.");
          console.error("Booking finalization error:", error);
          setIsBookingConfirmationOpen(true); 
        }
      } 
    } catch (error: any) {
      toast.error(error.message || "Error verifying payment status.");
      console.error("Payment verification error:", error);
      if (currentPaymentContext === "booking") {
        setIsBookingConfirmationOpen(true);
      } 
    } finally {
      if (currentPaymentContext === "booking") {
        setPendingMediaFiles(undefined);
      }
    }
  }, [
    formState,
    checkDeduction, 
    pendingMediaFiles,
    directBooking,
    paymentFor,
    createBid, 
    user,
    updateUserLocation, 
    isBookingLoading, 
    getPaymentInfoMutation, 
    currentPaymentId, 
    currentTransactionNumber,
    deductionInfo, 
    handleDirectBooking, 
  ]);

  // Register event listener to handle postMessage from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data === "close" ||
        event.data?.action === "close" ||
        event.data === "Thawani::cancelled" ||
        event.data === "Thawani::success"
      ) {
        handlePaymentClose();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handlePaymentClose]);

  const handlePlaceOrderContinue = async (
    description: string,
    mediaFiles?: MediaFiles,
  ) => {
    setFormState((prev) => ({ ...prev, description, mediaFiles }));
    setIsPlaceOrderOpen(false);

    if (mode === "bid") {
      console.log("Bid mode");
      setIsStartBookingOpen(true);
    } else {
      // Check deduction amount before creating booking
      try {
        const bookingState = formState as BookFormState;
        if (!bookingState.service) return;

        const expectedPrice = bookingState.service.fixed_price;

        setIsBookingLoading(true);
        const deductionResult = await checkDeduction.mutateAsync({
          amount_omr: expectedPrice,
        });
        setDeductionInfo({
          deduct_amount: deductionResult.deduct_amount,
          wallet_amount: deductionResult.wallet_amount,
        });

        // Save media files for later use
        setPendingMediaFiles(mediaFiles);

        // If there's an amount to deduct, show payment gateway
        if (parseFloat(deductionResult.deduct_amount) > 0) {
          setPaymentFor("booking"); // Set payment context
          // Initialize payment gateway
          const paymentData: AddToWalletData = {
            amount: deductionResult.deduct_amount,
            payment_method_id: "1",
            comment: "Booking payment",
            order_total_amount: parseFloat(expectedPrice),
            action: "order_deduction",
          };

          const result = await paymentGatewayMutation.mutateAsync(paymentData);

          if (!result.error && result.pay_url) {
            // Open the payment URL in the dialog
            setPaymentUrl(result.pay_url);
            setCurrentPaymentId(result.payment_id); 
            console.log("Payment ID:", result.payment_id);
            setIsPaymentOpen(true);
          } else {
            // Show error and still open confirmation dialog
            toast.error(result.message || "Failed to initialize payment");
            setIsBookingConfirmationOpen(true);
            await handleDirectBooking(mediaFiles, currentTransactionNumber);
            setIsBookingLoading(false);
          }
        } else {
          // No amount to deduct, proceed with booking directly
          setIsBookingLoading(false); // Ensure loading is false before showing confirmation
          setIsBookingConfirmationOpen(true);
          await handleDirectBooking(mediaFiles, currentTransactionNumber);
        }
      } catch (error) {
        toast.error("Error checking wallet deduction amount");
        console.error("Deduction check error:", error);
        // Still show confirmation dialog even on error
        setIsBookingConfirmationOpen(true);
        setIsBookingLoading(false);
      }
    }
  };

  const handleBidPlacement = async (bidAmount: number) => {
    const bidState = formState as BidFormState;
    if (!user || !bidState.category) {
      toast.error("User or category not defined for bid placement.");
      return;
    }

    setIsBookingLoading(true);
    try {
      // Removed deduction check and payment gateway initialization for bids
      setIsStartBookingOpen(false);
      // Directly execute bid creation without payment
      await executeActualBidCreation(
        bidAmount,
        bidState.mediaFiles,
        bidState.description,
        bidState.category,
        bidState.address,
      );
      // Show confirmation after successful bid creation
      // No, this should be handled by executeActualBidCreation or its caller
      // setIsConfirmationOpen(true); 
    } catch (error) {
      toast.error("Error during bid placement process");
      console.error("Bid placement error:", error);
      // setIsConfirmationOpen(true); // Ensure confirmation is shown even on error
    } finally {
      setIsBookingLoading(false);
      // Ensure bid dialog is closed if it was open, though it's closed before this now
      // setIsStartBookingOpen(false); 
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, time: e.target.value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    //TODO: Fix the date availability
    // if (mode === "book" && !isDateAvailable(date)) {
    //   return;
    // }

    if (mode === "bid") {
      const today = new Date();
      const isToday =
        format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
      if (!isToday) {
        toast.error("For bids, only today's date can be selected");
        return;
      }
    }

    setFormState((prev) => ({ ...prev, date }));
  };

  const executeActualBidCreation = useCallback(async (
    amount: number,
    mediaFiles: MediaFiles | undefined,
    description: string,
    category: { id: number; title: string } | null,
    address: string,
    transactionNumber?: string,
  ) => {
    if (!user || !category) {
      toast.error("User or category missing for bid creation.");
      return;
    }

    const payload: CreateBidData = {
      category_id: category.id.toString(),
      description: description,
      expected_price: amount.toString(),
      images: mediaFiles?.images,
      audio: mediaFiles?.audio,
      address: address,
    };
    const response = await createBid.mutateAsync(payload);

    if (!response.error) {
      toast.success("Bid created successfully");
      setCurrentPaymentId(null); 
      setCurrentTransactionNumber(undefined);
      setIsPaymentOpen(false);
      // Set bid details for confirmation dialog
      setBidDetails(response.records); // Assuming response.records contains bid details
      setIsConfirmationOpen(true); // Open confirmation dialog
    } else {
      toast.error(response.message || "Failed to create bid");
      setIsConfirmationOpen(true); // Still open confirmation dialog, but with an error state potentially
    }
  }, [user, createBid]);
  

  return (
    <>
      {/* Mobile Drawer */}
      {isMobile ? (
        <>
          <BackgroundGradient className="w-fit" containerClassName="w-fit">
            <Button
              variant="default"
              className="relative z-10 font-bold"
              effect={"shine"}
              onClick={() => handleOpenChange(true)}
            >
              <Plus className="h-4 w-4" />
              {mode === "book" ? "Book Now" : "Create a Bid"}
            </Button>
          </BackgroundGradient>

          <CreateBookingMobileDialogue
            isOpen={isOpen}
            onOpenChange={handleOpenChange}
            mode={mode}
            initialService={initialService}
            formState={formState}
            setFormState={setFormState}
            categories={categories}
            categoriesLoading={categoriesLoading}
            isLoading={isLoading}
            isLoadingAvailability={isLoadingAvailability}
            isDateAvailable={isDateAvailable}
            handleDateSelect={handleDateSelect}
            handleSaveBooking={handleSaveBooking}
          />
        </>
      ) : (
        /* Desktop Dialog */
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <BackgroundGradient className="w-fit" containerClassName="w-fit">
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="relative z-10 font-bold"
                effect={"shine"}
              >
                <Plus className="h-4 w-4" />
                {mode === "book" ? "Book Now" : "Create a Bid"}
              </Button>
            </DialogTrigger>
          </BackgroundGradient>
          <DialogContent
            className={`sm:max-w-[475px] ${mode === "bid" ? "max-h-[90vh]" : "h-[90vh]"} flex flex-col p-0`}
          >
            <div className="flex-shrink-0 p-6 pb-0">
              <DialogHeader>
                <DialogTitle>
                  {mode === "book" ? "Book Service" : "New Bid"}
                </DialogTitle>
                <DialogDescription>
                  {mode === "book"
                    ? "Book this service directly."
                    : "Create a new bid for a service."}
                </DialogDescription>
              </DialogHeader>
            </div>

            <ScrollArea className="flex-1 px-6">
              <div className="grid gap-4 py-4">
                {mode === "book" ? (
                  <ServiceCard service={initialService!} compact />
                ) : (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="service" className="text-right">
                      Service
                    </Label>
                    <Select
                      onValueChange={(value) => {
                        if (isBidForm(formState)) {
                          const category = categories?.find(
                            (s) => s.id.toString() === value,
                          );
                          setFormState((prev) => ({
                            ...prev,
                            category: category ?? null,
                          }));
                        }
                      }}
                      value={
                        isBidForm(formState)
                          ? formState.category?.id?.toString()
                          : undefined
                      }
                    >
                      <SelectTrigger
                        className="col-span-3 w-full"
                        disabled={isLoading}
                      >
                        <SelectValue placeholder="Select a category">
                          {isBidForm(formState)
                            ? (formState.category?.title ?? "Select a category")
                            : "Select a category"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading categories...
                          </SelectItem>
                        ) : categories?.length ? (
                          categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.title || `Category #${category.id}`}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-categories" disabled>
                            No categories available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <div className="col-span-3">
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!formState.date && "text-muted-foreground"}`}
                      onClick={() => handleDateSelect(new Date())}
                      disabled={mode === "book"}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {isLoadingAvailability ? (
                        <Skeleton className="h-4 w-[100px]" />
                      ) : formState.date ? (
                        format(formState.date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </div>
                </div>

                {isLoadingAvailability ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  mode !== "bid" && (
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={formState.date}
                        onSelect={handleDateSelect}
                        className="rounded-md border"
                        disabled={
                          mode === "book"
                            ? (date) => {
                                const isAvailable = isDateAvailable(date);
                                console.log("Is available:", isAvailable);
                                return !isAvailable;
                              }
                            : (date) =>
                                format(date, "yyyy-MM-dd") !==
                                format(new Date(), "yyyy-MM-dd")
                        }
                        modifiers={
                          mode === "book"
                            ? {
                                available: (date) => {
                                  return isDateAvailable(date);
                                },
                              }
                            : {
                                available: (date) =>
                                  format(date, "yyyy-MM-dd") ===
                                  format(new Date(), "yyyy-MM-dd"),
                              }
                        }
                        modifiersClassNames={{
                          available: "bg-green-100 hover:bg-green-200",
                        }}
                      />
                    </div>
                  )
                )}

                <div className="flex flex-col gap-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={formState.address}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="Enter your complete address (e.g., Building name, Street, Area, City)"
                    className={`${formState.address.trim() &&
                      !validateAddress(formState.address).isValid
                        ? "border-red-500 focus:border-red-500"
                        : ""
                      }`}
                  />
                  {formState.address.trim() &&
                    !validateAddress(formState.address).isValid && (
                      <p className="text-sm text-red-500">
                        {validateAddress(formState.address).message}
                      </p>
                    )}
                </div>
              </div>
            </ScrollArea>

            <div className="flex-shrink-0 p-6 pt-0">
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleSaveBooking}
                  disabled={
                    !validateAddress(formState.address).isValid ||
                    (mode === "book"
                      ? !initialService || !formState.date
                      : !isBidForm(formState) ||
                        !formState.category ||
                        !formState.date)
                  }
                >
                  Continue
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <PlaceOrderResponsive
        isOpen={isPlaceOrderOpen}
        onClose={() => setIsPlaceOrderOpen(false)}
        onContinue={handlePlaceOrderContinue}
        service={
          isBookingForm(formState)
            ? (formState.service ?? undefined)
            : undefined
        }
      />

      <StartBookingResponsive
        isOpen={isStartBookingOpen}
        onClose={() => setIsStartBookingOpen(false)}
        onSubmitBid={handleBidPlacement}
        service={
          isBookingForm(formState)
            ? (formState.service ?? undefined)
            : undefined
        }
        isLoading={createBid.isPending}
      />

      <BookingDirectConfirmation
        isOpen={isBookingConfirmationOpen}
        onClose={() => {
          setIsBookingConfirmationOpen(false);
          resetForm();
          if (!isBookingLoading && bookingDetails && bookingDetails.paymentStatus === "paid") { 
            router.push("/bookings");
          }
        }}
        bookingDetails={bookingDetails}
        isLoading={isBookingLoading}
        deductionInfo={deductionInfo}
      />

      <BookingConfirmation
        isOpen={isConfirmationOpen}
        onClose={() => {
          setIsConfirmationOpen(false);
          resetForm();
        }}
        bidDetails={bidDetails}
      />

      {/* Payment Gateway Dialog */}
      <PaymentGatewayDialog
        isOpen={isPaymentOpen}
        onOpenChange={(open) => {
          if (!open) {
            handlePaymentClose();
          } else {
            setIsPaymentOpen(true);
          }
        }}
        paymentUrl={paymentUrl}
        handlePaymentClose={handlePaymentClose}
        title="Complete Payment" 
      />
    </>
  );
}
