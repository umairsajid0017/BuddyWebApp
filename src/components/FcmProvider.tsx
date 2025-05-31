"use client";

import { useEffect } from "react";
import {
  initializeFirebaseMessaging,
  setupMessageListener,
} from "@/helpers/firebase-messaging";
import { useToast } from "@/hooks/use-toast";
import { useUpdateToken } from '@/apis/apiCalls'
import { useQueryClient } from '@tanstack/react-query';
import { playNotificationSound, showBrowserNotification } from "@/helpers/notifcations";

export default function FcmProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const updateTokenMutation = useUpdateToken();
  const queryClient = useQueryClient();

  useEffect(() => {
    const initFcm = async () => {
      try {
        const token = await initializeFirebaseMessaging();
        if (token) {
          updateTokenMutation.mutate({ token });
        }
      } catch (error) {
        console.error("Failed to initialize FCM:", error);
      }
    };

    initFcm();

    const unsubscribe = setupMessageListener((payload) => {
      console.log("🔔 New notification received:", payload);

      if (payload.notification) {
        const title = payload.notification.title || "New notification";
        const body = payload.notification.body || "";

        // Show toast immediately when notification arrives
        toast({
          title,
          description: body,
          duration: 5000,
        });

        // Play notification sound
        playNotificationSound();

        // Show browser notification as backup (when app is not in focus)
        showBrowserNotification(title, body);

        // Invalidate and refetch notifications to update the bell icon in real-time
        console.log("🔄 Invalidating notifications cache...");
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        console.log("✅ Cache invalidated");
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
