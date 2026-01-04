// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZYT2AEUORf6q6qGY79G9ZhYmJDJgrgNk",
  authDomain: "noter-bf8d0.firebaseapp.com",
  projectId: "noter-bf8d0",
  storageBucket: "noter-bf8d0.firebasestorage.app",
  messagingSenderId: "708542916114",
  appId: "1:708542916114:web:031814c13ebd0bf74f5acb",
  measurementId: "G-E1MWWNBYKR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally (it might fail in non-browser envs)
isSupported().then(yes => yes && getAnalytics(app));

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
