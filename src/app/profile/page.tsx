"use client"
import UserProfile from "@/components/account/user-profile-component"
import PopularServicesSection from "@/components/services/popular-services-section"
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



  useEffect(() => {
    if (servicesResponse) {
      setServices(servicesResponse.data)
    }
  }, [services, isLoading])


  return <Main>
    {isLoading ? <Loading /> :

      <UserProfile user={user!} />
    }
    <PopularServicesSection services={services} />
  </Main>
}


export default Profile;