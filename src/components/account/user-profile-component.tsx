import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { CameraIcon, Router } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import { splitFullName } from "@/utils/helper-functions";

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
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={
                  user.image ||
                  "https://api.dicebear.com/9.x/dylan/svg?seed=Destiny"
                }
                alt="Profile picture"
              />
              <AvatarFallback>
                {splitFullName(user.name).firstName[0]}
                {splitFullName(user.name).lastName[0]}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute bottom-0 right-0 rounded-full"
              variant="outline"
            >
              <CameraIcon className="h-4 w-4 text-primary" />
            </Button>
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/settings/profile")}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold">Personal Information</h3>
              <div className="grid gap-4">
                <InfoItem
                  label="First Name"
                  value={splitFullName(user.name).firstName}
                />
                <InfoItem
                  label="Last Name"
                  value={splitFullName(user.name).lastName}
                />
                <InfoItem
                  label="Date of Birth"
                  value={user.dob ?? "Not specified"}
                />
                <InfoItem
                  label="Gender"
                  value={user.gender ?? "Not specified"}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Contact Information</h3>
              <div className="grid gap-4">
                <InfoItem label="Email" value={user.email} />
                <InfoItem label="Phone" value={user.phone ?? "Not specified"} />
                <InfoItem
                  label="Country"
                  value={user.country ?? "Not specified"}
                />
                <InfoItem
                  label="Address"
                  value={user.address ?? "Not specified"}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatItem label="Total Bookings" value="12" />
            <StatItem label="Completed" value="8" />
            <StatItem label="In Progress" value="2" />
            <StatItem label="Cancelled" value="2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <p className="mt-1 text-sm">{value}</p>
  </div>
);

const StatItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="text-center">
    <p className="text-2xl font-semibold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export default UserProfile;
