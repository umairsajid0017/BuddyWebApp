"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CameraIcon } from "lucide-react";
import { useAuth } from "@/store/authStore";
import { splitFullName } from "@/utils/helper-functions";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  dob: string | null;
  country: string | null;
  gender: string | null;
  address: string | null;
  civil_id_number: string | null;
}

export default function ProfileComponent() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: user?.dob || null,
    country: user?.country || null,
    gender: user?.gender || null,
    address: user?.address || null,
    civil_id_number: user?.civil_id_number || null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || null,
        country: user.country || null,
        gender: user.gender || null,
        address: user.address || null,
        civil_id_number: user.civil_id_number || null,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string, field: keyof ProfileFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.put(
        `/users/${user?.id}/update-profile`,
        formData,
      );

      if (response.data.status) {
        toast.success("Profile updated successfully");
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const { firstName, lastName } = splitFullName(formData.name);

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">Edit Profile</h2>
      <div className="mb-6 flex justify-end">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={
                user?.image ||
                `https://api.dicebear.com/9.x/initials/svg?seed=${formData.name}`
              }
              alt="Profile picture"
            />
            <AvatarFallback>{`${firstName[0] ?? ""}${lastName[0] ?? ""}`}</AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            className="absolute bottom-0 right-0 rounded-full"
            variant="outline"
          >
            <CameraIcon className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              required
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleInputChange}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 234 567 890"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={formData.country || ""}
              onValueChange={(value) => handleSelectChange(value, "country")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PK">Pakistan</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender || ""}
              onValueChange={(value) => handleSelectChange(value, "gender")}
            >
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
          <div className="space-y-2">
            <Label htmlFor="civil_id_number">National ID No</Label>
            <Input
              id="civil_id_number"
              placeholder="XXXX-XXXX-XXXX-XXXX"
              value={formData.civil_id_number || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="123 Main St, City, Country"
            value={formData.address || ""}
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </>
  );
}
