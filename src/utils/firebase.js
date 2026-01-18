// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar Auth y Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configurar idioma español para Firebase Auth
auth.languageCode = 'es';

// Función auxiliar para mensajes de error más amigables
export function parseFirebaseError(error) {
  if (!error?.code) return "Error inesperado. Intenta de nuevo más tarde.";

  switch (error.code) {
    case "auth/invalid-email":
      return "Correo no válido.";
    case "auth/user-not-found":
      return "Usuario no encontrado.";
    case "auth/wrong-password":
      return "Contraseña incorrecta.";
    case "auth/email-already-in-use":
      return "Este correo ya está registrado.";
    case "auth/weak-password":
      return "La contraseña es demasiado débil.";
    default:
      return "Error al iniciar sesión o registrarse. Intenta de nuevo más tarde.";
  }
}

export default app;