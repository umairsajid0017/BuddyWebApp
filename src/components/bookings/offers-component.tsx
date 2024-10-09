import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Star } from 'lucide-react'

type Offer = {
  id: string
  providerName: string
  providerImage: string
  rating: number
  reviews: number
  distance: number
  price: number
}

const OfferCard: React.FC<{ offer: Offer }> = ({ offer }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={offer.providerImage} alt={offer.providerName} />
            <AvatarFallback>{offer.providerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{offer.providerName}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="ml-1">{offer.rating}</span>
              <span className="mx-1">|</span>
              <span>{offer.reviews.toLocaleString()} reviews</span>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">{offer.distance} km</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">${offer.price}</div>
      </CardContent>
      <CardFooter className="flex justify-between space-x-2">
        <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-white">
          Decline
        </Button>
        <Button className="flex-1 bg-primary text-white ">
          Accept
        </Button>
      </CardFooter>
    </Card>
  )
}

const OffersGrid: React.FC<{ offers: Offer[] }> = ({ offers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {offers.map(offer => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  )
}

export default OffersGrid;