import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA3R4CyOH3EoeCEJyfi-vxFOE5uJzgDpyI",
  authDomain: "event-venue-7eb47.firebaseapp.com",
  projectId: "event-venue-7eb47",
  storageBucket: "event-venue-7eb47.firebasestorage.app",
  messagingSenderId: "719019146352",
  appId: "1:719019146352:web:3a603de959bdc9125888b5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
