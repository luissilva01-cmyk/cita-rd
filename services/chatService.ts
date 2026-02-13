import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  orderBy, 
  serverTimestamp,
  where,
  getDocs,
  getDoc,
  setDoc,
  limit,
  startAfter,
  DocumentSnapshot,
  deleteField
} from "firebase/firestore";
import { UserProfile, Message } from '../types';
import { logger } from '../utils/logger';
import { retryWithBackoff } from '../utils/retry';

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  timestamp: number;
  serverTimestamp?: any;
  // Información de los participantes (se llena dinámicamente)
  otherUser?: UserProfile;
}

// Crear un nuevo chat entre dos usuarios
export const createChat = async (currentUserId: string, otherUserId: string): Promise<string> => {
  return retryWithBackoff(
    async () => {
      const chatData = {
        participants: [currentUserId, otherUserId],
        lastMessage: '',
        timestamp: Date.now(),
        serverTimestamp: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, "chats"), chatData);
      return docRef.id;
    },
    {
      maxRetries: 3,
      baseDelay: 1000,
      onRetry: (attempt) => {
        logger.chat.warn(`Retrying createChat, attempt ${attempt}`, { currentUserId, otherUserId });
      }
    }
  );
};

// Obtener chats del usuario actual
export const getUserChats = (
  userId: string, 
  callback: (chats: Chat[]) => void,
  chatLimit: number = 20
) => {
  const q = query(
    collection(db, "chats"), 
    where("participants", "array-contains", userId),
    orderBy("timestamp", "desc"),
    limit(chatLimit)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const chats: Chat[] = [];
    querySnapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() } as Chat);
    });
    
    logger.chat.success('Chats cargados', { count: chats.length, limit: chatLimit });
    callback(chats);
  });
};

// Enviar mensaje a un chat (actualizado para soportar diferentes tipos)
export const sendMessage = async (
  chatId: string, 
  senderId: string, 
  text?: string,
  type: Message['type'] = 'text',
  content?: string,
  duration?: number
) => {
  return retryWithBackoff(
    async () => {
      const messageData: any = {
        senderId,
        type,
        timestamp: Date.now(),
        serverTimestamp: serverTimestamp(),
        isRead: false
      };

      // Agregar contenido según el tipo
      if (type === 'text' && text) {
        messageData.text = text;
      } else if (type === 'emoji' && content) {
        messageData.content = content;
      } else if (type === 'voice' && content && duration) {
        messageData.content = content; // URL del archivo de audio
        messageData.duration = duration;
      } else if ((type === 'image' || type === 'video') && content) {
        messageData.content = content; // URL del archivo
      } else if (type === 'story_reaction' && text) {
        // Para reacciones a historias, el emoji viene en el parámetro text
        messageData.text = text;
      }

      await addDoc(collection(db, "chats", chatId, "messages"), messageData);
      
      // Actualizar último mensaje del chat
      const lastMessageText = type === 'text' ? text : 
                             type === 'emoji' ? content :
                             type === 'voice' ? '🎤 Mensaje de voz' :
                             type === 'image' ? '📷 Imagen' :
                             type === 'video' ? '🎥 Video' : 
                             type === 'story_reaction' ? `${text} Reaccionó a tu historia` :
                             'Mensaje';
      
      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: lastMessageText,
        timestamp: Date.now(),
        serverTimestamp: serverTimestamp()
      });
    },
    {
      maxRetries: 3,
      baseDelay: 1000,
      onRetry: (attempt) => {
        logger.chat.warn(`Retrying sendMessage, attempt ${attempt}`, { chatId, type });
      }
    }
  );
};

// Escuchar mensajes de un chat en tiempo real
export const listenToMessages = (
  chatId: string, 
  callback: (messages: Message[]) => void,
  messageLimit: number = 50
) => {
  const q = query(
    collection(db, "chats", chatId, "messages"), 
    orderBy("timestamp", "desc"),
    limit(messageLimit)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as Message);
    });
    
    // Invertir orden para mostrar más antiguos primero
    messages.reverse();
    
    logger.chat.success('Mensajes cargados', { count: messages.length, limit: messageLimit });
    callback(messages);
  });
};

// Obtener información de un perfil
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    return await retryWithBackoff(
      async () => {
        const q = query(collection(db, "perfiles"), where("id", "==", userId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          return { id: doc.id, ...doc.data() } as UserProfile;
        }
        return null;
      },
      {
        maxRetries: 3,
        baseDelay: 1000,
        onRetry: (attempt) => {
          logger.chat.warn(`Retrying getUserProfile, attempt ${attempt}`, { userId });
        }
      }
    );
  } catch (error) {
    logger.chat.error("Error obteniendo perfil de usuario", error);
    return null;
  }
};

// Buscar o crear chat entre dos usuarios
export const findOrCreateChat = async (currentUserId: string, otherUserId: string): Promise<string> => {
  return retryWithBackoff(
    async () => {
      // Buscar chat existente
      const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", currentUserId)
      );
      
      const querySnapshot = await getDocs(q);
      
      for (const doc of querySnapshot.docs) {
        const chatData = doc.data();
        
        if (chatData.participants.includes(otherUserId)) {
          return doc.id; // Chat ya existe
        }
      }
      
      // Si no existe, crear nuevo chat
      const newChatId = await createChat(currentUserId, otherUserId);
      return newChatId;
    },
    {
      maxRetries: 3,
      baseDelay: 1000,
      onRetry: (attempt) => {
        logger.chat.warn(`Retrying findOrCreateChat, attempt ${attempt}`, { currentUserId, otherUserId });
      }
    }
  );
};

// Actualizar estado de typing
export const updateTypingStatus = async (
  chatId: string, 
  userId: string, 
  isTyping: boolean
): Promise<void> => {
  try {
    logger.chat.debug('Actualizando typing status', { chatId, userId, isTyping });
    const typingRef = doc(db, "chats", chatId, "typingStatus", userId);
    await updateDoc(typingRef, {
      isTyping,
      timestamp: serverTimestamp()
    }).catch(async (error) => {
      // Si el documento no existe, crearlo
      if (error.code === 'not-found') {
        await setDoc(typingRef, {
          isTyping,
          timestamp: serverTimestamp()
        });
      } else {
        throw error;
      }
    });
    logger.chat.success('Typing status actualizado', { isTyping });
  } catch (error) {
    logger.chat.error('Error actualizando typing status', error);
  }
};

// Escuchar estado de typing del otro usuario
export const listenToTypingStatus = (
  chatId: string, 
  userId: string, 
  callback: (isTyping: boolean) => void
) => {
  logger.chat.debug('Configurando listener para typing', { chatId, userId });
  
  const typingRef = doc(db, "chats", chatId, "typingStatus", userId);
  
  // Configurar listener con includeMetadataChanges para capturar cambios locales y remotos
  const unsubscribe = onSnapshot(
    typingRef,
    { includeMetadataChanges: true },
    (docSnapshot) => {
      logger.chat.debug('Snapshot de typing recibido', { 
        exists: docSnapshot.exists(),
        fromCache: docSnapshot.metadata.fromCache,
        hasPendingWrites: docSnapshot.metadata.hasPendingWrites
      });
      
      // Solo procesar cambios que vienen del servidor (no del cache local)
      if (!docSnapshot.metadata.hasPendingWrites) {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const isTyping = data.isTyping || false;
          logger.chat.debug('Typing status actualizado', { isTyping });
          callback(isTyping);
        } else {
          callback(false);
        }
      }
    },
    (error) => {
      logger.chat.error('Error en listener de typing', error);
      callback(false);
    }
  );
  
  return unsubscribe;
};

// Marcar mensajes como leídos
export const markMessagesAsRead = async (
  chatId: string,
  userId: string,
  messageIds: string[]
): Promise<void> => {
  try {
    logger.chat.debug('Marcando mensajes como leídos', { 
      chatId, 
      userId, 
      count: messageIds.length 
    });

    const updatePromises = messageIds.map(async (messageId) => {
      const messageRef = doc(db, "chats", chatId, "messages", messageId);
      await updateDoc(messageRef, {
        isRead: true,
        readBy: [userId], // Array con IDs de usuarios que leyeron
        readAt: Date.now()
      });
    });

    await Promise.all(updatePromises);
    
    logger.chat.success('Mensajes marcados como leídos', { count: messageIds.length });
  } catch (error) {
    logger.chat.error('Error marcando mensajes como leídos', error);
  }
};

// Borrar mensaje para el usuario actual
export const deleteMessageForMe = async (
  chatId: string,
  messageId: string,
  userId: string
): Promise<void> => {
  try {
    logger.chat.info('Borrando mensaje para usuario', { chatId, messageId, userId });

    const messageRef = doc(db, "chats", chatId, "messages", messageId);
    
    // Obtener el documento actual
    const messageDoc = await getDoc(messageRef);
    
    if (messageDoc.exists()) {
      const currentData = messageDoc.data();
      const deletedFor = currentData.deletedFor || [];
      
      // Agregar usuario a la lista de "borrado para"
      await updateDoc(messageRef, {
        deletedFor: [...deletedFor, userId]
      });
      
      logger.chat.success('Mensaje borrado para usuario', { messageId });
    } else {
      logger.chat.warn('Mensaje no encontrado', { messageId });
      throw new Error('Mensaje no encontrado');
    }
  } catch (error) {
    logger.chat.error('Error borrando mensaje para usuario', error);
    throw error;
  }
};

// Borrar mensaje para todos
export const deleteMessageForEveryone = async (
  chatId: string,
  messageId: string,
  senderId: string
): Promise<void> => {
  try {
    logger.chat.info('Borrando mensaje para todos', { chatId, messageId, senderId });

    const messageRef = doc(db, "chats", chatId, "messages", messageId);
    
    // Obtener el documento actual
    const messageDoc = await getDoc(messageRef);
    
    if (messageDoc.exists()) {
      const messageData = messageDoc.data();
      
      // Verificar que el usuario sea el remitente
      if (messageData.senderId !== senderId) {
        logger.chat.warn('Usuario no autorizado para borrar mensaje', { 
          messageSenderId: messageData.senderId, 
          requestUserId: senderId 
        });
        throw new Error('Solo el remitente puede borrar el mensaje para todos');
      }
      
      // Marcar como borrado para todos
      await updateDoc(messageRef, {
        deletedForEveryone: true,
        text: 'Este mensaje fue eliminado',
        content: deleteField(), // Usar deleteField() en lugar de undefined
        type: 'text'
      });
      
      logger.chat.success('Mensaje borrado para todos', { messageId });
    } else {
      logger.chat.warn('Mensaje no encontrado', { messageId });
      throw new Error('Mensaje no encontrado');
    }
  } catch (error) {
    logger.chat.error('Error borrando mensaje para todos', error);
    throw error;
  }
};