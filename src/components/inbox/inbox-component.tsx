import React, { useState } from "react";
import InboxDropdown from "./inbox-dropdown";
import { InboxItem } from "@/types/chat-types";

const InboxComponent: React.FC = () => {
  const [message, setMessage] = useState<InboxItem[]>([
    {
      id: "1",
      title: "Hello",
      // description: "string",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      read: false,
      senderAvatar: "https://api.dicebear.com/9.x/dylan/svg?seed=Kimberly",
      senderName: "Kimberly",
    },
    {
      id: "2",
      title: "Hello",
      // description: "string",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      read: false,
      senderAvatar: "https://api.dicebear.com/9.x/dylan/svg?seed=Mackenzie",
      senderName: "Mackenzie",
    },
    {
      id: "3",
      title: "Yoooooooo",
      // description: "string",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      read: false,
      senderAvatar: "https://api.dicebear.com/9.x/dylan/svg?seed=Liam",
      senderName: "Liam",
    },
  ]);

  const handleDelete = (id: string) => {
    setMessage((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
  };

  const handleMarkAsRead = (id: string) => {};
  return (
    <>
      <InboxDropdown
        items={message}
        onDelete={handleDelete}
        onMarkAsRead={handleMarkAsRead}
      />
    </>
  );
};

export default InboxComponent;
