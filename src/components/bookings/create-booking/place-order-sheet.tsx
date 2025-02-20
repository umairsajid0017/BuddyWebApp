"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Video, ImageIcon, Pause, Play, Trash2 } from "lucide-react";
import { ServiceCard } from "./booking-service-card";
import { Service } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { MediaFiles } from "@/lib/types/common";

interface PlaceOrderSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (description: string, mediaFiles?: MediaFiles) => void;
  service?: Service;
}

export function PlaceOrderSheet({
  isOpen,
  onClose,
  onContinue,
  service,
}: PlaceOrderSheetProps) {
  const [description, setDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  // const [videos, setVideos] = useState<File[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  // const [videoURLs, setVideoURLs] = useState<string[]>([]);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setAudioFile(
          new File([audioBlob], "audio-recording.wav", { type: "audio/wav" }),
        );
      };
      audioChunks.current = [];
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video",
  ) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const urls = fileArray.map((file) => URL.createObjectURL(file));

      if (type === "image") {
        setImages((prev) => [...prev, ...fileArray]);
        setImageURLs((prev) => [...prev, ...urls]);
      } else {
        // setVideos((prev) => [...prev, ...fileArray]);
        // setVideoURLs((prev) => [...prev, ...urls]);
      }
    }
  };

  const removeFile = (index: number, type: "image" | "video" | "audio") => {
    if (type === "image") {
      setImages((prev) => prev.filter((_, i) => i !== index));
      setImageURLs((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "video") {
      // setVideos((prev) => prev.filter((_, i) => i !== index));
      // setVideoURLs((prev) => prev.filter((_, i) => i !== index));
    } else {
      setAudioURL(null);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Place an order</SheetTitle>
          <SheetDescription>
            Provide details for your service request
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          {service && <ServiceCard service={service} compact={true} />}
          <Textarea
            placeholder="Describe your task in detail"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Audio Description</h3>
              {audioURL ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFile(0, "audio")}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Audio
                </Button>
              ) : (
                <Button onClick={isRecording ? stopRecording : startRecording}>
                  {isRecording ? (
                    <Pause className="mr-2 h-4 w-4" />
                  ) : (
                    <Mic className="mr-2 h-4 w-4" />
                  )}
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
              )}
            </div>
            {isRecording && (
              <div className="flex items-center space-x-2">
                <div className="h-2.5 w-full rounded-full bg-secondary">
                  <div
                    className="h-2.5 rounded-full bg-primary"
                    style={{ width: `${(recordingTime / 300) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{recordingTime}s</span>
              </div>
            )}
            {audioURL && (
              <audio controls className="w-full">
                <source src={audioURL} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Images</h3>
              <Button
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload Images
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e, "image")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {imageURLs.map((image, index) => (
                <div key={index} className="group relative">
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="h-32 w-full rounded-md object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => removeFile(index, "image")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          {/* <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Videos</h3>
              <Button
                variant="outline"
                onClick={() => document.getElementById("video-upload")?.click()}
              >
                <Video className="mr-2 h-4 w-4" />
                Upload Videos
              </Button>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e, "video")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {videoURLs.map((video, index) => (
                <div key={index} className="group relative">
                  <video
                    src={video}
                    className="h-32 w-full rounded-md object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => removeFile(index, "video")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div> */}
        </div>
        <Button
          onClick={() => {
            onContinue(description, {
              images,
              // videos,
              audio: audioFile ?? undefined,
            });
            console.log("Images, ", images, audioFile);
          }}
          className="w-full"
          disabled={!description.trim() || !audioFile || !images.length}
        >
          {!service ? " Continue" : "Book Now"}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
