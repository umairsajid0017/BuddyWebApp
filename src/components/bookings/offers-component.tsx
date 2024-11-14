"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star, MapPin, RefreshCw, CheckCircle, X } from "lucide-react";

type Offer = {
  id: string;
  providerName: string;
  providerImage: string;
  rating: number;
  reviews: number;
  distance: number;
  price: number;
  jobsDone: number;
  category: string;
};

const DeclineReasons = [
  { id: "price", label: "Price is too high" },
  { id: "schedule", label: "Schedule doesn't work for me" },
  { id: "skills", label: "Looking for different skills" },
  { id: "other", label: "Other reason" },
];

const OfferCard: React.FC<{ offer: Offer }> = ({ offer }) => {
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = React.useState(false);
  const [declineReason, setDeclineReason] = React.useState("");

  const handleDecline = () => {
    console.log("Declined for reason:", declineReason);
    setIsDeclineDialogOpen(false);
    // Here you would typically call an API to update the offer status
  };

  return (
    <Card className="flex h-[360px] w-full flex-col justify-between transition-all duration-300 hover:shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarImage src={offer.providerImage} alt={offer.providerName} />
              <AvatarFallback>
                {offer.providerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="max-w-[150px] truncate text-lg font-semibold">
                {offer.providerName}
              </h3>
              <Badge variant="secondary" className="mt-1">
                {offer.category}
              </Badge>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{offer.distance} km</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Distance from your location</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-current text-yellow-400" />
              <span className="ml-1 font-medium">
                {offer.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({offer.reviews.toLocaleString()} reviews)
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
            <span>{offer.jobsDone} jobs</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">
          ${offer.price.toFixed(2)}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Total price for this service
        </p>
      </CardContent>
      <CardFooter className="flex justify-between space-x-2">
        <Dialog
          open={isDeclineDialogOpen}
          onOpenChange={setIsDeclineDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Decline
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Decline Offer</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <RadioGroup
                value={declineReason}
                onValueChange={setDeclineReason}
              >
                {DeclineReasons.map((reason) => (
                  <div key={reason.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason.id} id={reason.id} />
                    <Label htmlFor={reason.id}>{reason.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDeclineDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleDecline} disabled={!declineReason}>
                Confirm Decline
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
};

const OffersGrid: React.FC<{ offers: Offer[] }> = ({ offers }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleReload = () => {
    setIsLoading(true);
    // Simulating an API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Available Offers</h2>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
          onClick={handleReload}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Reload Offers</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
};

export default function EnhancedOffers() {
  const sampleOffers: Offer[] = [
    {
      id: "1",
      providerName: "John Doe",
      providerImage: "https://i.pravatar.cc/150?img=1",
      rating: 4.8,
      reviews: 120,
      distance: 2.5,
      price: 75,
      jobsDone: 250,
      category: "Plumbing",
    },
    {
      id: "2",
      providerName: "Jane Smith",
      providerImage: "https://i.pravatar.cc/150?img=2",
      rating: 4.6,
      reviews: 89,
      distance: 3.7,
      price: 60,
      jobsDone: 180,
      category: "Electrical",
    },
    {
      id: "3",
      providerName: "Mike Johnson",
      providerImage: "https://i.pravatar.cc/150?img=3",
      rating: 4.9,
      reviews: 200,
      distance: 1.8,
      price: 90,
      jobsDone: 320,
      category: "Carpentry",
    },
    {
      id: "4",
      providerName: "Emily Brown",
      providerImage: "https://i.pravatar.cc/150?img=4",
      rating: 4.7,
      reviews: 150,
      distance: 4.2,
      price: 70,
      jobsDone: 210,
      category: "Painting",
    },
  ];

  return <OffersGrid offers={sampleOffers} />;
}
