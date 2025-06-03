import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, MapPin, MoreVertical, PlayCircle } from "lucide-react";
import { Bid } from "@/types/bid-types";
import { CURRENCY, BidStatus } from "@/constants/constantValues";
import { getImageUrl, getStatusBadgeProps } from "@/helpers/utils";

interface BidCardProps {
  bid: Bid;
  isActiveBid: boolean;
  playingAudioId: number | null;
  onShowOffers: (bidId: number) => void;
  onCancelBidInitiate: (bidId: number) => void; // Renamed to avoid conflict if a direct onCancelBid prop is added later
  onPlayAudio: (bidId: number | null) => void;
  onSelectImage: (imageUrl: string) => void;
}

export const BidCard: React.FC<BidCardProps> = ({
  bid,
  isActiveBid,
  playingAudioId,
  onShowOffers,
  onCancelBidInitiate,
  onPlayAudio,
  onSelectImage,
}) => {
  const statusProps = getStatusBadgeProps(bid.status);

  return (
    <Card key={bid.id} className="">
      <div className="border-b p-6">
        <div className="flex items-start justify-between">
          <div
            className={`space-y-4 ${isActiveBid ? "cursor-pointer" : ""}`}
            onClick={() => {
              if (isActiveBid) {
                onShowOffers(bid.id);
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
                        onSelectImage(getImageUrl(image.name));
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
                        onCancelBidInitiate(bid.id);
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
                onClick={() => onShowOffers(bid.id)}
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
              onEnded={() => onPlayAudio(null)} // Stop playing when ended
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
              onClick={() => onPlayAudio(bid.id)} // Play this bid's audio
            >
              <PlayCircle className="h-5 w-5" />
              Play Audio
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}; 