import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

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

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 🔥 OPCIONAL: Usar emulador de Storage en desarrollo local
// Esto evita problemas de CORS durante el desarrollo
// Para usar: ejecuta `firebase emulators:start --only storage` en otra terminal
const USE_EMULATOR = false; // Cambia a true para usar emulador

if (USE_EMULATOR && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  console.log('🧪 Conectando a Storage Emulator (localhost:9199)');
  connectStorageEmulator(storage, 'localhost', 9199);
}
