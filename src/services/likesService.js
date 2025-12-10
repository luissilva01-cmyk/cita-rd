import { db } from "../utils/firebase"; // ← IMPORT CORREGIDO
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
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

    // ❤️ 2) Registrar like
    await addDoc(collection(db, "likes"), {
      from: miUid,
      to: otroUid,
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
      // Registrar match
      await addDoc(collection(db, "matches"), {
        usuarios: [miUid, otroUid],
        timestamp: serverTimestamp(),
      });

      return { ok: true, match: true, msg: "🔥 ¡Es un match!" };
    }

    return { ok: true, match: false, msg: "❤️ Like enviado" };

  } catch (e) {
    console.error("Error al dar like:", e);
    return { ok: false, msg: "Error al procesar el like" };
  }
}
