// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validación de configuración
const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.error(
    `⚠️ Faltan variables de entorno para Firebase: ${missingKeys.join(", ")}`
  );
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar Auth y Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

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
