import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '../ui/button'
import { CameraIcon, Router } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/types'
import { splitFullName } from '@/utils/helper-functions'

// type UserInfo = {
//   firstName: string
//   lastName: string
//   dateOfBirth: string
//   email: string
//   country: string
//   phoneNumber: string
//   nationalId: string
//   gender: string
//   address: string
//   avatarUrl: string
// }

const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  const router = useRouter();
  return (

    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-col items-center justify-center gap-0">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://api.dicebear.com/9.x/dylan/svg?seed=Destiny" alt="Profile picture" />
            <AvatarFallback>FC</AvatarFallback>
            </Avatar>
          <Button size="sm" className="absolute bottom-0 right-0 rounded-full" variant="outline">
            <CameraIcon className="h-4 w-4 text-primary" />
          </Button>
        </div>
        <div className='flex flex-col items-center justify-between gap-2'>
        <CardTitle className="mt-4 text-2xl font-bold">{user.name}</CardTitle>
        <Button className='text-xs text-text-600' variant={"outline"} onClick={()=> router.push('/settings/profile') }>
          Edit Profile
        </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <InfoItem label="First Name" value={splitFullName(user.name).firstName} />
            <InfoItem label="Date of Birth" value={user.dob ?? "11/27/95"} />
            <InfoItem label="Country" value={user.country ?? "United States"} />
            <InfoItem label="National ID No" value={user.company_id?.toString() ?? "3922-5657995-01"} />
            <InfoItem label="Address" value={user.address ?? "267 New Avenue Park, New York"} />
          </div>
          <div className="space-y-2">
            <InfoItem label="Last Name" value={splitFullName(user.name).lastName} />
            <InfoItem label="Email" value={user.email} />
            <InfoItem label="Number" value={user.phone} />
            <InfoItem label="Gender" value={user.gender ?? ""} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <span className="text-sm font-medium text-text-600">{label}</span>
    <p className="mt-1 ">{value}</p>
  </div>
)


export default UserProfile;