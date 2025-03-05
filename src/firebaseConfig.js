// src/firebaseConfig.js
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (from Firebase Console)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfrdPRnnIf5iPekCecr3tNY01SoqWWEAE",
  authDomain: "vidyavistar-8d83e.firebaseapp.com",
  projectId: "vidyavistar-8d83e",
  storageBucket: "vidyavistar-8d83e.firebasestorage.app",
  messagingSenderId: "972705509062",
  appId: "1:972705509062:web:84cc3a78d5ce9e527f71c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
