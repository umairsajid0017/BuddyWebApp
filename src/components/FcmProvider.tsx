"use client";

import { useEffect } from "react";
import {
  initializeFirebaseMessaging,
  setupMessageListener,
} from "@/lib/firebase-messaging";
import { useToast } from "@/hooks/use-toast";
import { saveNotificationToFirestore } from "@/lib/notifcations";
import { useAuth } from "@/store/authStore";

export default function FcmProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const initFcm = async () => {
      try {
        const token = await initializeFirebaseMessaging();
        if (token) {
          console.log("FCM initialized with token");
        }
      } catch (error) {
        console.error("Failed to initialize FCM:", error);
      }
    };

    initFcm();

    const unsubscribe = setupMessageListener((payload) => {
      console.log("New notification received:", payload);

      if (payload.notification) {
        toast({
          title: payload.notification.title || "New notification",
          description: payload.notification.body,
          duration: 5000,
        });
      }

      if (user?.id && payload.notification) {
       const saved = saveNotificationToFirestore(user.id.toString(), {
         title: payload.notification.title,
         body: payload.notification.body,
         timestamp: Date.now(),
         ...(payload.data || {}),
       });
        console.log("Notification saved:", saved.then((res) => res));
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
