// src/services/chatService.js
import { db } from "../utils/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

/**
 * Crear chat solo si no existe
 */
export async function crearChatSiNoExiste(chatId, userA, userB) {
  const chatRef = doc(db, "chats", chatId);
  const snap = await getDoc(chatRef);

  if (!snap.exists()) {
    await updateDoc(chatRef, {
      users: [userA, userB],
      messages: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      typing: {},
    }).catch(async () => {
      // Si updateDoc falla porque no existe, usamos setDoc
      const { setDoc } = await import("firebase/firestore");
      await setDoc(chatRef, {
        users: [userA, userB],
        messages: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        typing: {},
      });
    });
  }
}

/**
 * Enviar un mensaje
 */
export async function enviarMensaje(chatId, message) {
  const chatRef = doc(db, "chats", chatId);

  await updateDoc(chatRef, {
    messages: message,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Actualizar estado "typing"
 */
export async function setTyping(chatId, userId, isTyping) {
  const chatRef = doc(db, "chats", chatId);
  const snap = await getDoc(chatRef);

  if (!snap.exists()) return;

  await updateDoc(chatRef, {
    typing: {
      ...snap.data().typing,
      [userId]: isTyping,
    },
    updatedAt: serverTimestamp(),
  });
}
