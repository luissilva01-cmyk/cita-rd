// src/services/storiesService.js
import { db } from "../utils/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";

/**
 * Crear una nueva story
 * @param {string} userId - ID del usuario
 * @param {string} tipo - 'imagen' o 'texto'
 * @param {string} contenido - URL de imagen o texto
 * @param {string} backgroundColor - Color de fondo (para stories de texto)
 */
export async function crearStory(userId, tipo, contenido, backgroundColor = "#FF6B6B") {
  try {
    const storyRef = await addDoc(collection(db, "stories"), {
      userId,
      tipo,
      contenido,
      backgroundColor,
      fechaCreacion: serverTimestamp(),
      fechaExpiracion: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      vistas: [],
      activa: true
    });

    return { ok: true, storyId: storyRef.id };
  } catch (error) {
    console.error("Error al crear story:", error);
    return { ok: false, msg: "Error al crear story" };
  }
}

/**
 * Obtener stories activas de usuarios
 * @param {array} userIds - IDs de usuarios para obtener sus stories
 */
export async function obtenerStoriesActivas(userIds = []) {
  try {
    const ahora = new Date();
    
    let q;
    if (userIds.length > 0) {
      q = query(
        collection(db, "stories"),
        where("userId", "in", userIds),
        where("activa", "==", true),
        where("fechaExpiracion", ">", ahora),
        orderBy("fechaExpiracion"),
        orderBy("fechaCreacion", "desc")
      );
    } else {
      q = query(
        collection(db, "stories"),
        where("activa", "==", true),
        where("fechaExpiracion", ">", ahora),
        orderBy("fechaExpiracion"),
        orderBy("fechaCreacion", "desc")
      );
    }

    const snapshot = await getDocs(q);
    const stories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Agrupar por usuario
    const storiesPorUsuario = {};
    stories.forEach(story => {
      if (!storiesPorUsuario[story.userId]) {
        storiesPorUsuario[story.userId] = [];
      }
      storiesPorUsuario[story.userId].push(story);
    });

    return { ok: true, data: storiesPorUsuario };
  } catch (error) {
    console.error("Error al obtener stories:", error);
    return { ok: false, msg: "Error al obtener stories" };
  }
}

/**
 * Marcar story como vista
 * @param {string} storyId - ID de la story
 * @param {string} viewerId - ID del usuario que ve la story
 */
export async function marcarStoryVista(storyId, viewerId) {
  try {
    const storyRef = doc(db, "stories", storyId);
    
    await updateDoc(storyRef, {
      vistas: arrayUnion({
        userId: viewerId,
        fechaVista: serverTimestamp()
      })
    });

    return { ok: true };
  } catch (error) {
    console.error("Error al marcar story vista:", error);
    return { ok: false, msg: "Error al marcar vista" };
  }
}

/**
 * Eliminar story
 * @param {string} storyId - ID de la story
 * @param {string} userId - ID del propietario
 */
export async function eliminarStory(storyId, userId) {
  try {
    const storyRef = doc(db, "stories", storyId);
    
    // Marcar como inactiva en lugar de eliminar
    await updateDoc(storyRef, {
      activa: false
    });

    return { ok: true };
  } catch (error) {
    console.error("Error al eliminar story:", error);
    return { ok: false, msg: "Error al eliminar story" };
  }
}

/**
 * Obtener stories de un usuario específico
 * @param {string} userId - ID del usuario
 */
export async function obtenerStoriesUsuario(userId) {
  try {
    const ahora = new Date();
    
    const q = query(
      collection(db, "stories"),
      where("userId", "==", userId),
      where("activa", "==", true),
      where("fechaExpiracion", ">", ahora),
      orderBy("fechaExpiracion"),
      orderBy("fechaCreacion", "desc")
    );

    const snapshot = await getDocs(q);
    const stories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { ok: true, data: stories };
  } catch (error) {
    console.error("Error al obtener stories del usuario:", error);
    return { ok: false, msg: "Error al obtener stories" };
  }
}

/**
 * Limpiar stories expiradas (función de mantenimiento)
 */
export async function limpiarStoriesExpiradas() {
  try {
    const ahora = new Date();
    
    const q = query(
      collection(db, "stories"),
      where("fechaExpiracion", "<", ahora)
    );

    const snapshot = await getDocs(q);
    
    const promesas = snapshot.docs.map(doc => 
      updateDoc(doc.ref, { activa: false })
    );

    await Promise.all(promesas);

    return { ok: true, eliminadas: snapshot.docs.length };
  } catch (error) {
    console.error("Error al limpiar stories:", error);
    return { ok: false, msg: "Error al limpiar stories" };
  }
}

// Colores predefinidos para stories de texto
export const COLORES_STORY = [
  "#FF6B6B", // Rojo coral
  "#4ECDC4", // Turquesa
  "#45B7D1", // Azul cielo
  "#96CEB4", // Verde menta
  "#FFEAA7", // Amarillo suave
  "#DDA0DD", // Ciruela
  "#98D8C8", // Verde agua
  "#F7DC6F", // Amarillo dorado
  "#BB8FCE", // Lavanda
  "#85C1E9"  // Azul claro
];