// src/utils/firestore.js
import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

// ⬇ Guarda like
export async function darLike(usuarioActualId, usuarioLikeId) {
  try {
    // Prevenir duplicados
    const q = query(
      collection(db, "likes"),
      where("from", "==", usuarioActualId),
      where("to", "==", usuarioLikeId)
    );

    const existing = await getDocs(q);
    if (!existing.empty) return { ok: false, msg: "Ya lo habías dado like" };

    await addDoc(collection(db, "likes"), {
      from: usuarioActualId,
      to: usuarioLikeId,
      timestamp: Date.now(),
    });

    return { ok: true, msg: "Like enviado" };

  } catch (e) {
    console.error(e);
    return { ok: false, msg: "Error al dar like" };
  }
}
