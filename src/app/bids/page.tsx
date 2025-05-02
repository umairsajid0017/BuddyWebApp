"use client";

import { useCancelBid, useBidResponses, useCustomerBidsByStatus } from "@/apis/apiCalls";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, MoreVertical, PlayCircle, AlertCircle } from "lucide-react";
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
import { Bid } from "@/types/bid-types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BidOffers } from "@/components/BidOffers";
import Main from "@/components/ui/main";
import { ImageViewer } from "@/components/ImageViewer";
import { getImageUrl } from "@/helpers/utils";

const getStatusBadgeProps = (status: number) => {
  switch (status) {
    case BidStatus.OPEN:
      return { variant: "default" as const, label: "Open" };
    case BidStatus.CLOSED:
      return { variant: "secondary" as const, label: "Closed" };
    case BidStatus.CANCELED:
    case BidStatus.CANCELED_BY_WORKER:
    case BidStatus.CANCELED_BY_CUSTOMER:
    case BidStatus.TIMEOUT_CANCELED:
      return { variant: "destructive" as const, label: "Canceled" };
    case BidStatus.PENDING:
      return { variant: "outline" as const, label: "Pending" };
    case BidStatus.CONFIRMED:
      return { variant: "default" as const, label: "Confirmed" };
    case BidStatus.STARTED:
    case BidStatus.WORKER_HAS_STARTED_THE_WORK:
      return { variant: "default" as const, label: "In Progress" };
    case BidStatus.COMPLETED:
      return { variant: "success" as const, label: "Completed" };
    case BidStatus.DECLINED:
      return { variant: "destructive" as const, label: "Declined" };
    case BidStatus.WORKER_IS_ON_HIS_WAY:
      return { variant: "default" as const, label: "Worker En Route" };
    case BidStatus.WORKER_IS_ON_YOUR_DOORSTEP:
      return { variant: "default" as const, label: "Worker Arrived" };
    case BidStatus.NOT_STARTED:
      return { variant: "outline" as const, label: "Not Started" };
    default:
      return { variant: "secondary" as const, label: "Unknown" };
  }
};

const BidsPage = () => {
  const { data: bidsData, isLoading, error, refetch } = useCustomerBidsByStatus(BidStatus.OPEN);
  const cancelBid = useCancelBid();
  const { toast } = useToast();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showOffers, setShowOffers] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { 
    data: bidResponsesData, 
    isLoading: isLoadingResponses, 
    error: responsesError 
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
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel bid. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Bids</h1>
        </div>
        {[...Array(3)].map((_, i) => (
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
  }

  if (error) {
    return (
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
    );
  }

 if (bidsData && !bidsData?.records) {
   return (
     <div className="container mx-auto max-w-4xl p-6">
       <h1 className="mb-6 text-3xl font-bold tracking-tight">My Bids</h1>

       <Card className="border-destructive/20 shadow-md">
         <CardContent className="flex flex-col items-center justify-center px-6 pb-4 pt-6">
           <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
             <AlertCircle className="h-8 w-8 text-destructive" />
           </div>

           <h3 className="mb-2 text-xl font-semibold text-destructive">
             Unable to Load Bids
           </h3>

           <p className="max-w-md text-center text-muted-foreground">
             {bidsData?.message ||
               "There was an error loading your bids. Please try again later."}
           </p>
         </CardContent>

         <CardFooter className="flex justify-center pb-6">
           <Button
             variant="outline"
             className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
             onClick={() => refetch()}
           >
             Try Again
           </Button>
         </CardFooter>
       </Card>
     </div>
   );
 }

  return (
    <Main>
      <div className="container mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Bids</h1>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">
            {bidsData && bidsData?.records && bidsData?.records?.map((bid: Bid) => {
              const statusProps = getStatusBadgeProps(bid.status);
              return (
                <Card key={bid.id} className="overflow-hidden">
                  <div className="border-b p-6">
                    <div className="flex items-start justify-between">
                      <div 
                        className="space-y-4 cursor-pointer" 
                        onClick={() => {
                          setSelectedBid(bid.id);
                          setShowOffers(true);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold">
                            {bid.category.title}
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
                      <div className="flex items-center gap-4">
                        {bid.images && bid.images.length > 0 && (
                          <div className="flex gap-2">
                            {bid.images.map((image) => (
                              <div
                                key={image.id}
                                className="relative h-24 w-24 overflow-hidden rounded-lg cursor-pointer"
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
                            {
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedBid(bid.id);
                                  setCancelDialogOpen(true);
                                }}
                              >
                                Cancel Bid
                              </DropdownMenuItem>
                            }
                          </DropdownMenuContent>
                        </DropdownMenu>
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
        </ScrollArea>
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

      {/* Image Viewer */}
      <ImageViewer
        src={selectedImage || ""}
        alt="Bid image"
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {/* Offers Panel */}
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
      />
    </Main>
  );
};

export default BidsPage;
