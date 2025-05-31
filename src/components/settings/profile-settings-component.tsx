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
import { useUpdateProfile } from "@/apis/apiCalls";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getImageUrl, splitFullName } from "@/helpers/utils";
import useAuthStore, { useAuth } from "@/store/authStore";
import { validateName, validatePhone } from "@/utils/validations";

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

interface ValidationErrors {
  name?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  civil_id_number?: string;
}

export default function ProfileComponent() {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
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
        country: user.country || "OM",
        gender: user.gender || null,
        address: user.address || null,
        civil_id_number: user.civil_id_number || null,
      });
    }
  }, [user]);

  // Validation functions
  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'name':
        const nameResult = validateName(value);
        return nameResult.isValid ? null : nameResult.message || null;
      
      case 'phone':
        const phoneResult = validatePhone(value);
        return phoneResult.isValid ? null : phoneResult.message || null;
      
      case 'dob':
        if (!value?.trim()) return "Date of birth is required";
        const dobDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dobDate.getFullYear();
        if (age < 18) return "You must be at least 18 years old";
        if (age > 100) return "Please enter a valid date of birth";
        return null;
      
      case 'gender':
        if (!value?.trim()) return "Gender is required";
        return null;
      
      case 'address':
        if (!value?.trim()) return "Address is required";
        if (value.trim().length < 10) return "Address must be at least 10 characters long";
        return null;
      
      case 'civil_id_number':
        if (!value?.trim()) return "Oman ID is required";
        // Oman ID format: 8-9 digits (no hyphens required)
        const cleanValue = value.trim().replace(/[-\s]/g, ''); // Remove hyphens and spaces
        if (!/^\d{8,9}$/.test(cleanValue)) {
          return "Oman ID must be 8-9 digits";
        }
        return null;
      
      default:
        return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Real-time validation for touched fields
    if (touchedFields[id]) {
      const error = validateField(id, value);
      setErrors((prev) => ({
        ...prev,
        [id]: error || undefined,
      }));
    }
  };

  const handleSelectChange = (value: string, field: keyof ProfileFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Real-time validation for touched fields
    if (touchedFields[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [field]: error || undefined,
      }));
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const value = formData[field as keyof ProfileFormData] || "";
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error || undefined,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validateForm = (): boolean => {
    const requiredFields = ["name", "phone", "dob", "gender", "civil_id_number", "address"];
    const newErrors: ValidationErrors = {};
    let hasErrors = false;

    // Mark all required fields as touched
    const newTouchedFields: Record<string, boolean> = {};
    requiredFields.forEach(field => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);

    // Validate all required fields
    requiredFields.forEach(field => {
      const value = formData[field as keyof ProfileFormData] || "";
      const error = validateField(field, value);
      if (error) {
        newErrors[field as keyof ValidationErrors] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (hasErrors) {
      const firstError = Object.values(newErrors)[0];
      toast({
        title: "Validation Error",
        description: firstError,
        variant: "destructive",
      });
    }

    return !hasErrors;
  };

  // Check if form is valid without showing errors (for submit button state)
  const isFormValid = (): boolean => {
    const requiredFields = ["name", "phone", "dob", "gender", "civil_id_number", "address"];
    
    // Check if there are any current errors
    const hasErrors = Object.values(errors).some(error => error !== undefined);
    if (hasErrors) return false;

    // Check if all required fields are filled
    const allFieldsFilled = requiredFields.every(field => {
      const value = formData[field as keyof ProfileFormData];
      return value && value.toString().trim() !== "";
    });
    if (!allFieldsFilled) return false;

    // Validate all fields silently
    const allFieldsValid = requiredFields.every(field => {
      const value = formData[field as keyof ProfileFormData] || "";
      const error = validateField(field, value);
      return !error;
    });

    return allFieldsValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await updateProfileMutation.mutateAsync({
        formData: formData,
        image: selectedImage || undefined,
      });
      
      toast({
        title: "Success",
        description: response.message || "Profile updated successfully",
      });
      
      if (!response.error) {
        useAuthStore.getState().setUser(response.records);
      }

      // Clear image preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setSelectedImage(null);
      // Clear errors after successful submission
      setErrors({});
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
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
            {updateProfileMutation.isPending ? (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <AvatarImage
                src={previewUrl || getImageUrl(user?.image)}
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
              onBlur={() => handleFieldBlur("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name}</p>
            )}
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
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
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
              onBlur={() => handleFieldBlur("phone")}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input
              required
              id="dob"
              type="date"
              value={formData.dob || ""}
              onChange={handleInputChange}
              onBlur={() => handleFieldBlur("dob")}
              className={errors.dob ? "border-red-500" : ""}
            />
            {errors.dob && (
              <p className="text-xs text-red-600">{errors.dob}</p>
            )}
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
              <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-xs text-red-600">{errors.gender}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="civil_id_number">Oman ID *</Label>
            <Input
              required
              id="civil_id_number"
              placeholder="12345678"
              value={formData.civil_id_number || ""}
              onChange={handleInputChange}
              onBlur={() => handleFieldBlur("civil_id_number")}
              maxLength={9}
              className={errors.civil_id_number ? "border-red-500" : ""}
            />
            {errors.civil_id_number && (
              <p className="text-xs text-red-600">{errors.civil_id_number}</p>
            )}
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
            onBlur={() => handleFieldBlur("address")}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && (
            <p className="text-xs text-red-600">{errors.address}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={!isFormValid() || updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        {!isFormValid() && !updateProfileMutation.isPending && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Please fill in all required fields correctly to save changes
          </p>
        )}
      </form>
    </>
  );
}
