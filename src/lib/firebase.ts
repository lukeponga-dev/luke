// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "portfolio-pilot-zk5qy",
  appId: "1:691437578873:web:26826096529addc864c2a8",
  storageBucket: "portfolio-pilot-zk5qy.firebasestorage.app",
  apiKey: "AIzaSyBkcpTKuJ5UmAHfbJV5fYWnNnMLkzFNHzA",
  authDomain: "portfolio-pilot-zk5qy.firebaseapp.com",
  measurementId: "G-F4HH7FG4S9",
  messagingSenderId: "691437578873"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
