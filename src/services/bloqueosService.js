// src/services/bloqueosService.js
import { db } from "../utils/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  doc,
  serverTimestamp 
} from "firebase/firestore";

/**
 * Bloquear a un usuario
 * @param {string} miUid - ID del usuario que bloquea
 * @param {string} bloqueadoUid - ID del usuario bloqueado
 */
export async function bloquearUsuario(miUid, bloqueadoUid) {
  try {
    if (!miUid || !bloqueadoUid) {
      return { ok: false, msg: "IDs inválidos" };
    }

    if (miUid === bloqueadoUid) {
      return { ok: false, msg: "No puedes bloquearte a ti mismo" };
    }

    // Verificar si ya está bloqueado
    const q = query(
      collection(db, "bloqueos"),
      where("bloqueador", "==", miUid),
      where("bloqueado", "==", bloqueadoUid)
    );

    const existe = await getDocs(q);
    if (!existe.empty) {
      return { ok: false, msg: "Usuario ya bloqueado" };
    }

    // Crear bloqueo
    await addDoc(collection(db, "bloqueos"), {
      bloqueador: miUid,
      bloqueado: bloqueadoUid,
      timestamp: serverTimestamp(),
    });

    return { ok: true, msg: "Usuario bloqueado exitosamente" };
  } catch (error) {
    console.error("Error al bloquear usuario:", error);
    return { ok: false, msg: "Error al bloquear usuario" };
  }
}

/**
 * Desbloquear a un usuario
 * @param {string} miUid - ID del usuario que desbloquea
 * @param {string} bloqueadoUid - ID del usuario a desbloquear
 */
export async function desbloquearUsuario(miUid, bloqueadoUid) {
  try {
    const q = query(
      collection(db, "bloqueos"),
      where("bloqueador", "==", miUid),
      where("bloqueado", "==", bloqueadoUid)
    );

    const snap = await getDocs(q);
    
    if (snap.empty) {
      return { ok: false, msg: "No existe el bloqueo" };
    }

    // Eliminar todos los documentos de bloqueo
    for (const docSnap of snap.docs) {
      await deleteDoc(doc(db, "bloqueos", docSnap.id));
    }

    return { ok: true, msg: "Usuario desbloqueado" };
  } catch (error) {
    console.error("Error al desbloquear:", error);
    return { ok: false, msg: "Error al desbloquear" };
  }
}

/**
 * Obtener lista de usuarios bloqueados
 * @param {string} miUid - ID del usuario
 */
export async function obtenerBloqueados(miUid) {
  try {
    const q = query(
      collection(db, "bloqueos"),
      where("bloqueador", "==", miUid)
    );

    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  } catch (error) {
    console.error("Error al obtener bloqueados:", error);
    return [];
  }
}

/**
 * Verificar si un usuario está bloqueado
 * @param {string} miUid - ID del usuario que verifica
 * @param {string} otroUid - ID del usuario a verificar
 */
export async function estaBloqueado(miUid, otroUid) {
  try {
    const q = query(
      collection(db, "bloqueos"),
      where("bloqueador", "==", miUid),
      where("bloqueado", "==", otroUid)
    );

    const snap = await getDocs(q);
    return !snap.empty;
  } catch (error) {
    console.error("Error al verificar bloqueo:", error);
    return false;
  }
}
