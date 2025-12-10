// src/services/preferenciasService.js
import { db } from "../utils/firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";

/**
 * Obtener preferencias del usuario
 * @param {string} userId - ID del usuario
 */
export async function obtenerPreferencias(userId) {
  try {
    const docRef = doc(db, "preferencias", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ok: true, data: docSnap.data() };
    }

    // Preferencias por defecto
    const defaultPrefs = {
      edadMin: 18,
      edadMax: 99,
      distanciaMax: 50, // km
      generoInteres: "todos", // "hombres", "mujeres", "todos"
      mostrarPerfil: true,
      notificaciones: {
        matches: true,
        mensajes: true,
        likes: true
      }
    };

    return { ok: true, data: defaultPrefs };
  } catch (error) {
    console.error("Error al obtener preferencias:", error);
    return { ok: false, msg: "Error al obtener preferencias" };
  }
}

/**
 * Guardar preferencias del usuario
 * @param {string} userId - ID del usuario
 * @param {object} preferencias - Objeto con las preferencias
 */
export async function guardarPreferencias(userId, preferencias) {
  try {
    const docRef = doc(db, "preferencias", userId);
    
    await setDoc(docRef, {
      ...preferencias,
      updatedAt: serverTimestamp()
    }, { merge: true });

    return { ok: true, msg: "Preferencias guardadas" };
  } catch (error) {
    console.error("Error al guardar preferencias:", error);
    return { ok: false, msg: "Error al guardar preferencias" };
  }
}

/**
 * Actualizar una preferencia específica
 * @param {string} userId - ID del usuario
 * @param {string} campo - Campo a actualizar
 * @param {any} valor - Nuevo valor
 */
export async function actualizarPreferencia(userId, campo, valor) {
  try {
    const docRef = doc(db, "preferencias", userId);
    
    await updateDoc(docRef, {
      [campo]: valor,
      updatedAt: serverTimestamp()
    });

    return { ok: true, msg: "Preferencia actualizada" };
  } catch (error) {
    console.error("Error al actualizar preferencia:", error);
    return { ok: false, msg: "Error al actualizar" };
  }
}
