import { db } from "../utils/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Crea un chat entre dos usuarios si aún no existe.
 * @param {string} user1 - UID del usuario logueado
 * @param {string} user2 - UID del otro usuario
 * @returns {Promise<string>} chatId - ID del chat existente o nuevo
 */
export const crearChatSiNoExiste = async (user1, user2) => {
  try {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", user1));
    const snapshot = await getDocs(q);

    // Verificar si ya existe un chat con ambos usuarios
    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (data.participants.includes(user2)) {
        return doc.id; // Chat ya existe
      }
    }

    // Crear nuevo chat
    const nuevoChat = await addDoc(chatsRef, {
      participants: [user1, user2],
      createdAt: serverTimestamp(),
    });

    return nuevoChat.id;
  } catch (error) {
    console.error("Error creando chat:", error);
    throw error;
  }
};
