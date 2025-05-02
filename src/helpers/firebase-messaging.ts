import { getToken, MessagePayload, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID;
const FCM_TOKEN_KEY = "fcm_token";

export async function initializeFirebaseMessaging() {
  if (typeof window === "undefined") return null;

  try {
    // Check if we already have a token in localStorage
    const savedToken = localStorage.getItem(FCM_TOKEN_KEY);

    // If we have a token already, return it
    if (savedToken) {
      console.log("Using existing FCM token from localStorage");
      return savedToken;
    }

    // Otherwise request permission and get a new token
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      if (!messaging) {
        console.error("Firebase messaging is not initialized");
        return null;
      }

      try {
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        });
        
        if (token) {
          localStorage.setItem(FCM_TOKEN_KEY, token);
          console.log("FCM token saved to localStorage");
        }
        return token;
      } catch (error) {
        console.error("Error getting FCM token:", error);
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error("Error initializing Firebase messaging:", error);
    return null;
  }
}

export async function requestNotificationPermission() {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await getDeviceToken();
    }
    return null;
  } catch (error) {
    console.error("Notification permission error:", error);
    return null;
  }
}

export async function getDeviceToken() {
  if (!messaging) return null;

  try {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (token) {
      localStorage.setItem(FCM_TOKEN_KEY, token);
    }
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}

export function getStoredFcmToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(FCM_TOKEN_KEY);
}

export function setupMessageListener(callback: (arg0: MessagePayload) => void) {
  if (!messaging) return;

  return onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    callback(payload);
  });
}
