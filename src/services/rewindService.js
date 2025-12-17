// src/services/rewindService.js
import { db } from "../utils/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  deleteDoc,
  doc
} from "firebase/firestore";

/**
 * Registrar una acción de swipe para poder deshacerla
 * @param {string} userId - ID del usuario que hace swipe
 * @param {string} perfilId - ID del perfil al que se le hizo swipe
 * @param {string} accion - "like" o "skip"
 */
export async function registrarSwipe(userId, perfilId, accion) {
  try {
    await addDoc(collection(db, "swipes"), {
      userId,
      perfilId,
      accion,
      timestamp: serverTimestamp(),
      deshecho: false
    });

    return { ok: true };
  } catch (error) {
    console.error("Error al registrar swipe:", error);
    return { ok: false, msg: "Error al registrar acción" };
  }
}

/**
 * Obtener el último swipe del usuario para poder deshacerlo
 * @param {string} userId - ID del usuario
 */
export async function obtenerUltimoSwipe(userId) {
  try {
    const q = query(
      collection(db, "swipes"),
      where("userId", "==", userId),
      where("deshecho", "==", false),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { ok: false, msg: "No hay acciones para deshacer" };
    }

    const swipe = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    };

    return { ok: true, data: swipe };
  } catch (error) {
    console.error("Error al obtener último swipe:", error);
    return { ok: false, msg: "Error al obtener última acción" };
  }
}

/**
 * Deshacer el último swipe
 * @param {string} userId - ID del usuario
 */
export async function deshacerUltimoSwipe(userId) {
  try {
    // Obtener último swipe
    const resultado = await obtenerUltimoSwipe(userId);
    
    if (!resultado.ok) {
      return resultado;
    }

    const swipe = resultado.data;

    // Si fue un like, eliminar el like de la colección likes
    if (swipe.accion === "like") {
      const likesQuery = query(
        collection(db, "likes"),
        where("from", "==", userId),
        where("to", "==", swipe.perfilId)
      );

      const likesSnapshot = await getDocs(likesQuery);
      
      // Eliminar likes
      for (const likeDoc of likesSnapshot.docs) {
        await deleteDoc(doc(db, "likes", likeDoc.id));
      }

      // Si había match, también eliminarlo
      const matchesQuery = query(
        collection(db, "matches"),
        where("usuarios", "array-contains", userId)
      );

      const matchesSnapshot = await getDocs(matchesQuery);
      
      for (const matchDoc of matchesSnapshot.docs) {
        const matchData = matchDoc.data();
        if (matchData.usuarios.includes(swipe.perfilId)) {
          await deleteDoc(doc(db, "matches", matchDoc.id));
        }
      }
    }

    // Marcar swipe como deshecho
    await deleteDoc(doc(db, "swipes", swipe.id));

    return { 
      ok: true, 
      msg: "Acción deshecha exitosamente",
      accion: swipe.accion,
      perfilId: swipe.perfilId
    };
  } catch (error) {
    console.error("Error al deshacer swipe:", error);
    return { ok: false, msg: "Error al deshacer acción" };
  }
}

/**
 * Verificar si el usuario puede usar rewind
 * @param {string} userId - ID del usuario
 */
export async function puedeUsarRewind(userId) {
  try {
    const resultado = await obtenerUltimoSwipe(userId);
    return resultado.ok;
  } catch (error) {
    console.error("Error al verificar rewind:", error);
    return false;
  }
}

/**
 * Obtener historial de swipes del usuario
 * @param {string} userId - ID del usuario
 * @param {number} limite - Número máximo de swipes a obtener
 */
export async function obtenerHistorialSwipes(userId, limite = 10) {
  try {
    const q = query(
      collection(db, "swipes"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(limite)
    );

    const snapshot = await getDocs(q);
    
    const swipes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { ok: true, data: swipes };
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return { ok: false, msg: "Error al obtener historial" };
  }
}