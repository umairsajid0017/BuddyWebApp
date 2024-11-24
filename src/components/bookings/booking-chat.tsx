"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mic,
  Image as ImageIcon,
  Send,
  ArrowLeft,
  Copy,
  Reply,
  Trash,
  Star,
  Forward,
  Info,
  CircleCheck,
  Circle,
} from "lucide-react";
import { AudioRecorder, AudioPlayer } from "@/components/audio/audio-recorder";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

type Message = {
  id: string;
  text: string;
  sender: "user" | "provider";
  timestamp: Date;
  type: "text" | "audio" | "image";
  content?: string;
  replyTo?: { id: string; sender: "user" | "provider"; content: string };
};

type Provider = {
  id: number;
  name: string;
  image: string;
};

type BookingChatProps = {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  provider: Provider;
};

export const BookingChat: React.FC<BookingChatProps> = ({
  isOpen,
  onClose,
  provider,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [starredMessages, setStarredMessages] = useState<Set<string>>(
    new Set(),
  );
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, replyingTo]);

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

  const handleMessageAction = (action: string, message: Message) => {
    switch (action) {
      case "copy":
        navigator.clipboard.writeText(message.text);
        toast.success("Message copied to clipboard");
        break;
      case "reply":
        setReplyingTo(message);
        // Focus input after setting reply
        setTimeout(() => {
          const input = document.querySelector(
            'input[type="text"]',
          ) as HTMLInputElement;
          if (input) input.focus();
        }, 100);
        break;
      case "delete":
        setMessages(messages.filter((m) => m.id !== message.id));
        toast.success("Message deleted");
        break;
      case "star":
        const newStarred = new Set(starredMessages);
        if (newStarred.has(message.id)) {
          newStarred.delete(message.id);
          toast.success("Message removed from starred");
        } else {
          newStarred.add(message.id);
          toast.success("Message starred");
        }
        setStarredMessages(newStarred);
        break;
      case "forward":
        toast.success("Forward feature coming soon");
        break;
      case "info":
        toast.info(`Sent at ${message.timestamp.toLocaleString()}`);
        break;
    }
  };

  const MessageComponent: React.FC<{ message: Message }> = ({ message }) => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`group flex max-w-[80%] items-start gap-2 ${
              message.sender === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {message.sender === "provider" && (
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={process.env.NEXT_PUBLIC_IMAGE_URL + provider.image}
                />
                <AvatarFallback>{provider.name[0]}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`relative rounded-2xl p-3 ${
                message.sender === "user"
                  ? "rounded-tr-none bg-primary text-primary-foreground"
                  : "rounded-tl-none bg-muted"
              }`}
            >
              {starredMessages.has(message.id) && (
                <Star className="absolute -right-2 -top-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
              {/* Message content rendering */}
              {message.type === "text" && (
                <p className="text-sm">{message.text}</p>
              )}
              {message.type === "image" && (
                <img
                  src={message.content}
                  alt="Shared image"
                  className="max-w-[200px] cursor-pointer rounded-lg"
                  onClick={() => setShowImagePreview(message.content || null)}
                />
              )}
              {message.type === "audio" && message.content && (
                <AudioPlayer
                  audioUrl={message.content}
                  timestamp={message.timestamp}
                />
              )}
              <span className="mt-1 block text-[10px] opacity-70">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {message.type === "text" && (
          <ContextMenuItem onClick={() => handleMessageAction("copy", message)}>
            <Copy className="mr-2 h-4 w-4" /> Copy
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={() => handleMessageAction("reply", message)}>
          <Reply className="mr-2 h-4 w-4" /> Reply
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleMessageAction("star", message)}>
          <Star className="mr-2 h-4 w-4" />
          {starredMessages.has(message.id) ? "Unstar" : "Star"}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => handleMessageAction("forward", message)}
        >
          <Forward className="mr-2 h-4 w-4" /> Forward
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleMessageAction("info", message)}>
          <Info className="mr-2 h-4 w-4" /> Info
        </ContextMenuItem>
        {message.sender === "user" && (
          <ContextMenuItem
            onClick={() => handleMessageAction("delete", message)}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:w-[400px]"
      >
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
            <AvatarImage
              src={process.env.NEXT_PUBLIC_IMAGE_URL + provider.image}
            />
            <AvatarFallback>{provider.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{provider.name}</h3>
            <div className="flex items-center gap-2">
              <Circle className="h-2 w-2 text-green-500" fill="#22c55e" />
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.replyTo && (
                  <div
                    className="mb-1 ml-4 cursor-pointer border-l-2 border-primary pl-2 text-sm text-muted-foreground hover:bg-muted/50"
                    onClick={() => {
                      const replyMessage = messages.find(
                        (m) => m.id === message.replyTo?.id,
                      );
                      if (replyMessage) {
                        document
                          .getElementById(replyMessage.id)
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                      }
                    }}
                  >
                    <p className="font-medium">
                      {message.replyTo?.sender === "user"
                        ? "You"
                        : provider.name}
                    </p>
                    <p className="truncate">{message.replyTo?.content}</p>
                  </div>
                )}
                <MessageComponent message={message} />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
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
