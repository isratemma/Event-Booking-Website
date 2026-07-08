import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA3R4CyOH3EoeCEJyfi-vxFOE5uJzgDpyI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "event-venue-7eb47.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "event-venue-7eb47",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "event-venue-7eb47.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "719019146352",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:719019146352:web:3a603de959bdc9125888b5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
