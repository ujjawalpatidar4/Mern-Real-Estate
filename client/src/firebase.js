// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "rpestate-3b133.firebaseapp.com",
  projectId: "rpestate-3b133",
  storageBucket: "rpestate-3b133.firebasestorage.app",
  messagingSenderId: "373605038506",
  appId: "1:373605038506:web:12612f41f209787cae13d3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);