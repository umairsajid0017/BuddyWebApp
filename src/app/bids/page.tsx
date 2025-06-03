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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Clock,
  MoreVertical,
  PlayCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { BidStatus, CURRENCY } from "@/constants/constantValues";
import { Bid, Offer } from "@/types/bid-types";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { BidOffers } from "@/components/BidOffers";
import Main from "@/components/ui/main";
import { ImageViewer } from "@/components/ImageViewer";
import { getImageUrl, getStatusBadgeProps } from "@/helpers/utils";
import { PaymentGatewayDialog } from "@/components/common/payment-gateway-dialog";
import { AddToWalletData } from "@/apis/api-request-types";

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


const LoadingBids = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-[300px]" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </Card>
    ))}
  </div>
);

const NoBidsView: React.FC<{ tabLabel: string }> = ({ tabLabel }) => (
  <Card className="border-destructive/20 shadow-md">
    <CardContent className="flex flex-col items-center justify-center px-6 pb-4 pt-6">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-destructive">
        No {tabLabel} Bids Found
      </h3>
      <p className="max-w-md text-center text-muted-foreground">
        You don&apos;t have any {tabLabel.toLowerCase()} bids at the moment.
      </p>
    </CardContent>
  </Card>
);

const BidsPage = () => {
  const [currentTabKey, setCurrentTabKey] = useState<BidTabKey>("active");
  const acceptOffer = useDirectAsCustomer();
  const cancelBid = useCancelBid();
  const { toast } = useToast();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showOffers, setShowOffers] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch all bids
  const { data: allBidsData, isLoading, error, refetch } = useAllCustomerBids();

  // Payment Flow State
  const checkDeduction = useCheckDeduction();
  const paymentGatewayMutation = useInitPaymentGateway();
  const getPaymentInfoMutation = useGetPaymentInfo();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [currentPaymentId, setCurrentPaymentId] = useState<number | null>(null);
  const [currentTransactionNumber, setCurrentTransactionNumber] = useState<string | undefined>(undefined);
  const [pendingOfferAcceptance, setPendingOfferAcceptance] = useState<{ offerId: number; bidId: number; offerAmount: string } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Filter bids based on current tab
  const filteredBids = useMemo(() => {
    if (!allBidsData?.records) return [];
    
    if (currentTabKey === "active") {
      // Active tab: only OPEN status bids
      return allBidsData.records.filter((bid: Bid) => bid.status === BidStatus.OPEN);
    } else {
      // Inactive tab: all non-OPEN status bids
      return allBidsData.records.filter((bid: Bid) => bid.status !== BidStatus.OPEN);
    }
  }, [allBidsData?.records, currentTabKey]);

  // Debug logging
  console.log("Current tab:", currentTabKey);
  console.log("All bids:", allBidsData?.records);
  console.log("Filtered bids:", filteredBids);

  const {
    data: bidResponsesData,
    isLoading: isLoadingResponses,
    error: responsesError,
  } = useBidResponses(selectedBid);

  console.log("bidResponsesData", bidResponsesData);
  
  const handleCancelBid = async () => {
    if (!selectedBid || !cancelReason.trim()) return;

    try {
      await cancelBid.mutateAsync({
        bid_id: selectedBid,
        bid_canceled_reason: cancelReason,
      });

      toast({
        title: "Bid Canceled",
        description: "Your bid has been successfully canceled.",
      });

      // Reset state and refetch bids
      setCancelDialogOpen(false);
      setSelectedBid(null);
      setCancelReason("");
      refetch(); // Refetch all bids
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel bid. Please try again.",
        variant: "destructive",
      });
    }
  };

  const executeActualOfferAcceptance = async (offerId: number, bidId: number, transactionNum?: string) => {
    try {
      const payload: { response_id: number; bid_id: number; status: number; transaction_number?: string; } = {
        response_id: offerId,
        bid_id: bidId,
        status: 1, // 1 for accepting
        transaction_number: transactionNum,
      };
      const response = await acceptOffer.mutateAsync(payload);
      toast({
        title: "Offer Accepted",
        description: response.message || "The offer has been successfully accepted.",
      });
      refetch();
      setShowOffers(false); // Close the offers panel
      setSelectedBid(null);
    } catch (error: any) {
      toast({
        title: "Error Accepting Offer",
        description: error.message || "Failed to accept the offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
      setPendingOfferAcceptance(null);
    }
  };

  const handlePaymentCloseForBidAcceptance = useCallback(async () => {
    const paymentIdToCheck = currentPaymentId;
    const pendingAcceptanceDetails = pendingOfferAcceptance;

    setIsPaymentOpen(false);
    setPaymentUrl("");
    setCurrentPaymentId(null);
    setCurrentTransactionNumber(undefined);

    if (!paymentIdToCheck || !pendingAcceptanceDetails) {
      toast({
        title: "Payment Incomplete",
        description: "Payment session ended or details are missing. The offer was not accepted.",
      });
      setIsProcessingPayment(false);
      setPendingOfferAcceptance(null);
      return;
    }

    setIsProcessingPayment(true);
    try {
      const paymentInfo = await getPaymentInfoMutation.mutateAsync({ payment_id: paymentIdToCheck });

      if (paymentInfo.error || paymentInfo.records.status !== "paid") {
        const statusMessage = paymentInfo.records.status ? `Status: ${paymentInfo.records.status}.` : "Could not verify payment success.";
        toast({
          title: "Payment Not Successful",
          description: `${statusMessage} The offer cannot be accepted.`,
          variant: "destructive",
        });
        setIsProcessingPayment(false);
        setPendingOfferAcceptance(null);
        return;
      }

      const transactionNumber = paymentInfo.records.transaction_id;
      toast({
        title: "Payment Verified",
        description: "Payment was successful. Proceeding to accept the offer.",
      });
      await executeActualOfferAcceptance(pendingAcceptanceDetails.offerId, pendingAcceptanceDetails.bidId, transactionNumber);

    } catch (error: any) {
      toast({
        title: "Payment Verification Error",
        description: error.message || "An error occurred while verifying payment status. The offer was not accepted.",
        variant: "destructive",
      });
      setIsProcessingPayment(false);
      setPendingOfferAcceptance(null);
    }
  }, [currentPaymentId, pendingOfferAcceptance, getPaymentInfoMutation, toast, refetch, acceptOffer, executeActualOfferAcceptance]);

  const handleAcceptOffer = async (offerId: number, accept: boolean) => {
    if (!accept) { 
      toast({ title: "Offer Rejected", description: "The offer has been marked as not accepted." });
      return;
    }

    if (!selectedBid) {
      toast({ title: "Error", description: "No bid selected.", variant: "destructive" });
      return;
    }

    const selectedOffer = bidResponsesData?.records?.find(offer => offer.id === offerId);
    if (!selectedOffer || typeof selectedOffer.proposed_price === 'undefined') {
        toast({ title: "Error", description: "Offer details or price not found.", variant: "destructive" });
        return;
    }
    const offerPriceStr = selectedOffer.proposed_price.toString();

    setIsProcessingPayment(true);
    setPendingOfferAcceptance({ offerId, bidId: selectedBid, offerAmount: offerPriceStr });

    try {
      const deductionResult = await checkDeduction.mutateAsync({
        amount_omr: offerPriceStr,
      });

      if (parseFloat(deductionResult.deduct_amount) > 0) {
        const paymentData: AddToWalletData = {
          amount: deductionResult.deduct_amount,
          payment_method_id: "1", 
          comment: `Payment for accepting offer on bid #${selectedBid}`,
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
        await executeActualOfferAcceptance(offerId, selectedBid, undefined); 
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
    
    setSelectedBid(bidId);
    setShowOffers(true);
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
          <Card className="p-6">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-destructive">
                Error Loading Bids
              </h3>
              <p className="text-muted-foreground">
                Please try again later or contact support if the problem persists.
              </p>
            </div>
          </Card>
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
                      const statusProps = getStatusBadgeProps(bid.status);
                      const isActiveBid = currentTabKey === "active";
                      
                      return (
                        <Card key={bid.id} className="">
                          <div className="border-b p-6">
                            <div className="flex items-start justify-between">
                              <div
                                className={`space-y-4 ${isActiveBid ? "cursor-pointer" : ""}`}
                                onClick={() => {
                                  if (isActiveBid) {
                                    handleShowBidOffers(bid.id);
                                  }
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <h3 className="text-xl font-semibold">
                                    {bid.service?.name || 'Service Unavailable'}
                                  </h3>

                                  <Badge
                                    className="font-regular text-xs"
                                    variant={statusProps.variant as any}
                                  >
                                    {statusProps.label}
                                  </Badge>
                                </div>
                                <Badge className="bg-secondary px-3 py-1 hover:bg-secondary-800">
                                  {CURRENCY} {bid.expected_price}
                                </Badge>
                                <p className="max-w-2xl text-muted-foreground">
                                  {bid.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {formatDistanceToNow(new Date(bid.created_at), {
                                      addSuffix: true,
                                    })}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {bid.address}
                                  </div>
                                </div>
                                {bid.bid_canceled_reason && (
                                  <p className="text-sm text-destructive">
                                    Cancellation reason: {bid.bid_canceled_reason}
                                  </p>
                                )}
                              </div>
                              <div className="flex h-full flex-col gap-8 justify-between">
                                <div className="flex items-center gap-4">
                                  {bid.images && bid.images.length > 0 && (
                                    <div className="flex gap-2">
                                      {bid.images.map((image) => (
                                        <div
                                          key={image.id}
                                          className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-lg"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage(getImageUrl(image.name));
                                          }}
                                        >
                                          <Image
                                            src={getImageUrl(image.name)}
                                            alt="Bid image"
                                            fill
                                            className="object-cover transition-transform hover:scale-110"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {isActiveBid && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          disabled={bid.status !== BidStatus.OPEN}
                                        >
                                          <MoreVertical className="h-5 w-5" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          className="text-destructive"
                                          onClick={() => {
                                            setSelectedBid(bid.id);
                                            setCancelDialogOpen(true);
                                          }}
                                        >
                                          Cancel Bid
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                                {isActiveBid && (
                                  <Button
                                    variant="default"
                                    size="default"
                                    onClick={() => handleShowBidOffers(bid.id)}
                                    disabled={bid.status !== BidStatus.OPEN}
                                  >
                                    View Offers
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          {bid.audio && (
                            <div className="bg-muted/50 p-4">
                              {playingAudioId === bid.id ? (
                                <audio
                                  controls
                                  className="h-10 w-full"
                                  style={{
                                    colorScheme: "normal",
                                  }}
                                  onEnded={() => setPlayingAudioId(null)}
                                  autoPlay
                                >
                                  <source
                                    src={`${process.env.NEXT_PUBLIC_AUDIO_URL}/${bid.audio}`}
                                    type="audio/wav"
                                  />
                                  Your browser does not support the audio element.
                                </audio>
                              ) : (
                                <Button
                                  variant="outline"
                                  className="flex items-center justify-center gap-2"
                                  onClick={() => setPlayingAudioId(bid.id)}
                                >
                                  <PlayCircle className="h-5 w-5" />
                                  Play Audio
                                </Button>
                              )}
                            </div>
                          )}
                        </Card>
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
                setSelectedBid(null);
                setCancelReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBid}
              disabled={!cancelReason.trim()}
            >
              Confirm Cancellation
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
          setSelectedBid(null);
        }}
        offers={bidResponsesData?.records}
        isLoading={isLoadingResponses}
        error={responsesError}
        message={bidResponsesData?.message}
        handleAcceptOffer={handleAcceptOffer}
      />

      <PaymentGatewayDialog
        isOpen={isPaymentOpen}
        onOpenChange={(open) => {
          if (!open && currentPaymentId) {
            handlePaymentCloseForBidAcceptance();
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
