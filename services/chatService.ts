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
  setDoc
} from "firebase/firestore";
import { UserProfile, Message } from '../types';

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
  const chatData = {
    participants: [currentUserId, otherUserId],
    lastMessage: '',
    timestamp: Date.now(),
    serverTimestamp: serverTimestamp()
  };
  
  const docRef = await addDoc(collection(db, "chats"), chatData);
  return docRef.id;
};

// Obtener chats del usuario actual
export const getUserChats = (userId: string, callback: (chats: Chat[]) => void) => {
  const q = query(
    collection(db, "chats"), 
    where("participants", "array-contains", userId)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const chats: Chat[] = [];
    querySnapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() } as Chat);
    });
    
    // Ordenar manualmente por timestamp
    chats.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
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
};

// Escuchar mensajes de un chat en tiempo real
export const listenToMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  const q = query(
    collection(db, "chats", chatId, "messages"), 
    orderBy("timestamp", "asc")
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as Message);
    });
    callback(messages);
  });
};

// Obtener información de un perfil
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const q = query(collection(db, "perfiles"), where("id", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

// Buscar o crear chat entre dos usuarios
export const findOrCreateChat = async (currentUserId: string, otherUserId: string): Promise<string> => {
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
};

// Actualizar estado de typing
export const updateTypingStatus = async (
  chatId: string, 
  userId: string, 
  isTyping: boolean
): Promise<void> => {
  try {
    console.log('🔥 updateTypingStatus llamado:', { chatId, userId, isTyping });
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
    console.log('✅ Typing status actualizado en Firebase:', isTyping);
  } catch (error) {
    console.error('Error updating typing status:', error);
  }
};

// Escuchar estado de typing del otro usuario
export const listenToTypingStatus = (
  chatId: string, 
  userId: string, 
  callback: (isTyping: boolean) => void
) => {
  console.log('👂 ========================================');
  console.log('👂 CONFIGURANDO LISTENER PARA TYPING');
  console.log('👂 chatId:', chatId);
  console.log('👂 userId (escuchando a):', userId);
  console.log('👂 Path:', `chats/${chatId}/typingStatus/${userId}`);
  console.log('👂 ========================================');
  
  const typingRef = doc(db, "chats", chatId, "typingStatus", userId);
  
  // Configurar listener con includeMetadataChanges para capturar cambios locales y remotos
  const unsubscribe = onSnapshot(
    typingRef,
    { includeMetadataChanges: true },
    (docSnapshot) => {
      console.log('👂 ========================================');
      console.log('👂 SNAPSHOT RECIBIDO!');
      console.log('👂 Timestamp:', new Date().toISOString());
      console.log('👂 Exists:', docSnapshot.exists());
      console.log('👂 Data:', docSnapshot.data());
      console.log('👂 From cache:', docSnapshot.metadata.fromCache);
      console.log('👂 Has pending writes:', docSnapshot.metadata.hasPendingWrites);
      console.log('👂 userId:', userId);
      console.log('👂 ========================================');
      
      // Solo procesar cambios que vienen del servidor (no del cache local)
      if (!docSnapshot.metadata.hasPendingWrites) {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const isTyping = data.isTyping || false;
          console.log('👂 ✅ Llamando callback con isTyping=', isTyping);
          callback(isTyping);
        } else {
          console.log('👂 ⚠️ Documento no existe, callback con false');
          callback(false);
        }
      } else {
        console.log('👂 ⏭️ Ignorando cambio local (pending writes)');
      }
    },
    (error) => {
      console.error('👂 ❌ ERROR en listener:', error);
      callback(false);
    }
  );
  
  console.log('👂 ✅ Listener configurado exitosamente');
  return unsubscribe;
};