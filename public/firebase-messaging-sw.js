//@ts-nocheck
importScripts(
  "https://www.gstatic.com/firebasejs/9.20.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.20.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyCItMR88Ix4d2ren37PKyMWVYkFheMJ9p8",
  authDomain: "buddy-ca070.firebaseapp.com",
  projectId: "buddy-ca070",
  storageBucket: "buddy-ca070.firebasestorage.app",
  messagingSenderId: "588549913770",
  appId: "1:588549913770:web:5fbc5ce75110afd7e2e4d3",
  measurementId: "G-8QRS4KLJ7L",
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
