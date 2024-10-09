import OffersGrid from "@/components/bookings/offers-component"
import Main from "@/components/ui/main"

type Offer = {
    id: string
    providerName: string
    providerImage: string
    rating: number
    reviews: number
    distance: number
    price: number
  }
const  Offers: React.FC = () => {
    const offers: Offer[] = [
      {
        id: '1',
        providerName: 'Jenny Wilson',
        providerImage: '/assets/laundry.png',
        rating: 4.8,
        reviews: 8289,
        distance: 2.1,
        price: 224
      },
      {
        id: '2',
        providerName: 'Jenny Wilson',
        providerImage: '/assets/laundry.png',
        rating: 4.8,
        reviews: 8289,
        distance: 3.1,
        price: 200
      },
      {
        id: '3',
        providerName: 'Jenny Wilson',
        providerImage: '/assets/laundry.png',
        rating: 4.8,
        reviews: 8289,
        distance: 2.1,
        price: 224
      },
      {
        id: '4',
        providerName: 'Jenny Wilson',
        providerImage: '/assets/laundry.png',
        rating: 4.8,
        reviews: 8289,
        distance: 3.1,
        price: 200
      }
    ]
  
    return <Main>
        <h1 className="text-2xl font-bold my-4">Workers Offers</h1>
        <OffersGrid offers={offers} />
        </Main>
  }


  export default Offers;