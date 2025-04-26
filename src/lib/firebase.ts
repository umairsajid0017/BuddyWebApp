import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDc2Ehkj8pGA6RUX22sD0QdEXGi2ZgFj5k",
  authDomain: "buddy-temp-e6420.firebaseapp.com",
  projectId: "buddy-temp-e6420",
  storageBucket: "buddy-temp-e6420.firebasestorage.app",
  messagingSenderId: "217423706896",
  appId: "1:217423706896:web:32f8ce6f6a379fa829c395",
  measurementId: "G-RPRYJ50VMJ"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;
if (messaging) {
  getToken(messaging, {
    vapidKey:
      process.env.NEXT_PUBLIC_FIREBASE_VAPID,
  });
}

export { db, analytics, auth, googleProvider, messaging };
