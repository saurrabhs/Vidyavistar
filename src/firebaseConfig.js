// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCfrdPRnnIf5iPekCecr3tNY01SoqWWEAE",
  authDomain: "vidyavistar-8d83e.firebaseapp.com",
  projectId: "vidyavistar-8d83e",
  storageBucket: "vidyavistar-8d83e.firebasestorage.app", // Check this value in your Firebase Console
  messagingSenderId: "972705509062",
  appId: "1:972705509062:web:84cc3a78d5ce9e527f71c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
