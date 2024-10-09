"use client"
import UserProfile from "@/components/account/user-profile-component"
import PopularServices from "@/components/services/popular-services"
import { Button } from "@/components/ui/button"
import Loading from "@/components/ui/loading"
import Main from "@/components/ui/main"
import { useServices } from "@/lib/api"
import useAuthStore, { useAuth } from "@/store/authStore"
import useServicesStore from "@/store/servicesStore"
import { Suspense, useEffect } from "react"
type UserInfo = {
  firstName: string
  lastName: string
  dateOfBirth: string
  email: string
  country: string
  phoneNumber: string
  nationalId: string
  gender: string
  address: string
  avatarUrl: string
}
const Profile: React.FC = () => {
  const { services, setServices } = useServicesStore();
  const { user } = useAuth()
  const { data: servicesResponse, isLoading, error } = useServices();

  // const user: UserInfo = {
  //   firstName: "John",
  //   lastName: "Doe",
  //   dateOfBirth: "11/27/95",
  //   email: "johndoe23@gmail.com",
  //   country: "United States",
  //   phoneNumber: "0334-5557891",
  //   nationalId: "3922-5657995-01",
  //   gender: "Male",
  //   address: "267 New Avenue Park, New York",
  //   avatarUrl: "https://api.dicebear.com/9.x/dylan/svg?seed=Destiny"
  // }

  useEffect(() => {
    if (servicesResponse) {
      setServices(servicesResponse.data)
    }
  }, [services, isLoading])


  return <Main>
    {isLoading ? <Loading /> :

      <UserProfile user={user!} />
    }
    {services.length > 0 &&
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
    }
  </Main>
}


export default Profile;