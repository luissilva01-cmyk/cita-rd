// src/services/likesService.js
import { db } from "../utils/firebase";
import {
  collection,
  query,
  where,
  addDoc,
  getDocs
} from "firebase/firestore";

/**
 * Guarda un like entre dos usuarios
 * @param {string} fromUID - UID del usuario que da like
 * @param {string} toUID - UID del usuario que recibe el like
 */
export async function darLike(fromUID, toUID) {
  try {
    // Primero verificamos si ya existe el like
    const existe = await yaLeDioLike(fromUID, toUID);
    if (existe) return { ok: false, msg: "Ya habías dado like antes" };

    const docRef = await addDoc(collection(db, "likes"), {
      fromUID,
      toUID,
      timestamp: Date.now(),
    });

    return { ok: true, id: docRef.id };
  } catch (err) {
    console.error("Error al dar like:", err);
    return { ok: false, error: err };
  }
}

/**
 * Verifica si un usuario ya dio like a otro
 */
export async function yaLeDioLike(fromUID, toUID) {
  try {
    const q = query(
      collection(db, "likes"),
      where("fromUID", "==", fromUID),
      where("toUID", "==", toUID)
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (err) {
    console.error("Error verificando like:", err);
    return false;
  }
}

/**
 * Obtiene los likes que un usuario ha recibido
 */
export async function obtenerLikesRecibidos(toUID) {
  try {
    const q = query(
      collection(db, "likes"),
      where("toUID", "==", toUID)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error obteniendo likes recibidos:", err);
    return [];
  }
}

/**
 * Verifica si existe match (ambos se dieron like)
 */
export async function hayMatch(uidA, uidB) {
  try {
    const likeA = await yaLeDioLike(uidA, uidB); // A → B
    const likeB = await yaLeDioLike(uidB, uidA); // B → A

    return likeA && likeB;
  } catch (err) {
    console.error("Error verificando match:", err);
    return false;
  }
}
