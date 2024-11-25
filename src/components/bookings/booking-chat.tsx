"use client";

import React, { useState, useRef, useEffect } from "react";
import { chatService, ChatMessage } from "@/lib/services/chatService";
import { useAuth } from "@/store/authStore";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  ArrowLeft,
  Circle,
  Copy,
  Reply,
  Star,
  Trash2,
  Forward,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

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

const MemoizedMessageComponent = React.memo<{
  message: ChatMessage;
  onAction: (action: string, message: ChatMessage) => void;
  userId?: string;
  providerName: string;
  starredMessages: Set<string>;
}>(({ message, onAction, userId, providerName, starredMessages }) => (
  <>
    {message.replyTo && (
      <div
        className="mb-1 ml-4 cursor-pointer border-l-2 border-primary pl-2 text-sm text-muted-foreground"
        onClick={() => {
          const element = document.getElementById(
            `message-${message.replyTo?.id}`,
          );
          element?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
      >
        <p className="font-medium">
          {message.replyTo.sender === userId ? "You" : providerName}
        </p>
        <p className="truncate">{message.replyTo.text}</p>
      </div>
    )}
    <div
      id={`message-${message.id}`}
      className={cn(
        "flex w-full",
        message.sender === userId ? "justify-end" : "justify-start",
      )}
    >
      <div className="max-w-[75%]">
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={cn(
                "group relative rounded-lg p-3 transition-all",
                message.sender === userId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted",
                "hover:shadow-md",
              )}
            >
              {starredMessages.has(message.id!) && (
                <Star className="absolute -right-2 -top-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
              <p className="whitespace-pre-wrap break-words text-sm">
                {message.text}
              </p>
              <span className="mt-1 block text-[10px] opacity-70">
                {message.timestamp?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            {message.type === "text" && (
              <ContextMenuItem
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                onClick={() => onAction("copy", message)}
              >
                <Copy className="h-4 w-4" /> Copy Text
              </ContextMenuItem>
            )}
            <ContextMenuItem
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
              onClick={() => onAction("reply", message)}
            >
              <Reply className="h-4 w-4" /> Reply
            </ContextMenuItem>
            <ContextMenuItem
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
              onClick={() => onAction("star", message)}
            >
              <Star className="h-4 w-4" />
              {starredMessages.has(message.id!) ? "Unstar" : "Star"}
            </ContextMenuItem>
            <ContextMenuItem
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
              onClick={() => onAction("forward", message)}
            >
              <Forward className="h-4 w-4" /> Forward
            </ContextMenuItem>
            <ContextMenuItem
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
              onClick={() => onAction("info", message)}
            >
              <Info className="h-4 w-4" /> Info
            </ContextMenuItem>
            {message.sender === userId && (
              <ContextMenuItem
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                onClick={() => onAction("delete", message)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </div>
  </>
));

const ChatInput = React.memo<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  disabled?: boolean;
}>(({ value, onChange, onSend, disabled }) => (
  <div className="flex items-center gap-2">
    <Input
      value={value}
      onChange={onChange}
      placeholder="Type a message..."
      className="rounded-full"
      onKeyPress={(e) => e.key === "Enter" && onSend()}
    />
    <Button
      size="icon"
      className="shrink-0 rounded-full"
      onClick={onSend}
      disabled={disabled || !value.trim()}
    >
      <Send className="h-5 w-5" />
    </Button>
  </div>
));

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
  const [starredMessages, setStarredMessages] = useState<Set<string>>(
    new Set(),
  );
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

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

  const handleMessageAction = React.useCallback(
    async (action: string, message: ChatMessage) => {
      switch (action) {
        case "copy":
          await navigator.clipboard.writeText(message.text);
          break;
        case "reply":
          setReplyingTo(message);
          break;
        case "star":
          setStarredMessages((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(message.id!)) {
              newSet.delete(message.id!);
            } else {
              newSet.add(message.id!);
            }
            return newSet;
          });
          break;
        case "delete":
          if (message.sender === user?.id.toString()) {
            await chatService.deleteMessage(message.id!);
          }
          break;
        case "forward":
          // Implement forward functionality
          console.log("Forward message:", message);
          break;
        case "info":
          // Implement message info functionality
          console.log("Message info:", message);
          break;
      }
    },
    [user?.id, chatService],
  );

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewMessage(e.target.value);
    },
    [],
  );

  const handleSendMessage = React.useCallback(async () => {
    if (!newMessage.trim() || !user || !chatRoomId) return;

    try {
      const messageData: Omit<ChatMessage, "id" | "timestamp"> = {
        text: newMessage,
        sender: user.id.toString(),
        receiver: provider.id.toString(),
        type: "text",
        chatRoomId: chatRoomId,
      };

      if (replyingTo) {
        messageData.replyTo = {
          id: replyingTo.id!,
          text: replyingTo.text,
          sender: replyingTo.sender,
        };
      }

      await chatService.sendMessage(messageData);
      setNewMessage("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [newMessage, user, chatRoomId, replyingTo, provider.id]);

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
          <div className="flex flex-col space-y-4 p-4">
            {messages.map((message) => (
              <MemoizedMessageComponent
                key={message.id}
                message={message}
                onAction={handleMessageAction}
                userId={user?.id.toString()}
                providerName={provider.name}
                starredMessages={starredMessages}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div className="border-t p-4">
          {replyingTo && (
            <div className="mb-2 flex items-center justify-between rounded-lg bg-muted p-2">
              <div className="flex items-center gap-2">
                <Reply className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Replying to{" "}
                  {replyingTo.sender === user?.id.toString()
                    ? "yourself"
                    : provider.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(null)}
                className="h-6 w-6 p-0 hover:bg-background/50"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
          <ChatInput
            value={newMessage}
            onChange={handleInputChange}
            onSend={handleSendMessage}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
