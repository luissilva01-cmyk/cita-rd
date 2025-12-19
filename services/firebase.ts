import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración completa para el proyecto Firebase: Citard (citard-fbc26)
const firebaseConfig = {
  apiKey: "AIzaSyDy2tLpXr3v6llyXGfQVhVlnmZtMgCDRhg",
  authDomain: "citard-fbc26.firebaseapp.com",
  projectId: "citard-fbc26",
  storageBucket: "citard-fbc26.firebasestorage.app",
  messagingSenderId: "564769541768",
  appId: "1:564769541768:web:07013924da206d8b37593d"
};

// Initialize Firebase using the modular SDK (v9+).
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);