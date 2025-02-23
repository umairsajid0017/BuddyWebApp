import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CURRENCY } from "@/utils/constants";

interface Offer {
  id: number;
  worker_name: string;
  rating: number;
  description: string;
  price: number;
  created_at: string;
}

interface BidOffersProps {
  isOpen: boolean;
  onClose: () => void;
  offers: Offer[];
}

export function BidOffers({ isOpen, onClose, offers }: BidOffersProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Offers ({offers.length})</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {offers.map((offer) => (
            <div key={offer.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{offer.worker_name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{offer.rating}</span>
                  </div>
                </div>
                <span className="font-semibold">
                  {CURRENCY} {offer.price}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{offer.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Message</Button>
                  <Button size="sm">Accept Offer</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
} 