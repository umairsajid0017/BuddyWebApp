import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

const UserProfile: React.FC<{ user: UserInfo }> = ({ user }) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-col items-center">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
          <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
        </Avatar>
        <CardTitle className="mt-4 text-2xl font-bold">{user.firstName} {user.lastName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <InfoItem label="First Name" value={user.firstName} />
            <InfoItem label="Date of Birth" value={user.dateOfBirth} />
            <InfoItem label="Country" value={user.country} />
            <InfoItem label="National ID No" value={user.nationalId} />
            <InfoItem label="Address" value={user.address} />
          </div>
          <div className="space-y-2">
            <InfoItem label="Last Name" value={user.lastName} />
            <InfoItem label="Email" value={user.email} />
            <InfoItem label="Number" value={user.phoneNumber} />
            <InfoItem label="Gender" value={user.gender} />
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