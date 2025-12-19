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
  const q = query(
    collection(db, "chats"), 
    where("participants", "array-contains", userId),
    orderBy("timestamp", "desc")
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const chats: Chat[] = [];
    querySnapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() } as Chat);
    });
    callback(chats);
  });
};

// Enviar mensaje a un chat
export const sendMessage = async (chatId: string, senderId: string, text: string) => {
  const messageData = {
    senderId,
    text,
    timestamp: Date.now(),
    serverTimestamp: serverTimestamp()
  };

  await addDoc(collection(db, "chats", chatId, "messages"), messageData);
  
  // Actualizar último mensaje del chat
  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: text,
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
  return await createChat(currentUserId, otherUserId);
};