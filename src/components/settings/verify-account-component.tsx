"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  Loader2,
  Camera,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import Image from "next/image";
import {
  useCnicVerification,
  useLivePhotoVerification,
  usePassportVerification,
  useVerificationCheck,
} from "@/lib/api";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { VerificationRecord, VerificationStatus } from "@/lib/types";

export default function VerifyAccountComponent() {
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [livePhoto, setLivePhoto] = useState<File | null>(null);
  const [passportFront, setPassportFront] = useState<File | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationRecord | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const { data: verificationCheck, refetch: refetchVerification } =
    useVerificationCheck();
  const cnicVerificationMutation = useCnicVerification();
  const livePhotoVerificationMutation = useLivePhotoVerification();
  const passportVerificationMutation = usePassportVerification();

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
  ) => {
    if (event.target.files?.[0]) {
      setter(event.target.files[0]);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error(
        "Failed to access camera. Please make sure you have given camera permissions.",
      );
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "live-photo.jpg", {
            type: "image/jpeg",
          });
          setLivePhoto(file);
          stopCamera();
        }
      }, "image/jpeg");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCapturing(false);
    }
  };

  const getVerificationIcon = (status: VerificationStatus | undefined) => {
    if (!status?.hasData) return null;

    switch (status.status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const renderOverallStatus = () => {
    if (!verificationCheck) return null;

    return (
      <div className="rounded-lg border p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Verification Status</h3>
          <Badge
            variant={verificationCheck.userVerified ? "default" : "secondary"}
          >
            {verificationCheck.userVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">CNIC Verification</span>
            <div className="flex items-center gap-2">
              <span className="text-sm capitalize">
                {verificationCheck.cnicInfo.status || "Not Submitted"}
              </span>
              {getVerificationIcon(verificationCheck.cnicInfo)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Live Photo Verification</span>
            <div className="flex items-center gap-2">
              <span className="text-sm capitalize">
                {verificationCheck.livePhotoRecord.status || "Not Submitted"}
              </span>
              {getVerificationIcon(verificationCheck.livePhotoRecord)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Passport Verification</span>
            <div className="flex items-center gap-2">
              <span className="text-sm capitalize">
                {verificationCheck.passportPhotoRecord.status ||
                  "Not Submitted"}
              </span>
              {getVerificationIcon(verificationCheck.passportPhotoRecord)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleVerifyCnic = async () => {
    if (!idFront || !idBack) {
      toast.error("Please upload both front and back sides of your CNIC");
      return;
    }

    try {
      const response = await cnicVerificationMutation.mutateAsync({
        cnic_front: idFront,
        cnic_back: idBack,
      });

      if (!response.error) {
        setVerificationStatus(response.records);
        toast.success(
          response.message || "CNIC verification submitted successfully",
        );
        refetchVerification(); // Refresh verification status
      } else {
        toast.error(response.message || "Failed to verify CNIC");
      }
    } catch (error) {
      console.error("CNIC verification error:", error);
      toast.error("An error occurred while verifying CNIC");
    }
  };

  const handleVerifyLivePhoto = async () => {
    if (!livePhoto) {
      toast.error("Please capture your live photo");
      return;
    }

    try {
      const response = await livePhotoVerificationMutation.mutateAsync({
        live_photo: livePhoto,
      });

      if (!response.error) {
        toast.success(
          response.message || "Live photo verification submitted successfully",
        );
        refetchVerification(); // Refresh verification status
      } else {
        toast.error(response.message || "Failed to verify live photo");
      }
    } catch (error) {
      console.error("Live photo verification error:", error);
      toast.error("An error occurred while verifying live photo");
    }
  };

  const handleVerifyPassport = async () => {
    if (!passportFront) {
      toast.error("Please upload your passport");
      return;
    }

    try {
      const response = await passportVerificationMutation.mutateAsync({
        passport_photo: passportFront,
      });

      if (!response.error) {
        toast.success(
          response.message || "Passport verification submitted successfully",
        );
        refetchVerification(); // Refresh verification status
      } else {
        toast.error(response.message || "Failed to verify passport");
      }
    } catch (error) {
      console.error("Passport verification error:", error);
      toast.error("An error occurred while verifying passport");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Verify Account</h2>

      {renderOverallStatus()}

      <Tabs defaultValue="cnic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cnic">CNIC</TabsTrigger>
          <TabsTrigger value="live-photo">Live Photo</TabsTrigger>
          <TabsTrigger value="passport">Passport</TabsTrigger>
        </TabsList>

        <TabsContent value="cnic" className="space-y-6">
          <div className="space-y-6 font-medium">
            <Card className="relative border-dashed border-primary-400 p-4">
              <Badge className="absolute -top-2 z-10">ID Card Front</Badge>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, setIdFront)}
                id="id-front"
              />
              <label
                htmlFor="id-front"
                className="flex cursor-pointer flex-col items-center justify-center gap-4"
              >
                {idFront ? (
                  <div className="h-[180px] w-[280px] overflow-hidden rounded-lg">
                    <Image
                      src={URL.createObjectURL(idFront)}
                      alt="id-front"
                      width={640}
                      height={480}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Image
                      src="/assets/icons/image-placeholder.svg"
                      className="mb-2 h-12 w-12 text-text-500"
                      alt="id-front-placeholder"
                      width={48}
                      height={48}
                    />
                    <span className="text-text-600">
                      Upload National ID Front
                    </span>
                  </div>
                )}
              </label>
            </Card>

            <Card className="relative border-dashed border-primary-400 p-4">
              <Badge className="absolute -top-2 z-10">ID Card Back</Badge>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, setIdBack)}
                id="id-back"
              />
              <label
                htmlFor="id-back"
                className="flex cursor-pointer flex-col items-center justify-center gap-4"
              >
                {idBack ? (
                  <div className="h-[180px] w-[280px] overflow-hidden rounded-lg">
                    <Image
                      src={URL.createObjectURL(idBack)}
                      alt="id-back"
                      width={640}
                      height={480}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Image
                      src="/assets/icons/image-placeholder.svg"
                      className="mb-2 h-12 w-12 text-text-500"
                      alt="id-back-placeholder"
                      width={48}
                      height={48}
                    />
                    <span className="text-text-600">
                      Upload National ID Back
                    </span>
                  </div>
                )}
              </label>
            </Card>
          </div>

          <Button
            className="w-full"
            onClick={handleVerifyCnic}
            disabled={cnicVerificationMutation.isLoading}
          >
            {cnicVerificationMutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify CNIC"
            )}
          </Button>
        </TabsContent>

        <TabsContent value="live-photo" className="space-y-6">
          <div className="space-y-6 font-medium">
            <Card className="relative border-dashed border-primary-400 p-4">
              <Badge className="absolute -top-2 z-10">Live Photo</Badge>
              <div className="flex flex-col items-center space-y-4">
                {isCapturing ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="h-[280px] w-[280px] rounded-lg object-cover"
                    />
                    <div className="flex gap-2">
                      <Button onClick={capturePhoto}>Capture</Button>
                      <Button variant="outline" onClick={stopCamera}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : livePhoto ? (
                  <div className="relative h-[280px] w-[280px]">
                    <Image
                      src={URL.createObjectURL(livePhoto)}
                      alt="live-photo"
                      fill
                      className="rounded-lg object-cover"
                    />
                    <Button
                      variant="outline"
                      className="absolute bottom-2 right-2"
                      onClick={() => setLivePhoto(null)}
                    >
                      Retake
                    </Button>
                  </div>
                ) : (
                  <Button onClick={startCamera}>
                    <Camera className="mr-2 h-4 w-4" />
                    Take Live Photo
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <Button
            className="w-full"
            onClick={handleVerifyLivePhoto}
            disabled={livePhotoVerificationMutation.isLoading || !livePhoto}
          >
            {livePhotoVerificationMutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Live Photo"
            )}
          </Button>
        </TabsContent>

        <TabsContent value="passport" className="space-y-6">
          <div className="space-y-6 font-medium">
            <Card className="relative border-dashed border-primary-400 p-4">
              <Badge className="absolute -top-2 z-10">Passport</Badge>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, setPassportFront)}
                id="passport-front"
              />
              <label
                htmlFor="passport-front"
                className="flex cursor-pointer flex-col items-center justify-center gap-4"
              >
                {passportFront ? (
                  <div className="h-[180px] w-[280px] overflow-hidden rounded-lg">
                    <Image
                      src={URL.createObjectURL(passportFront)}
                      alt="passport-front"
                      width={640}
                      height={480}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Image
                      src="/assets/icons/image-placeholder.svg"
                      className="mb-2 h-12 w-12 text-text-500"
                      alt="passport-front-placeholder"
                      width={48}
                      height={48}
                    />
                    <span className="text-text-600">Upload Passport</span>
                  </div>
                )}
              </label>
            </Card>
          </div>

          <Button
            className="w-full"
            onClick={handleVerifyPassport}
            disabled={passportVerificationMutation.isLoading}
          >
            {passportVerificationMutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Passport"
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
