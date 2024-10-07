"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, CameraIcon, ChevronRightIcon, HelpCircleIcon, KeyIcon, LanguagesIcon, LockIcon, UserIcon, BellIcon, ShieldIcon } from "lucide-react"

const SettingsComponent: React.FC = ()=> {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
       
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" >
              Edit Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              My Calendar
            </Button>
            <Button variant="ghost" className="w-full justify-start" >
              Language
            </Button>
            <Button variant="ghost" className="w-full justify-start" >
              Change Password
            </Button>
            <Button variant="ghost" className="w-full justify-start" >
              Verify Account
            </Button>
            <Button variant="ghost" className="w-full justify-start" >
              Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start" >
              Privacy Policy
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Help Center
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-end mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile picture" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute bottom-0 right-0 rounded-full" variant="secondary">
                  <CameraIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalId">National ID No</Label>
                  <Input id="nationalId" placeholder="XXXX-XXXX-XXXX-XXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main St, City, Country" />
              </div>
              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}



export default SettingsComponent;