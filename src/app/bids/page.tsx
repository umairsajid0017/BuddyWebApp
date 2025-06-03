"use client";

import {
  useCancelBid,
  useBidResponses,
  useDirectAsCustomer,
  useAllCustomerBids,
  useCheckDeduction,
  useInitPaymentGateway,
  useGetPaymentInfo,
} from "@/apis/apiCalls";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { BidStatus, CURRENCY, PaymentStatus } from "@/constants/constantValues";
import { Bid, Offer } from "@/types/bid-types";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { BidOffers } from "@/components/BidOffers";
import Main from "@/components/ui/main";
import { ImageViewer } from "@/components/ImageViewer";
import { PaymentGatewayDialog } from "@/components/common/payment-gateway-dialog";
import { AddToWalletData } from "@/apis/api-request-types";
import { LoadingBids } from "@/components/bids/LoadingBids";
import { NoBidsView } from "@/components/bids/NoBidsView";
import { BidCard } from "@/components/bids/BidCard";

const DISPLAY_TABS = [
  {
    key: "active",
    label: "Active",
  },
  {
    key: "inactive", 
    label: "Inactive",
  },
] as const;

type BidTabKey = (typeof DISPLAY_TABS)[number]["key"];

const BidsPage = () => {
  const [currentTabKey, setCurrentTabKey] = useState<BidTabKey>("active");
  const acceptOffer = useDirectAsCustomer();
  const cancelBid = useCancelBid();
  const { toast } = useToast();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBidToCancel, setSelectedBidToCancel] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showOffers, setShowOffers] = useState(false);
  const [selectedBidForOffers, setSelectedBidForOffers] = useState<number | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: allBidsData, isLoading, error, refetch } = useAllCustomerBids();

  const checkDeduction = useCheckDeduction();
  const paymentGatewayMutation = useInitPaymentGateway();
  const getPaymentInfoMutation = useGetPaymentInfo();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [currentPaymentId, setCurrentPaymentId] = useState<number | null>(null);
  const [pendingOfferAcceptance, setPendingOfferAcceptance] = useState<{ offerId: number; bidId: number; offerAmount: string } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const filteredBids = useMemo(() => {
    if (!allBidsData?.records) return [];
    if (currentTabKey === "active") {
      return allBidsData.records.filter((bid: Bid) => bid.status === BidStatus.OPEN);
    } else {
      return allBidsData.records.filter(
        (bid: Bid) =>
          bid.status !== BidStatus.OPEN &&
          bid.status !== BidStatus.CANCELED &&
          bid.status !== BidStatus.TIMEOUT_CANCELED &&
          bid.status !== BidStatus.CANCELED_BY_WORKER &&
          bid.status !== BidStatus.CANCELED_BY_CUSTOMER,
      );
    }
  }, [allBidsData?.records, currentTabKey]);

  const { data: bidResponsesData, isLoading: isLoadingResponses, error: responsesError } = useBidResponses(selectedBidForOffers);
  
  const handleCancelBidConfirm = async () => {
    if (!selectedBidToCancel || !cancelReason.trim()) return;
    try {
      await cancelBid.mutateAsync({
        bid_id: selectedBidToCancel,
        bid_canceled_reason: cancelReason,
      });
      toast({
        title: "Bid Canceled",
        description: "Your bid has been successfully canceled.",
      });
      setCancelDialogOpen(false);
      setSelectedBidToCancel(null);
      setCancelReason("");
      refetch(); 
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel bid. Please try again.",
        variant: "destructive",
      });
    }
  };

  const executeActualOfferAcceptance = async (offerId: number, bidId: number, status: number, transactionNum?: string) => {
    setIsProcessingPayment(true);
    try {
      const payload: { response_id: number; bid_id: number; status: number; transaction_number?: string; } = {
        response_id: offerId,
        bid_id: bidId,
        status: status, 
        transaction_number: transactionNum,
      };
      const response = await acceptOffer.mutateAsync(payload);
      const toastTitle = status === 1 ? "Offer Accepted" : "Offer Rejected";
      const toastDescription = status === 1 
        ? response.message || "The offer has been successfully accepted."
        : response.message || "The offer has been rejected.";
      
      toast({
        title: toastTitle,
        description: toastDescription,
      });
      refetch();
      setShowOffers(false);
      setSelectedBidForOffers(null);
    } catch (error: any) {
      const errorTitle = status === 1 ? "Error Accepting Offer" : "Error Rejecting Offer";
      const errorDescription = status === 1
        ? error.message || "Failed to accept the offer. Please try again."
        : error.message || "Failed to reject the offer. Please try again.";
        
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
      setPendingOfferAcceptance(null);
      setIsPaymentOpen(false);
      setPaymentUrl("");
      setCurrentPaymentId(null);
    }
  };

  const handlePaymentCloseForBidAcceptance = useCallback(async () => {
    const paymentIdToCheck = currentPaymentId;
    const pendingAcceptanceDetails = pendingOfferAcceptance;

    setIsPaymentOpen(false); 
    setPaymentUrl("");

    if (!paymentIdToCheck || !pendingAcceptanceDetails) {
      toast({
        title: "Payment Incomplete",
        description: "Payment session ended or details are missing. The offer was not accepted.",
      });
      setIsProcessingPayment(false);
      setPendingOfferAcceptance(null);
      setCurrentPaymentId(null);
      return;
    }

    setIsProcessingPayment(true);
    try {
      const paymentInfo = await getPaymentInfoMutation.mutateAsync({ payment_id: paymentIdToCheck });
      if (paymentInfo.error || paymentInfo.records.status !== PaymentStatus.PAID) {
        const statusMessage = paymentInfo.records.status ? `Status: ${paymentInfo.records.status}.` : "Could not verify payment success.";
        toast({
          title: "Payment Not Successful",
          description: `${statusMessage} The offer cannot be accepted.`,
          variant: "destructive",
        });
      } else {
        const transactionNumber = paymentInfo.records.transaction_id;
        toast({
          title: "Payment Verified",
          description: "Payment was successful. Proceeding to accept the offer.",
        });
        await executeActualOfferAcceptance(pendingAcceptanceDetails.offerId, pendingAcceptanceDetails.bidId, 1, transactionNumber);
      }
    } catch (error: any) {
      toast({
        title: "Payment Verification Error",
        description: error.message || "An error occurred while verifying payment status. The offer was not accepted.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
      setPendingOfferAcceptance(null);
      setCurrentPaymentId(null);
    }
  }, [currentPaymentId, pendingOfferAcceptance, getPaymentInfoMutation, toast, refetch, acceptOffer]);

  const handleAcceptOffer = async (offerId: number, accept: boolean) => {
    if (!selectedBidForOffers) {
      toast({ title: "Error", description: "No bid selected for offers.", variant: "destructive" });
      return;
    }

    if (!accept) { 
      await executeActualOfferAcceptance(offerId, selectedBidForOffers, 0, undefined);
      
      return;
    }


    const selectedOffer = bidResponsesData?.records?.find(offer => offer.id === offerId);
    if (!selectedOffer || typeof selectedOffer.proposed_price === 'undefined') { 
        toast({ title: "Error", description: "Offer details or price not found.", variant: "destructive" });
        return;
    }
    const offerPriceStr = selectedOffer.proposed_price.toString();

    setIsProcessingPayment(true);
    setPendingOfferAcceptance({ offerId, bidId: selectedBidForOffers, offerAmount: offerPriceStr });

    try {
      const deductionResult = await checkDeduction.mutateAsync({
        amount_omr: offerPriceStr,
      });

      if (parseFloat(deductionResult.deduct_amount) > 0) {
        const paymentData: AddToWalletData = {
          amount: deductionResult.deduct_amount,
          payment_method_id: "1", 
          comment: `Payment for accepting offer on bid #${selectedBidForOffers}`,
          order_total_amount: parseFloat(offerPriceStr), 
          action: "order_deduction", 
        };
        const paymentInitResult = await paymentGatewayMutation.mutateAsync(paymentData);

        if (!paymentInitResult.error && paymentInitResult.pay_url) {
          setPaymentUrl(paymentInitResult.pay_url);
          setCurrentPaymentId(paymentInitResult.payment_id);
          setIsPaymentOpen(true);
        } else {
          toast({
            title: "Payment Initialization Failed",
            description: paymentInitResult.message || "Could not initialize payment. Please try again.",
            variant: "destructive",
          });
          setIsProcessingPayment(false);
          setPendingOfferAcceptance(null);
        }
      } else {
        toast({
          title: "No Payment Required",
          description: "Proceeding to accept the offer directly.",
        });
        await executeActualOfferAcceptance(offerId, selectedBidForOffers, 1, undefined); 
      }
    } catch (error: any) {
      toast({
        title: "Error Processing Offer Acceptance",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsProcessingPayment(false);
      setPendingOfferAcceptance(null);
    }
  };

  const handleShowBidOffers = (bidId: number) => {
    if (currentTabKey !== "active") {
      toast({
        title: "Not Available",
        description: "Bid offers are only available for active bids.",
        variant: "destructive",
      });
      return;
    }
    setSelectedBidForOffers(bidId);
    setShowOffers(true);
  };

  const handleCancelBidInitiate = (bidId: number) => {
    setSelectedBidToCancel(bidId);
    setCancelDialogOpen(true);
  };

  const handlePlayAudio = (bidId: number | null) => {
    setPlayingAudioId(bidId);
  };

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  if (isLoading) {
    return (
      <Main>
        <div className="container mx-auto space-y-6 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">My Bids</h1>
          </div>
          <LoadingBids />
        </div>
      </Main>
    );
  }

  if (error) {
    return (
      <Main>
        <div className="container mx-auto p-6">
          <h1 className="mb-6 text-3xl font-bold tracking-tight">My Bids</h1>
          <div className="p-6 border border-destructive/20 rounded-md shadow-md">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-destructive">
                Error Loading Bids
              </h3>
              <p className="text-muted-foreground">
                Please try again later or contact support if the problem persists.
              </p>
            </div>
          </div>
        </div>
      </Main>
    );
  }

  return (
    <Main>
      <div className="container mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Bids</h1>
        </div>
        
        <Tabs
          value={currentTabKey}
          onValueChange={(value) => setCurrentTabKey(value as BidTabKey)}
        >
          <TabsList className="mb-4">
            {DISPLAY_TABS.map(({ key, label }) => (
              <TabsTrigger  key={key} value={key}
              onClick={()=> refetch()}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {DISPLAY_TABS.map(({ key, label }) => (
            <TabsContent key={key} value={key}>
              <ScrollArea className="h-[calc(100vh-200px)]">
                {isLoading ? (
                  <LoadingBids />
                ) : filteredBids.length > 0 ? (
                  <div className="space-y-6">
                    {filteredBids.map((bid: Bid) => {
                      const isActiveBid = currentTabKey === "active";
                      return (
                        <BidCard 
                          key={bid.id}
                          bid={bid}
                          isActiveBid={isActiveBid}
                          playingAudioId={playingAudioId}
                          onShowOffers={handleShowBidOffers}
                          onCancelBidInitiate={handleCancelBidInitiate}
                          onPlayAudio={handlePlayAudio}
                          onSelectImage={handleSelectImage}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <NoBidsView tabLabel={label} />
                )}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Bid</DialogTitle>
            <DialogDescription>
              Please provide a reason for canceling this bid. This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter reason for cancellation..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false);
                setSelectedBidToCancel(null);
                setCancelReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBidConfirm}
              disabled={!cancelReason.trim() || cancelBid.isPending}
            >
              {cancelBid.isPending ? "Canceling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImageViewer
        src={selectedImage || ""}
        alt="Bid image"
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <BidOffers
        isOpen={showOffers}
        onClose={() => {
          setShowOffers(false);
          setSelectedBidForOffers(null);
        }}
        offers={bidResponsesData?.records}
        isLoading={isLoadingResponses} 
        error={responsesError}
        message={bidResponsesData?.message}
        handleAcceptOffer={handleAcceptOffer} 
        isAcceptingOffer={isProcessingPayment}
      />

      <PaymentGatewayDialog
        isOpen={isPaymentOpen}
        onOpenChange={(open) => {
          if (!open && currentPaymentId) { 
            handlePaymentCloseForBidAcceptance();
          } else if (open && paymentUrl) {
            setIsPaymentOpen(true);
          } else {
            setIsPaymentOpen(open);
          }
        }}
        paymentUrl={paymentUrl}
        handlePaymentClose={handlePaymentCloseForBidAcceptance} 
        title="Complete Payment for Offer"
      />
    </Main>
  );
};

export default BidsPage;

