import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración completa para el proyecto Firebase: Citard (citard-fbc26)
const firebaseConfig = {
  apiKey: "AIzaSyDy2tLpXr3v6llyXGfQVhVlnmZtMgCDRhg",
  authDomain: "citard-fbc26.firebaseapp.com",
  projectId: "citard-fbc26",
  storageBucket: "citard-fbc26.appspot.com",
  messagingSenderId: "564769541768",
  appId: "1:564769541768:web:07013924da206d8b37593d"
};

console.log('🔧 Inicializando Firebase...');

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