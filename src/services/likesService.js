import { db } from "../utils/firebase"; // ← IMPORT CORREGIDO
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";

/**
 * Dar like entre usuarios y detectar match si hay reciprocidad
 * @param {string} miUid  → ID del usuario que da like
 * @param {string} otroUid → ID del usuario que recibe el like
 */
export async function darLike(miUid, otroUid) {
  try {
    if (!miUid || !otroUid) {
      return { ok: false, msg: "IDs de usuarios inválidos" };
    }

    if (miUid === otroUid) {
      return { ok: false, msg: "No puedes darte like a ti mismo" };
    }

    // 🔎 1) Verificar si el like ya existe (evitar duplicados)
    const likeQuery = query(
      collection(db, "likes"),
      where("from", "==", miUid),
      where("to", "==", otroUid)
    );

    const yaExiste = await getDocs(likeQuery);
    if (!yaExiste.empty) {
      return { ok: false, msg: "Ya le diste like antes" };
    }

    // ❤️ 2) Registrar like (añadir tipo por defecto)
    await addDoc(collection(db, "likes"), {
      from: miUid,
      to: otroUid,
      tipo: "like",
      timestamp: serverTimestamp(),
    });

    // 🔥 3) Verificar reciprocidad para detectar MATCH
    const reciprocoQuery = query(
      collection(db, "likes"),
      where("from", "==", otroUid),
      where("to", "==", miUid)
    );

    const reciproco = await getDocs(reciprocoQuery);

    if (!reciproco.empty) {
      // Evitar crear match duplicado: buscar si ya existe un match entre ambos
      const existingMatchQuery = query(
        collection(db, "matches"),
        where("usuarios", "array-contains", miUid)
      );
      const existingMatchSnap = await getDocs(existingMatchQuery);
      const existingMatchDoc = existingMatchSnap.docs.find(d => d.data().usuarios.includes(otroUid));

      if (existingMatchDoc) {
        const otherUserDoc = await getDoc(doc(db, "usuarios", otroUid));
        const otherUserData = otherUserDoc.exists() ? otherUserDoc.data() : null;
        return { 
          ok: true, 
          match: true, 
          msg: "🔥 Ya existe un match",
          matchId: existingMatchDoc.id,
          matchedUser: otherUserData ? { id: otroUid, ...otherUserData } : null
        };
      }

      // Registrar nuevo match
      const matchDoc = await addDoc(collection(db, "matches"), {
        usuarios: [miUid, otroUid],
        timestamp: serverTimestamp(),
      });

      const otherUserDoc = await getDoc(doc(db, "usuarios", otroUid));
      const otherUserData = otherUserDoc.exists() ? otherUserDoc.data() : null;

      return { 
        ok: true, 
        match: true, 
        msg: "🔥 ¡Es un match!",
        matchId: matchDoc.id,
        matchedUser: otherUserData ? { id: otroUid, ...otherUserData } : null
      };
    }

    return { ok: true, match: false, msg: "❤️ Like enviado" };

  } catch (e) {
    console.error("Error al dar like:", e);
    return { ok: false, msg: "Error al procesar el like" };
  }
}

/**
 * Crear like con tipo (like, superlike, pass)
 * @param {string} usuarioId - ID del usuario que da el like
 * @param {string} perfilId - ID del perfil que recibe el like
 * @param {string} tipo - 'like', 'superlike', 'pass'
 */
export async function crearLike(usuarioId, perfilId, tipo = 'like') {
  try {
    if (tipo === 'pass') {
      // Registrar pass usando mismos campos que el sistema
      await addDoc(collection(db, "likes"), {
        from: usuarioId,
        to: perfilId,
        tipo: 'pass',
        timestamp: serverTimestamp(),
      });
      return { ok: true, match: false };
    }

    // Para like y superlike, usar la función existente
    const resultado = await darLike(usuarioId, perfilId);
    
    // Si es superlike, actualizar el registro
    if (tipo === 'superlike' && resultado.ok) {
      // Buscar el like recién creado y actualizarlo
      const likeQuery = query(
        collection(db, "likes"),
        where("from", "==", usuarioId),
        where("to", "==", perfilId)
      );
      
      const likeSnap = await getDocs(likeQuery);
      if (!likeSnap.empty) {
        const likeDoc = likeSnap.docs[0];
        await updateDoc(likeDoc.ref, { tipo: 'superlike' });
      }
    }

    // Si no hay match pero el like fue exitoso, obtener datos del usuario
    if (resultado.ok && !resultado.match) {
      const otherUserDoc = await getDoc(doc(db, "usuarios", perfilId));
      const otherUserData = otherUserDoc.exists() ? otherUserDoc.data() : null;
      
      return {
        ...resultado,
        likedUser: otherUserData ? {
          id: perfilId,
          ...otherUserData
        } : null
      };
    }

    return resultado;
  } catch (error) {
    console.error('Error creando like:', error);
    return { ok: false, msg: "Error al procesar la acción" };
  }
}

/**
 * Obtener matches del usuario
 * @param {string} userId - ID del usuario
 */
export async function obtenerMatches(userId) {
  try {
    const matchesQuery = query(
      collection(db, "matches"),
      where("usuarios", "array-contains", userId)
    );

    const matchesSnap = await getDocs(matchesQuery);
    const matches = [];

    for (const matchDoc of matchesSnap.docs) {
      const matchData = matchDoc.data();
      const otherUserId = matchData.usuarios.find(id => id !== userId);
      
      if (otherUserId) {
        // Obtener datos del otro usuario
        const otherUserDoc = await getDoc(doc(db, "usuarios", otherUserId));
        if (otherUserDoc.exists()) {
          const otherUserData = otherUserDoc.data();
          
          // Verificar si fue superlike
          const likeQuery = query(
            collection(db, "likes"),
            where("from", "==", otherUserId),
            where("to", "==", userId)
          );
          
          const likeSnap = await getDocs(likeQuery);
          const tipoLike = !likeSnap.empty ? likeSnap.docs[0].data().tipo || 'like' : 'like';

          matches.push({
            id: matchDoc.id,
            nombre: otherUserData.nombre,
            fotoUrl: otherUserData.fotoUrl,
            edad: otherUserData.edad,
            ciudad: otherUserData.ciudad,
            tipo: tipoLike,
            fechaMatch: matchData.timestamp,
            otherUserId
          });
        }
      }
    }

    // Ordenar robustamente por timestamp (Firestore Timestamp -> millis)
    return matches.sort((a, b) => {
      const aTs = a.fechaMatch && typeof a.fechaMatch.toMillis === 'function' ? a.fechaMatch.toMillis() : (a.fechaMatch || 0);
      const bTs = b.fechaMatch && typeof b.fechaMatch.toMillis === 'function' ? b.fechaMatch.toMillis() : (b.fechaMatch || 0);
      return bTs - aTs;
    });
  } catch (error) {
    console.error('Error obteniendo matches:', error);
    return [];
  }
}

/**
 * Obtener likes recibidos por el usuario
 * @param {string} userId - ID del usuario
 */
export async function obtenerLikesRecibidos(userId) {
  try {
    const likesQuery = query(
      collection(db, "likes"),
      where("to", "==", userId),
      where("tipo", "in", ["like", "superlike"])
    );

    const likesSnap = await getDocs(likesQuery);
    const likes = [];

    for (const likeDoc of likesSnap.docs) {
      const likeData = likeDoc.data();
      
      // Verificar que no sea un match ya existente
      const matchQuery = query(
        collection(db, "matches"),
        where("usuarios", "array-contains", userId)
      );
      
      const matchSnap = await getDocs(matchQuery);
      const esMatch = matchSnap.docs.some(doc => {
        const usuarios = doc.data().usuarios;
        return usuarios.includes(userId) && usuarios.includes(likeData.from);
      });

      if (!esMatch) {
        // Obtener datos del usuario que dio like
        const userDoc = await getDoc(doc(db, "usuarios", likeData.from));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          likes.push({
            id: likeDoc.id,
            nombre: userData.nombre,
            fotoUrl: userData.fotoUrl,
            edad: userData.edad,
            ciudad: userData.ciudad,
            tipo: likeData.tipo || 'like',
            fecha: likeData.timestamp,
            userId: likeData.from
          });
        }
      }
    }

    // Ordenar robustamente por timestamp
    return likes.sort((a, b) => {
      const aTs = a.fecha && typeof a.fecha.toMillis === 'function' ? a.fecha.toMillis() : (a.fecha || 0);
      const bTs = b.fecha && typeof b.fecha.toMillis === 'function' ? b.fecha.toMillis() : (b.fecha || 0);
      return bTs - aTs;
    });
  } catch (error) {
    console.error('Error obteniendo likes recibidos:', error);
    return [];
  }
}
