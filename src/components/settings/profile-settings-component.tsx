"use client";

import React, { useEffect, useState, useRef } from "react";
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
import { useUpdateProfile } from "@/lib/api";
import { profileSchema } from "@/lib/schemas";
import { ZodError } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  dob: string | null;
  country: string;
  gender: string | null;
  address: string | null;
  civil_id_number: string | null;
}

export default function ProfileComponent() {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: user?.dob || null,
    country: user?.country || "OM", // Default to Oman
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
        country: user.country || "OM", // Default to Oman
        gender: user.gender || null,
        address: user.address || null,
        civil_id_number: user.civil_id_number || null,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "civil_id_number") {
      // Oman ID format: X-XXXXXX-XXXXXXX-X (e.g., 3-123456-1234567-1)
      const cleaned = value.replace(/\D/g, "");
      let formatted = cleaned;
      if (cleaned.length > 0) {
        formatted = cleaned.match(/.{1,1}|.+/g)?.join("-") || "";
        if (cleaned.length > 1) {
          formatted =
            formatted +
              "-" +
              cleaned
                .substring(1, 7)
                .match(/.{1,6}|.+/g)
                ?.join("-") || "";
        }
        if (cleaned.length > 7) {
          formatted =
            formatted +
              "-" +
              cleaned
                .substring(7, 14)
                .match(/.{1,7}|.+/g)
                ?.join("-") || "";
        }
        if (cleaned.length > 14) {
          formatted = formatted + "-" + cleaned.substring(14, 15) || "";
        }
      }
      setFormData((prev) => ({
        ...prev,
        [id]: formatted.substring(0, 17), // Limit to correct length
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSelectChange = (value: string, field: keyof ProfileFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "phone",
      "dob",
      "country",
      "gender",
      "civil_id_number",
      "address",
    ];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field as keyof ProfileFormData],
    );

    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map((field) =>
        field.replace(/_/g, " ").toUpperCase(),
      );
      toast({
        title: "Error",
        description: `Please fill in the following required fields: ${fieldNames.join(", ")}`,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Validate the form data
      const validatedData = profileSchema.parse(formData);

      const response = await updateProfileMutation.mutateAsync({
        formData: validatedData,
        image: selectedImage || undefined,
      });
      toast({
        title: "Success",
        description: response.message || "Profile updated successfully",
      });

      // Clear image preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setSelectedImage(null);
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        const errors = error.errors.map((err) => err.message);
        toast({
          title: "Error",
          description: errors.join("\n"),
        });
      } else {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to update profile",
        });
      }
    }
  };

  const { firstName, lastName } = splitFullName(formData.name);

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">Edit Profile</h2>
      <div className="mb-6 flex justify-end">
        <div className="relative">
          <Avatar
            className="h-24 w-24 cursor-pointer"
            onClick={handleImageClick}
          >
            {updateProfileMutation.isLoading ? (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <AvatarImage
                src={
                  previewUrl ||
                  (user?.image
                    ? process.env.NEXT_PUBLIC_IMAGE_URL + user.image
                    : undefined)
                }
                alt={user?.name ?? ""}
              />
            )}
            <AvatarFallback>{`${firstName[0] ?? ""}${lastName[0] ?? ""}`}</AvatarFallback>
          </Avatar>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <Button
            size="sm"
            className="absolute bottom-0 right-0 rounded-full"
            variant="outline"
            onClick={handleImageClick}
          >
            <CameraIcon className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
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
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              required
              id="phone"
              type="tel"
              placeholder="+968 XXXX XXXX"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input
              required
              id="dob"
              type="date"
              value={formData.dob || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Select
              value={formData.country}
              onValueChange={(value) => handleSelectChange(value, "country")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OM">Oman</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
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
            <Label htmlFor="civil_id_number">National ID No *</Label>
            <Input
              required
              id="civil_id_number"
              placeholder="3-123456-1234567-1"
              value={formData.civil_id_number || ""}
              onChange={handleInputChange}
              maxLength={17}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            required
            id="address"
            placeholder="123 Main St, City, Country"
            value={formData.address || ""}
            onChange={handleInputChange}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={updateProfileMutation.isLoading}
        >
          {updateProfileMutation.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </>
  );
}
