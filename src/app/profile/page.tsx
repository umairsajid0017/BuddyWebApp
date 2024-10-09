import UserProfile from "@/components/account/user-profile-component"
import Loading from "@/components/ui/loading"
import Main from "@/components/ui/main"
import { Suspense } from "react"
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
const Profile: React.FC = ()=> {
    const user: UserInfo = {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "11/27/95",
        email: "johndoe23@gmail.com",
        country: "United States",
        phoneNumber: "0334-5557891",
        nationalId: "3922-5657995-01",
        gender: "Male",
        address: "267 New Avenue Park, New York",
        avatarUrl: "https://api.dicebear.com/9.x/dylan/svg?seed=Destiny"
      }
    
      return <Main>
          <UserProfile user={user} />
        </Main>
}


export default Profile;