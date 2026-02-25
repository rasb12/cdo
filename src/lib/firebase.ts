// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB00IdBM1RnwNImwCy5iBWwCzb3_bFxl4E",
    authDomain: "cdo-app-d3cf8.firebaseapp.com",
    projectId: "cdo-app-d3cf8",
    storageBucket: "cdo-app-d3cf8.firebasestorage.app",
    messagingSenderId: "1016422566232",
    appId: "1:1016422566232:web:475faa1a06895a10053d2d",
    measurementId: "G-TDPJ1371MB",
};

// Initialize Firebase (prevent multiple initializations)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
