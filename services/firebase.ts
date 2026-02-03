import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase usando variables de entorno
// Las credenciales están en .env.local (no se suben a Git)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validar que las variables de entorno estén configuradas
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    '❌ Firebase no está configurado correctamente. ' +
    'Verifica que .env.local exista y contenga todas las variables VITE_FIREBASE_*'
  );
}

console.log('🔧 Inicializando Firebase...');
console.log('📦 Proyecto:', firebaseConfig.projectId);

// Initialize Firebase using the modular SDK (v9+).
const app = initializeApp(firebaseConfig);
console.log('✅ Firebase App inicializada');

export const auth = getAuth(app);
export const db = getFirestore(app);

// Intentar inicializar Storage con manejo de errores
let storageInstance;
try {
  storageInstance = getStorage(app);
  console.log('✅ Firebase Storage inicializado correctamente');
} catch (error) {
  console.error('❌ Error inicializando Firebase Storage:', error);
  console.warn('⚠️ Firebase Storage NO disponible. Verifica que esté habilitado en Firebase Console.');
  console.warn('⚠️ URL: https://console.firebase.google.com/project/citard-fbc26/storage');
  storageInstance = null;
}

export const storage = storageInstance;