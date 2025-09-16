// src/services/chatService.js
import { db } from "../utils/firebase"; // ruta corregida
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Crear un chat entre dos usuarios
export const crearChat = async (uid1, uid2) => {
  const chatId = [uid1, uid2].sort().join("_"); // ID único basado en los dos uids

  await setDoc(doc(db, "chats", chatId), {
    participants: [uid1, uid2],
    createdAt: serverTimestamp(),
  });

  return chatId; // devolvemos el ID del chat
};
