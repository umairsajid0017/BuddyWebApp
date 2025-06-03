import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Star, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CURRENCY } from "@/constants/constantValues";
import { Offer } from "@/types/bid-types";
import { Skeleton } from "@/components/ui/skeleton";

interface BidOffersProps {
  isOpen: boolean;
  onClose: () => void;
  offers: Offer[] | undefined;
  isLoading: boolean;
  error: any;
  message?: string;
  handleAcceptOffer: (offerId: number, accept: boolean) => void;
  isAcceptingOffer: boolean;
}

export function BidOffers({ isOpen, onClose, offers, isLoading, error, message, handleAcceptOffer, isAcceptingOffer }: BidOffersProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Offers ({offers?.length || 0})</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {isLoading && (
            <>
              {[...Array(3)].map((_, index) => (
                <div key={index} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-[120px]" />
                    <Skeleton className="h-6 w-[80px]" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-[80px]" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-[80px]" />
                      <Skeleton className="h-8 w-[100px]" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          
          {error && (
            <div className="text-center p-6">
              <p className="text-destructive">Failed to load offers. Please try again.</p>
              <Button className="mt-4" variant="outline" onClick={onClose}>Close</Button>
            </div>
          )}
          
          {!isLoading && !error && message && (
            <div className="text-center p-6">
              <p className="text-muted-foreground">{message}</p>
              <Button className="mt-4" variant="outline" onClick={onClose}>Close</Button>
            </div>
          )}
          
          {!isLoading && !error && offers && offers.length > 0 && offers.map((offer) => (
            <div key={offer.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{offer.worker.name}</h3>
                 
                </div>
                <span className="font-semibold">
                  {CURRENCY} {offer.proposed_price}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{offer.bid.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
                </span>
                <div className="flex gap-2">
                  {/* <Button variant="outline" size="sm">Message</Button> */}
                  <Button size="sm" variant="outline" onClick={() => handleAcceptOffer(offer.id, false)}>Reject</Button>
                  <Button size="sm" onClick={() => handleAcceptOffer(offer.id, true)} disabled={isAcceptingOffer}>{isAcceptingOffer ? "Accepting..." : "Accept"}</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
} 