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
  where,
  deleteDoc
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";

import { db, storage } from "../utils/firebase";

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
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: { [userA]: 0, [userB]: 0 },
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
   🔹 3. Enviar mensaje de texto
---------------------------------------------------- */
export async function enviarMensaje(chatId, mensaje) {
  const ref = collection(db, "chats", chatId, "messages");

  const messageDoc = await addDoc(ref, {
    ...mensaje,
    createdAt: serverTimestamp(),
    type: 'text',
    status: 'sent'
  });

  // Actualizar chat "padre"
  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: mensaje.text || mensaje.texto,
    lastMessageTime: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return messageDoc.id;
}

/* ----------------------------------------------------
   🔹 4. Enviar foto
---------------------------------------------------- */
export async function enviarFoto(chatId, userId, file, caption = '') {
  try {
    // Subir imagen a Firebase Storage
    const timestamp = Date.now();
    const fileName = `chat-images/${chatId}/${timestamp}-${file.name}`;
    const storageRef = ref(storage, fileName);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Crear mensaje con la imagen
    const ref = collection(db, "chats", chatId, "messages");
    const messageDoc = await addDoc(ref, {
      uid: userId,
      type: 'image',
      imageUrl: downloadURL,
      imageName: file.name,
      imageSize: file.size,
      caption: caption,
      createdAt: serverTimestamp(),
      status: 'sent'
    });

    // Actualizar chat "padre"
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: caption || '📷 Foto',
      lastMessageTime: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return messageDoc.id;
  } catch (error) {
    console.error('Error enviando foto:', error);
    throw error;
  }
}

/* ----------------------------------------------------
   🔹 5. Enviar GIF
---------------------------------------------------- */
export async function enviarGif(chatId, userId, gifUrl, gifTitle = '') {
  try {
    const ref = collection(db, "chats", chatId, "messages");
    const messageDoc = await addDoc(ref, {
      uid: userId,
      type: 'gif',
      gifUrl: gifUrl,
      gifTitle: gifTitle,
      createdAt: serverTimestamp(),
      status: 'sent'
    });

    // Actualizar chat "padre"
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: '🎬 GIF',
      lastMessageTime: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return messageDoc.id;
  } catch (error) {
    console.error('Error enviando GIF:', error);
    throw error;
  }
}

/* ----------------------------------------------------
   🔹 6. Enviar mensaje de voz
---------------------------------------------------- */
export async function enviarMensajeVoz(chatId, userId, audioBlob, duration) {
  try {
    // Subir audio a Firebase Storage
    const timestamp = Date.now();
    const fileName = `chat-audio/${chatId}/${timestamp}-voice.webm`;
    const storageRef = ref(storage, fileName);
    
    const snapshot = await uploadBytes(storageRef, audioBlob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Crear mensaje con el audio
    const ref = collection(db, "chats", chatId, "messages");
    const messageDoc = await addDoc(ref, {
      uid: userId,
      type: 'voice',
      audioUrl: downloadURL,
      duration: duration,
      createdAt: serverTimestamp(),
      status: 'sent'
    });

    // Actualizar chat "padre"
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: '🎤 Mensaje de voz',
      lastMessageTime: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return messageDoc.id;
  } catch (error) {
    console.error('Error enviando mensaje de voz:', error);
    throw error;
  }
}

/* ----------------------------------------------------
   🔹 7. Escribir / No escribir (typing)
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
   🔹 8. Marcar mensajes como leídos
---------------------------------------------------- */
export async function marcarComoLeido(chatId, userId) {
  const chatRef = doc(db, "chats", chatId);
  
  try {
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) return;

    const chatData = chatSnap.data();
    const unreadCount = chatData.unreadCount || {};

    await updateDoc(chatRef, {
      [`unreadCount.${userId}`]: 0,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error marcando como leído:', error);
  }
}

/* ----------------------------------------------------
   🔹 9. Eliminar mensaje
---------------------------------------------------- */
export async function eliminarMensaje(chatId, messageId, userId) {
  try {
    const messageRef = doc(db, "chats", chatId, "messages", messageId);
    const messageSnap = await getDoc(messageRef);
    
    if (!messageSnap.exists()) return false;
    
    const messageData = messageSnap.data();
    
    // Solo el autor puede eliminar el mensaje
    if (messageData.uid !== userId) return false;

    // Si es una imagen, eliminar de Storage
    if (messageData.type === 'image' && messageData.imageUrl) {
      try {
        const imageRef = ref(storage, messageData.imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.log('Error eliminando imagen:', error);
      }
    }

    // Si es un audio, eliminar de Storage
    if (messageData.type === 'voice' && messageData.audioUrl) {
      try {
        const audioRef = ref(storage, messageData.audioUrl);
        await deleteObject(audioRef);
      } catch (error) {
        console.log('Error eliminando audio:', error);
      }
    }

    // Eliminar mensaje
    await deleteDoc(messageRef);
    return true;
  } catch (error) {
    console.error('Error eliminando mensaje:', error);
    return false;
  }
}

/* ----------------------------------------------------
   🔹 10. Cargar mensajes antiguos (scroll infinito)
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
   🔹 11. Añadir reacción a mensaje
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
   🔹 12. Eliminar reacción
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

/* ----------------------------------------------------
   🔹 13. Obtener conversaciones del usuario (mejorado)
---------------------------------------------------- */
export async function obtenerConversaciones(userId) {
  try {
    // Obtener todos los chats donde el usuario participa
    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef, 
      where("users", "array-contains", userId),
      orderBy("updatedAt", "desc")
    );
    const chatsSnap = await getDocs(q);

    const conversaciones = [];

    for (const chatDoc of chatsSnap.docs) {
      const chatData = chatDoc.data();
      
      // Obtener el otro usuario
      const otherUserId = chatData.users.find(id => id !== userId);
      if (!otherUserId) continue;

      // Obtener datos del otro usuario
      const otherUserDoc = await getDoc(doc(db, "usuarios", otherUserId));
      if (!otherUserDoc.exists()) continue;

      const otherUserData = otherUserDoc.data();

      // Obtener el último mensaje
      const messagesRef = collection(db, "chats", chatDoc.id, "messages");
      const lastMessageQuery = query(messagesRef, orderBy("createdAt", "desc"), limit(1));
      const lastMessageSnap = await getDocs(lastMessageQuery);
      
      let ultimoMensaje = null;
      if (!lastMessageSnap.empty) {
        ultimoMensaje = {
          id: lastMessageSnap.docs[0].id,
          ...lastMessageSnap.docs[0].data()
        };
      }

      // Contar mensajes no leídos
      const unreadCount = chatData.unreadCount?.[userId] || 0;

      conversaciones.push({
        id: chatDoc.id,
        otherUser: {
          id: otherUserId,
          nombre: otherUserData.nombre,
          fotoUrl: otherUserData.fotoUrl,
          enLinea: otherUserData.enLinea || false,
          ultimaActividad: otherUserData.ultimaActividad
        },
        ultimoMensaje,
        noLeidos: unreadCount,
        esNuevoMatch: !ultimoMensaje, // Es nuevo match si no hay mensajes
        updatedAt: chatData.updatedAt,
        typing: chatData.typing?.[otherUserId] || false
      });
    }

    return conversaciones;
  } catch (error) {
    console.error('Error obteniendo conversaciones:', error);
    return [];
  }
}

/* ----------------------------------------------------
   🔹 14. Buscar mensajes
---------------------------------------------------- */
export async function buscarMensajes(chatId, searchTerm) {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    const messages = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filtrar mensajes que contengan el término de búsqueda
    const filteredMessages = messages.filter(message => {
      if (message.type === 'text') {
        return message.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               message.texto?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (message.type === 'image') {
        return message.caption?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });

    return filteredMessages;
  } catch (error) {
    console.error('Error buscando mensajes:', error);
    return [];
  }
}

/* ----------------------------------------------------
   🔹 15. Obtener estadísticas del chat
---------------------------------------------------- */
export async function obtenerEstadisticasChat(chatId) {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef);
    const snap = await getDocs(q);

    const messages = snap.docs.map(doc => doc.data());
    
    const stats = {
      totalMessages: messages.length,
      textMessages: messages.filter(m => m.type === 'text').length,
      imageMessages: messages.filter(m => m.type === 'image').length,
      voiceMessages: messages.filter(m => m.type === 'voice').length,
      gifMessages: messages.filter(m => m.type === 'gif').length,
      messagesByUser: {},
      firstMessage: null,
      lastMessage: null
    };

    // Contar mensajes por usuario
    messages.forEach(message => {
      const userId = message.uid;
      stats.messagesByUser[userId] = (stats.messagesByUser[userId] || 0) + 1;
    });

    // Primer y último mensaje
    const sortedMessages = messages.sort((a, b) => 
      (a.createdAt?.toDate() || new Date()) - (b.createdAt?.toDate() || new Date())
    );
    
    if (sortedMessages.length > 0) {
      stats.firstMessage = sortedMessages[0];
      stats.lastMessage = sortedMessages[sortedMessages.length - 1];
    }

    return stats;
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return null;
  }
}