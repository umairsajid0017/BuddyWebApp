import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import NavBar from "@/components/ui/navbar"
import { JSX, SVGProps, useEffect } from "react"
import PopularServices from "../services/popular-services"
import useServicesStore from "@/store/servicesStore"
import DashboardSkeleton from "./dashboard-skeleton"
import { useServices } from "@/lib/api"
import TooltipWrapper from "../ui/tooltip-wrapper"
import DashboardStats from "./dashboard-stats"
import kebabCase from "@/utils/helper-functions"
import CardStack from "../ui/card-stack"

type ImageItem = {
  src: string
  alt: string
}
const images: ImageItem[] = [
  { src: "/assets/promo-2.png", alt: "Image 1" },
  { src: "/assets/cleaning.png", alt: "Image 2" },
  { src: "/assets/laundry.png", alt: "Image 3" },
  { src: "/assets/garage.png", alt: "Image 4" },
  // { src: "/assets/promo-2.png", alt: "Image 5" },
]

export function DashboardComponent() {
  const {data: servicesResponse, isLoading, error } = useServices();
  const { 
    services, 
    setServices, 
    setLoading, 
    setError,
    deleteService 
  } = useServicesStore();

  useEffect(()=>{
    if (servicesResponse) {
      setServices(servicesResponse.data);
    }
    setLoading(isLoading);
    setError(error ? error.message : null);
  }, [services, isLoading, error, setServices, setLoading, setError])
  
  if(isLoading)
    return <DashboardSkeleton/>

  return (
    <div className="flex flex-col min-h-screen lg:px-24 md:mx-8 ">
      <main className="flex-1 p-6">
       <DashboardStats/>
        <section className="flex flex-col lg:flex-row gap-4 mt-6">
      <div className="relative flex-1   rounded-lg shadow p-8 flex flex-col justify-center">
        <Image src={"/assets/search-bg.svg"} alt="Search" width={"300"} height={"300"} className="absolute h-full w-full top-0 left-0 -z-10 object-cover rounded-lg"/>
        <div className="absolute top-0 left-0 rounded-lg w-full h-full bg-[#F3EEF5] -z-20"/>
        <div className="text-center">
          <h3 className="text-2xl font-semibold">
            Start booking service to <br className="hidden sm:inline" /> get your work done!
          </h3>
        </div>
        <div className="mt-4 w-full flex items-center justify-center">
          <Input type="text" placeholder="Search services" className="w-full md:w-10/12 h-14" />
        </div>

      </div>
      <div className="lg:w-1/3 h-48 md:h-64 bg-red-100 rounded-lg shadow p-0 flex flex-col justify-center">
      <CardStack
        items={images}
        renderItem={(item) => (
          <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
        )}
        interval={2000}
      />
      </div>
    </section>
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">All Categories</h3>
            <Button variant="link" className="text-sm">
              See All
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-4">
            {services.slice(0,8).map(
              (service) => (
                <TooltipWrapper content={service.description}>

              <Card key={service.id} className="p-4 bg-primary-100 hover:border-primary-400 transition-all  duration-300 cursor-pointer font-medium">
               <CardContent className="flex flex-col items-center justify-center gap-2 p-2">

                <Image src={`/assets/icons/${kebabCase(service.name)}.svg`} alt="timer" width={60} height={60} />
                 
                <h4 className="mt-2 text-base font-semibold">{service.name}</h4>
               </CardContent>
              </Card>
                 </TooltipWrapper>
              ),
            )}
          </div>
        </section>
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Most Popular Services</h3>
            <Button variant="link" className="text-sm">
              See All
            </Button>
          </div>
          <div className="flex items-center mt-4 space-x-2 overflow-scroll no-scrollbar">
            {services.map((filter) => (
              <Button key={filter.id} variant={"outline"}>
                {filter.name}
              </Button>
            ))}
          </div>
          <PopularServices services={services} />
        </section>
      </main>
    </div>
  )
}





