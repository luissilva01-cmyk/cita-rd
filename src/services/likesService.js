// src/services/likesService.js
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase";
import { crearChatSiNoExiste } from "./chatService";

/**
 * Registrar un like de A hacia B
 */
export async function darLike(uidA, uidB) {
  try {
    const refA_B = doc(db, "likes", `${uidA}_${uidB}`);

    await setDoc(refA_B, {
      from: uidA,
      to: uidB,
      createdAt: serverTimestamp(),
    });

    // Revisar si el otro ya dio like
    const refB_A = doc(db, "likes", `${uidB}_${uidA}`);
    const snapB_A = await getDoc(refB_A);

    const esMatch = snapB_A.exists();

    if (esMatch) {
      await crearChatSiNoExiste(uidA, uidB);
    }

    return {
      ok: true,
      match: esMatch,
    };

  } catch (error) {
    console.error("Error en darLike:", error);
    return {
      ok: false,
      msg: "Hubo un error al dar like.",
    };
  }
}

/**
 * Ver si A ya le dio like a B
 */
export async function yaLeDioLike(uidA, uidB) {
  try {
    const ref = doc(db, "likes", `${uidA}_${uidB}`);
    const snap = await getDoc(ref);
    return snap.exists();
  } catch (error) {
    console.error("Error en yaLeDioLike:", error);
    return false;
  }
}

/**
 * Compatibilidad: devolver si existe match
 */
export async function hayMatch(uidA, uidB) {
  try {
    const refA_B = doc(db, "likes", `${uidA}_${uidB}`);
    const refB_A = doc(db, "likes", `${uidB}_${uidA}`);

    const [snap1, snap2] = await Promise.all([
      getDoc(refA_B),
      getDoc(refB_A),
    ]);

    return snap1.exists() && snap2.exists();

  } catch (error) {
    console.error("Error en hayMatch:", error);
    return false;
  }
}
