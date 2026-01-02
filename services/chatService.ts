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
  getDocs
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
  console.log('🔍 Buscando chats para userId:', userId);
  
  const q = query(
    collection(db, "chats"), 
    where("participants", "array-contains", userId)
    // Removemos orderBy temporalmente para evitar problemas de índices
  );
  
  return onSnapshot(q, (querySnapshot) => {
    console.log('📊 Documentos encontrados:', querySnapshot.size);
    
    const chats: Chat[] = [];
    querySnapshot.forEach((doc) => {
      console.log('📄 Chat encontrado:', doc.id, doc.data());
      chats.push({ id: doc.id, ...doc.data() } as Chat);
    });
    
    // Ordenar manualmente por timestamp
    chats.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    console.log('✅ Chats procesados:', chats.length);
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
  console.log('💾 sendMessage llamado con:', { chatId, senderId, text, type, content, duration });
  
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
    console.log('📱 Guardando reacción a historia:', text, 'Longitud:', text.length);
  }

  console.log('💾 Datos del mensaje a guardar:', messageData);

  await addDoc(collection(db, "chats", chatId, "messages"), messageData);
  console.log('✅ Mensaje guardado en Firebase:', messageData);
  
  // Actualizar último mensaje del chat
  const lastMessageText = type === 'text' ? text : 
                         type === 'emoji' ? content :
                         type === 'voice' ? '🎤 Mensaje de voz' :
                         type === 'image' ? '📷 Imagen' :
                         type === 'video' ? '🎥 Video' : 
                         type === 'story_reaction' ? `${text} Reaccionó a tu historia` :
                         'Mensaje';
  
  console.log('💾 Actualizando último mensaje del chat:', lastMessageText);
  
  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: lastMessageText,
    timestamp: Date.now(),
    serverTimestamp: serverTimestamp()
  });
  
  console.log('✅ Chat actualizado exitosamente');
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
  console.log('🔍 Buscando chat existente entre:', currentUserId, 'y', otherUserId);
  
  // Buscar chat existente
  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", currentUserId)
  );
  
  const querySnapshot = await getDocs(q);
  console.log('📊 Chats encontrados para buscar:', querySnapshot.size);
  
  for (const doc of querySnapshot.docs) {
    const chatData = doc.data();
    console.log('🔍 Revisando chat:', doc.id, 'participants:', chatData.participants);
    
    if (chatData.participants.includes(otherUserId)) {
      console.log('✅ Chat existente encontrado:', doc.id);
      return doc.id; // Chat ya existe
    }
  }
  
  // Si no existe, crear nuevo chat
  console.log('➕ Creando nuevo chat...');
  const newChatId = await createChat(currentUserId, otherUserId);
  console.log('✅ Nuevo chat creado:', newChatId);
  return newChatId;
};