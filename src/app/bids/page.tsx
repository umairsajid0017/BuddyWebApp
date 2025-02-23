"use client";

import { useCustomerBids } from "@/lib/api/bids";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, MoreVertical } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CURRENCY } from "@/utils/constants";

const BidsPage = () => {
  const { data: bidsData, isLoading, error } = useCustomerBids();

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Bids</h1>
          {/* <Button>Create New Bid</Button> */}
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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Bids</h1>
        {/* <Button>Create New Bid</Button> */}
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-6">
          {bidsData?.records.map((bid) => (
            <Card key={bid.id} className="overflow-hidden">
              <div className="border-b p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">
                        {bid.category.title}
                      </h3>
                      <Badge className="bg-primary px-3 py-1 text-primary-foreground">
                        {CURRENCY} {bid.expected_price}
                      </Badge>
                    </div>
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
                  </div>
                  <div className="flex items-center gap-4">
                    {bid.images && bid.images.length > 0 && (
                      <div className="flex gap-2">
                        {bid.images.map((image) => (
                          <div
                            key={image.id}
                            className="relative h-24 w-24 overflow-hidden rounded-lg"
                          >
                            <Image
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${image.name}`}
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
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Bid</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete Bid
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              {bid.audio && (
                <div className="bg-muted/50 p-4">
                  <audio
                    controls
                    className="h-10 w-full"
                    style={{
                      colorScheme: "normal",
                    }}
                  >
                    <source src={`/api/audio/${bid.audio}`} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BidsPage;
