"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { cn, getImageUrl } from "@/helpers/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { db } from "@/helpers/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Worker } from "@/types/general-types";
import { useAuth } from "@/store/authStore";

// Message interface matching React Native structure
interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  replyTo?: {
    id: string;
    message: string;
    senderId: string;
  } | null;
}

interface BookingChatProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  provider: Worker;
}

// Utility function to get environment prefix
const getEnvironment = () => {
  const env = process.env.NODE_ENV;
  return env === "production" ? "production" : env === "development" ? "development" : "test";
};

const MessageComponent = React.memo<{
  message: Message;
  onAction: (action: string, message: Message) => void;
  userId?: string;
  providerName: string;
  starredMessages: Set<string>;
}>(({ message, onAction, userId, providerName, starredMessages }) => (
  <>
    {message.replyTo && (
      <div
        className="mb-1 ml-4 cursor-pointer rounded-r-sm border-l-4 border-primary bg-muted/30 pl-2 text-sm text-muted-foreground"
        onClick={() => {
          const element = document.getElementById(
            `message-${message.replyTo?.id}`,
          );
          element?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
      >
        <p className="font-medium">
          {message.replyTo.senderId === userId ? "You" : providerName}
        </p>
        <p className="truncate">{message.replyTo.message}</p>
      </div>
    )}
    <div
      id={`message-${message.id}`}
      className={cn(
        "flex w-full",
        message.senderId === userId ? "justify-end" : "justify-start",
      )}
    >
      <div className="max-w-[75%]">
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={cn(
                "group relative rounded-lg p-3 transition-all",
                message.senderId === userId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted",
                "hover:shadow-md",
              )}
            >
              {starredMessages.has(message.id!) && (
                <Star className="absolute -right-2 -top-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
              <p className="whitespace-pre-wrap break-words text-sm">
                {message.message}
              </p>
              <span className="mt-1 block text-[10px] opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuItem
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
              onClick={() => onAction("copy", message)}
            >
              <Copy className="h-4 w-4" /> Copy Text
            </ContextMenuItem>
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
            {message.senderId === userId && (
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
MessageComponent.displayName = "MessageComponent";

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
      disabled={disabled ?? !value.trim()}
    >
      <Send className="h-5 w-5" />
    </Button>
  </div>
));
ChatInput.displayName = "ChatInput";

export const BookingChat: React.FC<BookingChatProps> = ({
  isOpen,
  onClose,
  provider,
  taskId,
}) => {
  const { user } = useAuth();
  console.log(user, provider);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [starredMessages, setStarredMessages] = useState<Set<string>>(
    new Set(),
  );
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (taskId && user && provider) {
      const environment = getEnvironment();
      const messagesRef = collection(
        db,
        `${environment}chats`,
        String(taskId),
        "messages"
      );
      
      const q = query(messagesRef, orderBy("timestamp", "asc"));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const loadedMessages: Message[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];

        setMessages(loadedMessages);
      });

      return () => unsubscribe();
    }
  }, [taskId, user, provider]);

  const handleMessageAction = React.useCallback(
    async (action: string, message: Message) => {
      switch (action) {
        case "copy":
          await navigator.clipboard.writeText(message.message);
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
          if (message.senderId === user?.id.toString()) {
            try {
              const environment = getEnvironment();
              await deleteDoc(
                doc(db, `${environment}chats`, String(taskId), "messages", message.id!)
              );
            } catch (error) {
              console.error("Error deleting message:", error);
            }
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
    [user?.id, taskId],
  );

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewMessage(e.target.value);
    },
    [],
  );

  const handleSendMessage = React.useCallback(async () => {
    if (!newMessage.trim() || !user || !taskId) return;

    try {
      const messageData: Omit<Message, "id"> = {
        senderId: user.id.toString(),
        receiverId: provider.id.toString(),
        message: newMessage,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      if (replyingTo) {
        messageData.replyTo = {
          id: replyingTo.id!,
          message: replyingTo.message,
          senderId: replyingTo.senderId,
        };
      }

      const environment = getEnvironment();
      const messagesRef = collection(
        db,
        `${environment}chats`,
        String(taskId),
        "messages"
      );
      
      await addDoc(messagesRef, messageData);

      // TODO: Send chat notification similar to React Native implementation
      // await sendChatNotification({
      //   bookingId: taskId,
      //   senderId: user.id.toString(),
      //   receiverId: provider.id.toString(),
      //   message: newMessage,
      //   title: user?.name + " has sent you a message",
      // });

      setNewMessage("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [newMessage, user, taskId, replyingTo, provider.id, provider.name]);

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
              src={getImageUrl(provider.image || undefined)}
            />
            <AvatarFallback>{provider.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{provider.name}</h3>
           <div className="flex items-center gap-2">
              <Circle 
                className={`h-2 w-2 ${provider.is_online ? 'text-green-500' : 'text-red-500'}`} 
                fill="currentColor" 
              />
              <p className="text-sm text-muted-foreground">
                {provider.is_online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 overflow-y-auto">
          <div className="flex flex-col space-y-4 p-4">
            {messages.map((message) => (
              <MessageComponent
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
                  {replyingTo.senderId === user?.id.toString()
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
