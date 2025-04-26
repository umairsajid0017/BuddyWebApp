// @ts-nocheck
importScripts(
  "https://www.gstatic.com/firebasejs/9.20.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.20.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyDc2Ehkj8pGA6RUX22sD0QdEXGi2ZgFj5k",
  authDomain: "buddy-temp-e6420.firebaseapp.com",
  projectId: "buddy-temp-e6420",
  storageBucket: "buddy-temp-e6420.firebasestorage.app",
  messagingSenderId: "217423706896",
  appId: "1:217423706896:web:32f8ce6f6a379fa829c395",
  measurementId: "G-RPRYJ50VMJ",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const notificationTitle = payload.notification.title || "New Notification";
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/assets/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
