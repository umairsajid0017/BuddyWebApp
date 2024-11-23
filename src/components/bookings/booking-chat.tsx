"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, Image as ImageIcon, Send, ArrowLeft } from "lucide-react";
import { AudioRecorder, AudioPlayer } from "@/components/audio/audio-recorder";

type Message = {
  id: string;
  text: string;
  sender: "user" | "provider";
  timestamp: Date;
  type: "text" | "audio" | "image";
  content?: string; // URL for image/audio
};

type BookingChatProps = {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  providerName: string;
};

export const BookingChat: React.FC<BookingChatProps> = ({
  isOpen,
  onClose,
  providerName,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate provider response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'll get back to you shortly.",
        sender: "provider",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      const imageUrl = URL.createObjectURL(file);
      const message: Message = {
        id: Date.now().toString(),
        text: "",
        sender: "user",
        timestamp: new Date(),
        type: "image",
        content: imageUrl,
      };
      setMessages([...messages, message]);
    }
  };

  const handleAudioRecording = (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const message: Message = {
      id: Date.now().toString(),
      text: "",
      sender: "user",
      timestamp: new Date(),
      type: "audio",
      content: audioUrl,
    };
    setMessages([...messages, message]);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full p-0 sm:w-[400px]">
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src="/assets/provider-avatar.png" />
            <AvatarFallback>{providerName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{providerName}</h3>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-[calc(100vh-160px)] flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] items-start gap-2 ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {message.sender === "provider" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/assets/provider-avatar.png" />
                    <AvatarFallback>{providerName[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-2xl p-3 ${
                    message.sender === "user"
                      ? "rounded-tr-none bg-secondary-200 text-text-900"
                      : "rounded-tl-none bg-muted"
                  }`}
                >
                  {message.type === "text" && (
                    <p className="text-sm">{message.text}</p>
                  )}
                  {message.type === "image" && (
                    <img
                      src={message.content}
                      alt="Shared image"
                      className="max-w-[200px] rounded-lg"
                    />
                  )}
                  {message.type === "audio" && message.content && (
                    <AudioPlayer
                      audioUrl={message.content}
                      timestamp={message.timestamp}
                    />
                  )}
                  {message.type !== "audio" && (
                    <span className="mt-1 block text-[10px] text-text-600">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            {!isRecording && (
              <>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="rounded-full"
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </>
            )}
            <AudioRecorder
              onRecordingComplete={handleAudioRecording}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
            {!isRecording && (
              <Button size="default" onClick={sendMessage}>
                <Send className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
