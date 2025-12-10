// src/services/chatService.js
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

import { db } from "../utils/firebase";

/* ----------------------------------------------------
   🔹 1. Inicializar chat si no existe
---------------------------------------------------- */
export async function inicializarChat(chatId, userA, userB) {
  const chatRef = doc(db, "chats", chatId);
  const snap = await getDoc(chatRef);

  if (!snap.exists()) {
    await setDoc(chatRef, {
      users: [userA, userB],
      typing: {},
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  }
}

/* ----------------------------------------------------
   🔹 2. Escuchar mensajes en tiempo real (subcolección)
---------------------------------------------------- */
export function escucharMensajesRealtime(chatId, callback) {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snap) => {
    const mensajes = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    callback(mensajes);
  });
}

/* ----------------------------------------------------
   🔹 3. Enviar mensaje
---------------------------------------------------- */
export async function enviarMensaje(chatId, mensaje) {
  const ref = collection(db, "chats", chatId, "messages");

  await addDoc(ref, {
    ...mensaje,
    createdAt: serverTimestamp(),
  });

  // actualizar chat "padre"
  await updateDoc(doc(db, "chats", chatId), {
    updatedAt: serverTimestamp(),
  });
}

/* ----------------------------------------------------
   🔹 4. Escribir / No escribir (typing)
---------------------------------------------------- */
export async function setTyping(chatId, userId, isTyping) {
  const chatRef = doc(db, "chats", chatId);

  const snap = await getDoc(chatRef);
  if (!snap.exists()) return;

  const data = snap.data().typing || {};

  await updateDoc(chatRef, {
    typing: {
      ...data,
      [userId]: isTyping,
    },
    updatedAt: serverTimestamp(),
  });
}

/* ----------------------------------------------------
   🔹 5. Cargar mensajes antiguos (scroll infinito)
---------------------------------------------------- */
export async function loadOlderMessages(chatId, pageSize = 20, oldestSnapshot = null) {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");

    let q;

    if (!oldestSnapshot) {
      q = query(messagesRef, orderBy("createdAt", "desc"), limit(pageSize));
    } else {
      q = query(
        messagesRef,
        orderBy("createdAt", "desc"),
        startAfter(oldestSnapshot),
        limit(pageSize)
      );
    }

    const snap = await getDocs(q);

    const olderMessages = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return {
      messages: olderMessages.reverse(), // orden ascendente
      lastVisible: snap.docs[snap.docs.length - 1] || null,
    };
  } catch (error) {
    console.error("Error loadOlderMessages:", error);
    return { messages: [], lastVisible: null };
  }
}

/* ----------------------------------------------------
   🔹 6. Añadir reacción a mensaje
---------------------------------------------------- */
export async function añadirReacción(chatId, messageId, userId, emoji) {
  const msgRef = doc(db, "chats", chatId, "messages", messageId);
  const snap = await getDoc(msgRef);

  if (!snap.exists()) return;

  const data = snap.data();
  const reactions = data.reactions || {};

  reactions[userId] = emoji; // override

  await updateDoc(msgRef, { reactions });
}

/* ----------------------------------------------------
   🔹 7. Eliminar reacción
---------------------------------------------------- */
export async function eliminarReacción(chatId, messageId, userId) {
  const msgRef = doc(db, "chats", chatId, "messages", messageId);
  const snap = await getDoc(msgRef);

  if (!snap.exists()) return;

  const data = snap.data();
  const reactions = data.reactions || {};

  delete reactions[userId];

  await updateDoc(msgRef, { reactions });
}
