"use client";

import React, { useState, useRef, useEffect } from "react";
import { chatService, ChatMessage } from "@/lib/services/chatService";
import { useAuth } from "@/store/authStore";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, ArrowLeft, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingChatProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  provider: {
    id: number;
    name: string;
    image: string;
  };
}

export const BookingChat: React.FC<BookingChatProps> = ({
  isOpen,
  onClose,
  provider,
  taskId,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      if (user && provider) {
        const roomId = await chatService.getChatRoomId(
          user.id.toString(),
          provider.id.toString(),
        );
        setChatRoomId(roomId);
      }
    };

    initializeChat();
  }, [user, provider]);

  useEffect(() => {
    if (chatRoomId) {
      const unsubscribe = chatService.subscribeToMessages(
        chatRoomId,
        (newMessages) => {
          setMessages(newMessages);
        },
      );

      return () => unsubscribe();
    }
  }, [chatRoomId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !chatRoomId) return;

    try {
      await chatService.sendMessage({
        text: newMessage,
        sender: user.id.toString(),
        receiver: provider.id.toString(),
        type: "text",
        chatRoomId: chatRoomId,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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
              <Circle className="h-2 w-2 text-green-500" fill="currentColor" />
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 overflow-y-auto">
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "animate-slide-in flex",
                  message.sender === user?.id.toString()
                    ? "justify-end"
                    : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg p-3 transition-all",
                    message.sender === user?.id.toString()
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                    "hover:shadow-md",
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="mt-1 block text-[10px] opacity-70">
                    {message.timestamp?.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="rounded-full"
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button
              size="icon"
              className="rounded-full"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
