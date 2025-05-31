// NotificationsBell.tsx
"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useShowNotifications } from '@/apis/apiCalls';
import { Notification } from "@/types/notification-types";
import NotificationsMenu from "./notifications-menu";

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { data: notificationsData, refetch } = useShowNotifications();

  useEffect(() => {
    if (notificationsData?.records && Array.isArray(notificationsData.records)) {
      console.log("📋 Notifications updated:", notificationsData.records.length);
      setNotifications(notificationsData.records);
    }
  }, [notificationsData]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Debug log when unread count changes
  useEffect(() => {
    console.log("🔢 Unread count updated:", unreadCount);
  }, [unreadCount]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-2 bg-background-100 hover:bg-secondary-800">
          <Bell className="h-5 w-5 text-text-100" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <NotificationsMenu
          notifications={notifications}
          onClose={() => setIsOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
