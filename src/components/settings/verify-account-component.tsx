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
  RefreshCw,
  FlipHorizontal,
  Timer,
} from "lucide-react";
import Image from "next/image";
import {
  useCnicVerification,
  useLivePhotoVerification,
  usePassportVerification,
  useVerificationCheck,
} from "@/apis/apiCalls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { CnicVerificationRecord, VerificationStatus } from "@/types/verification-types";

export default function VerifyAccountComponent() {
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [livePhoto, setLivePhoto] = useState<File | null>(null);
  const [passportFront, setPassportFront] = useState<File | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<CnicVerificationRecord | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const { data: verificationCheck, refetch: refetchVerification } =
    useVerificationCheck();
  const cnicVerificationMutation = useCnicVerification();
  const livePhotoVerificationMutation = useLivePhotoVerification();
  const passportVerificationMutation = usePassportVerification();

  // Helper function to check if a step is completed
  const isStepCompleted = (step: 'cnic' | 'live-photo' | 'passport') => {
    switch (step) {
      case 'cnic':
        return verificationCheck?.cnicInfo?.status !== null;
      case 'live-photo':
        return verificationCheck?.livePhotoRecord?.status !== null;
      case 'passport':
        return verificationCheck?.passportPhotoRecord?.status !== null;
      default:
        return false;
    }
  };

  // Helper function to check if a step should be enabled (stepper logic)
  const isStepEnabled = (step: 'cnic' | 'live-photo' | 'passport') => {
    switch (step) {
      case 'cnic':
        // CNIC is always enabled if not completed
        return !isStepCompleted('cnic');
      case 'live-photo':
        // Live Photo enabled only if CNIC is completed and Live Photo is not completed
        return isStepCompleted('cnic') && !isStepCompleted('live-photo');
      case 'passport':
        // Passport enabled only if CNIC and Live Photo are completed and Passport is not completed
        return isStepCompleted('cnic') && isStepCompleted('live-photo') && !isStepCompleted('passport');
      default:
        return false;
    }
  };

  // Helper function to get next required step message
  const getNextRequiredStepMessage = (currentStep: 'live-photo' | 'passport') => {
    if (currentStep === 'live-photo' && !isStepCompleted('cnic')) {
      return "Please complete CNIC verification first.";
    }
    if (currentStep === 'passport') {
      if (!isStepCompleted('cnic')) {
        return "Please complete CNIC verification first.";
      }
      if (!isStepCompleted('live-photo')) {
        return "Please complete Live Photo verification first.";
      }
    }
    return "This step is not yet available. Please complete previous steps first.";
  };

  // Helper function to get the first available tab (stepper logic)
  const getDefaultTab = () => {
    if (isStepEnabled('cnic')) return "cnic";
    if (isStepEnabled('live-photo')) return "live-photo";
    if (isStepEnabled('passport')) return "passport";
    // If all steps are completed, default to the first step to show status
    return "cnic";
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
  ) => {
    if (event.target.files?.[0]) {
      setter(event.target.files[0]);
    }
  };

  const startCamera = () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast({
        title: "Camera not supported in your browser",
        description: "Please use a different browser or device",
      });
      return;
    }
    setIsCapturing(true);
  };

  useEffect(() => {
    let stream: MediaStream;
    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: isFrontCamera ? "user" : "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          title: "Failed to access camera",
          description: "Please make sure you have given camera permissions.",
        });
        setIsCapturing(false);
      }
    };

    if (isCapturing) {
      initCamera();
    }

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [isCapturing, isFrontCamera]);

  const switchCamera = async () => {
    setIsFrontCamera((prev) => !prev);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    startCamera();
  };

  const startCountdown = () => {
    setCountdown(3);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownRef.current!);
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      setCountdown(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx && videoRef.current) {
        if (isFrontCamera) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(videoRef.current, 0, 0);
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], "live-photo.jpg", {
              type: "image/jpeg",
            });
            setLivePhoto(file);
            stopCamera();
          }
        },
        "image/jpeg",
        0.8,
      );
    }
  };

  const stopCamera = () => {
    cancelCountdown();
    setIsCapturing(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
      toast({
        title: "Please upload both front and back sides of your CNIC",
      });
      return;
    }

    try {
      const response = await cnicVerificationMutation.mutateAsync({
        cnic_front: idFront,
        cnic_back: idBack,
      });

      if (!response.error) {
        setVerificationStatus(response.records);
        setIdFront(null);
        setIdBack(null);
        toast({
          title: response.message || "CNIC verification submitted successfully",
        });
        refetchVerification();
      } else {
        toast({
          title: response.message || "Failed to verify CNIC",
        });
      }
    } catch (error) {
      console.error("CNIC verification error:", error);
      toast({
        title: "An error occurred while verifying CNIC",
      });
    }
  };

  const handleVerifyLivePhoto = async () => {
    if (!livePhoto) {
      toast({
        title: "Please capture your live photo",
      });
      return;
    }

    try {
      const response = await livePhotoVerificationMutation.mutateAsync({
        live_photo: livePhoto,
      });

      if (!response.error) {
        setLivePhoto(null);
        toast({
          title:
            response.message ||
            "Live photo verification submitted successfully",
        });
        refetchVerification();
      } else {
        toast({
          title: response.message || "Failed to verify live photo",
        });
      }
    } catch (error) {
      console.error("Live photo verification error:", error);
      toast({
        title: "An error occurred while verifying live photo",
      });
    }
  };

  const handleVerifyPassport = async () => {
    if (!passportFront) {
      toast({
        title: "Please upload your passport",
      });
      return;
    }

    try {
      const response = await passportVerificationMutation.mutateAsync({
        passport_photo: passportFront,
      });

      if (!response.error) {
        setPassportFront(null);
        toast({
          title:
            response.message || "Passport verification submitted successfully",
        });
        refetchVerification();
      } else {
        toast({
          title: response.message || "Failed to verify passport",
        });
      }
    } catch (error) {
      console.error("Passport verification error:", error);
      toast({
        title: "An error occurred while verifying passport",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Verify Account</h2>

      {renderOverallStatus()}

      {/* Step Indicator */}
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-semibold mb-4">Verification Process</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              isStepCompleted('cnic') 
                ? 'bg-green-500 text-white' 
                : isStepEnabled('cnic') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 text-gray-600'
            }`}>
              {isStepCompleted('cnic') ? '✓' : '1'}
            </div>
            <span className={isStepCompleted('cnic') ? 'text-green-600 font-medium' : 'text-gray-600'}>
              CNIC
            </span>
          </div>
          
          <div className={`flex-1 h-1 mx-4 ${isStepCompleted('cnic') ? 'bg-green-500' : 'bg-gray-300'}`} />
          
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              isStepCompleted('live-photo') 
                ? 'bg-green-500 text-white' 
                : isStepEnabled('live-photo') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 text-gray-600'
            }`}>
              {isStepCompleted('live-photo') ? '✓' : '2'}
            </div>
            <span className={isStepCompleted('live-photo') ? 'text-green-600 font-medium' : 'text-gray-600'}>
              Live Photo
            </span>
          </div>
          
          <div className={`flex-1 h-1 mx-4 ${isStepCompleted('live-photo') ? 'bg-green-500' : 'bg-gray-300'}`} />
          
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              isStepCompleted('passport') 
                ? 'bg-green-500 text-white' 
                : isStepEnabled('passport') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 text-gray-600'
            }`}>
              {isStepCompleted('passport') ? '✓' : '3'}
            </div>
            <span className={isStepCompleted('passport') ? 'text-green-600 font-medium' : 'text-gray-600'}>
              Passport
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue={getDefaultTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="cnic" 
            disabled={!isStepEnabled('cnic') && !isStepCompleted('cnic')}
            className={(!isStepEnabled('cnic') && !isStepCompleted('cnic')) ? "opacity-50 cursor-not-allowed" : ""}
          >
            CNIC {isStepCompleted('cnic') && <CheckCircle2 className="h-5 w-5 ml-2" />}
          </TabsTrigger>
          <TabsTrigger 
            value="live-photo" 
            disabled={!isStepEnabled('live-photo') && !isStepCompleted('live-photo')}
            className={(!isStepEnabled('live-photo') && !isStepCompleted('live-photo')) ? "opacity-50 cursor-not-allowed" : ""}
          >
            Live Photo {isStepCompleted('live-photo') && <CheckCircle2 className="h-5 w-5 ml-2" />}
          </TabsTrigger>
          <TabsTrigger 
            value="passport" 
            disabled={!isStepEnabled('passport') && !isStepCompleted('passport')}
            className={(!isStepEnabled('passport') && !isStepCompleted('passport')) ? "opacity-50 cursor-not-allowed" : ""}
          >
            Passport {isStepCompleted('passport') && <CheckCircle2 className="h-5 w-5 ml-2" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cnic" className="space-y-6">
          {isStepCompleted('cnic') ? (
            <div className="rounded-lg border p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {getVerificationIcon(verificationCheck?.cnicInfo)}
                <span className="text-lg font-semibold capitalize">
                  {verificationCheck?.cnicInfo?.status}
                </span>
              </div>
              <p className="text-gray-600">
                Your CNIC verification has been submitted and is {verificationCheck?.cnicInfo?.status}.
                {verificationCheck?.cnicInfo?.status === "pending" && " Please wait for review."}
                {verificationCheck?.cnicInfo?.status === "rejected" && " Please contact support for assistance."}
                {verificationCheck?.cnicInfo?.status === "approved" && " You can now proceed to the next step."}
              </p>
            </div>
          ) : isStepEnabled('cnic') ? (
            <>
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
                disabled={cnicVerificationMutation.isPending}
              >
                {cnicVerificationMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify CNIC"
                )}
              </Button>
            </>
          ) : (
            <div className="rounded-lg border p-6 text-center">
              <p className="text-gray-600">
                CNIC verification is the first step in the process.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="live-photo" className="space-y-6">
          {isStepCompleted('live-photo') ? (
            <div className="rounded-lg border p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {getVerificationIcon(verificationCheck?.livePhotoRecord)}
                <span className="text-lg font-semibold capitalize">
                  {verificationCheck?.livePhotoRecord?.status}
                </span>
              </div>
              <p className="text-gray-600">
                Your live photo verification has been submitted and is {verificationCheck?.livePhotoRecord?.status}.
                {verificationCheck?.livePhotoRecord?.status === "pending" && " Please wait for review."}
                {verificationCheck?.livePhotoRecord?.status === "rejected" && " Please contact support for assistance."}
                {verificationCheck?.livePhotoRecord?.status === "approved" && " You can now proceed to the next step."}
              </p>
            </div>
          ) : isStepEnabled('live-photo') ? (
            <>
              <div className="space-y-6 font-medium">
                <Card className="relative border-dashed border-primary-400 p-4">
                  <Badge className="absolute -top-2 z-10">Live Photo</Badge>
                  <div className="flex flex-col items-center space-y-4">
                    {isCapturing ? (
                      <div className="relative w-full">
                        <div className="relative mx-auto h-[400px] w-[400px] overflow-hidden rounded-lg bg-black">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`h-full w-full object-cover ${
                              isFrontCamera ? "scale-x-[-1]" : ""
                            }`}
                          />
                          {countdown !== null && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <span className="text-8xl font-bold text-white drop-shadow-lg">
                                {countdown}
                              </span>
                            </div>
                          )}
                          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-2">
                            {countdown === null ? (
                              <>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={switchCamera}
                                  className="bg-white/70 hover:bg-white"
                                >
                                  <FlipHorizontal className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={startCountdown}
                                  className="bg-white/70 hover:bg-white"
                                >
                                  <Timer className="mr-1 h-4 w-4" />
                                  Timer
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={capturePhoto}
                                  className="bg-white/70 hover:bg-white"
                                >
                                  Capture
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={stopCamera}
                                  className="bg-white/70 hover:bg-white"
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={cancelCountdown}
                                className="bg-white/70 hover:bg-white"
                              >
                                Cancel Timer
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 text-center text-sm text-gray-500">
                          {isFrontCamera ? "Front Camera" : "Back Camera"}
                        </div>
                      </div>
                    ) : livePhoto ? (
                      <div className="relative mx-auto">
                        <div className="h-[400px] w-[400px] overflow-hidden rounded-lg">
                          <Image
                            src={URL.createObjectURL(livePhoto)}
                            alt="live-photo"
                            width={400}
                            height={400}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setLivePhoto(null);
                              startCamera();
                            }}
                            className="bg-white/70 hover:bg-white"
                          >
                            <RefreshCw className="mr-1 h-4 w-4" />
                            Retake
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-4 py-8">
                        <div className="rounded-full bg-gray-100 p-8">
                          <Camera className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-semibold">Take Live Photo</h3>
                          <p className="mt-2 max-w-[300px] text-sm text-gray-500">
                            Please ensure you&apos;re in a well-lit area and look
                            directly at the camera. Keep your face centered and
                            clearly visible.
                          </p>
                        </div>
                        <Button onClick={startCamera} className="mt-4">
                          <Camera className="mr-2 h-4 w-4" />
                          Start Camera
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <Button
                className="w-full"
                onClick={handleVerifyLivePhoto}
                disabled={livePhotoVerificationMutation.isPending || !livePhoto}
              >
                {livePhotoVerificationMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Live Photo"
                )}
              </Button>
            </>
          ) : (
            <div className="rounded-lg border p-6 text-center">
              <p className="text-gray-600">
                {getNextRequiredStepMessage("live-photo")}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="passport" className="space-y-6">
          {isStepCompleted('passport') ? (
            <div className="rounded-lg border p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {getVerificationIcon(verificationCheck?.passportPhotoRecord)}
                <span className="text-lg font-semibold capitalize">
                  {verificationCheck?.passportPhotoRecord?.status}
                </span>
              </div>
              <p className="text-gray-600">
                Your passport verification has been submitted and is {verificationCheck?.passportPhotoRecord?.status}.
                {verificationCheck?.passportPhotoRecord?.status === "pending" && " Please wait for review."}
                {verificationCheck?.passportPhotoRecord?.status === "rejected" && " Please contact support for assistance."}
                {verificationCheck?.passportPhotoRecord?.status === "approved" && " All verification steps completed!"}
              </p>
            </div>
          ) : isStepEnabled('passport') ? (
            <>
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
                disabled={passportVerificationMutation.isPending}
              >
                {passportVerificationMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Passport"
                )}
              </Button>
            </>
          ) : (
            <div className="rounded-lg border p-6 text-center">
              <p className="text-gray-600">
                {getNextRequiredStepMessage("passport")}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
