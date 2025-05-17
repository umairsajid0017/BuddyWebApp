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
import { useAuth, useShowNotifications } from '@/apis/apiCalls'
import { Notification } from "@/types/notification-types";
import { subscribeToUserNotifications } from "@/helpers/notifcations";
import NotificationsMenu from "./notifications-menu";

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { data: notificationsData, isLoading, refetch } = useShowNotifications();

  useEffect(() => {
    if (notificationsData?.records && Array.isArray(notificationsData.records)) {
      setNotifications(notificationsData.records);
    }
  }, [notificationsData]);

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = subscribeToUserNotifications(
      user.id.toString(),
      (newNotifications) => {
        console.log("📬 got notifications:", newNotifications);
        refetch();
        
      }
    );

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [user]); 
  
  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
