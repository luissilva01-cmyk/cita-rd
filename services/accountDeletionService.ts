// cita-rd/services/accountDeletionService.ts
import { auth, db } from './firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc,
  writeBatch
} from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';

/**
 * Servicio para eliminar completamente una cuenta de usuario
 * Elimina todos los datos del usuario de Firestore y Firebase Auth
 */

// Eliminar perfil del usuario
async function deleteUserProfile(userId: string): Promise<void> {
  console.log('🗑️ Eliminando perfil del usuario:', userId);
  
  try {
    const profileRef = doc(db, 'perfiles', userId);
    await deleteDoc(profileRef);
    console.log('✅ Perfil eliminado');
  } catch (error) {
    console.error('❌ Error eliminando perfil:', error);
    throw error;
  }
}

// Eliminar todas las stories del usuario
async function deleteUserStories(userId: string): Promise<void> {
  console.log('🗑️ Eliminando stories del usuario:', userId);
  
  try {
    const storiesQuery = query(
      collection(db, 'stories'),
      where('userId', '==', userId)
    );
    
    const storiesSnapshot = await getDocs(storiesQuery);
    console.log(`📊 Stories encontradas: ${storiesSnapshot.size}`);
    
    const batch = writeBatch(db);
    storiesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('✅ Stories eliminadas');
  } catch (error) {
    console.error('❌ Error eliminando stories:', error);
    throw error;
  }
}

// Eliminar todos los chats donde el usuario es participante
async function deleteUserChats(userId: string): Promise<void> {
  console.log('🗑️ Eliminando chats del usuario:', userId);
  
  try {
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId)
    );
    
    const chatsSnapshot = await getDocs(chatsQuery);
    console.log(`📊 Chats encontrados: ${chatsSnapshot.size}`);
    
    // Eliminar cada chat y sus mensajes
    for (const chatDoc of chatsSnapshot.docs) {
      const chatId = chatDoc.id;
      
      // Eliminar mensajes del chat
      const messagesQuery = query(collection(db, 'chats', chatId, 'messages'));
      const messagesSnapshot = await getDocs(messagesQuery);
      
      const batch = writeBatch(db);
      messagesSnapshot.docs.forEach((msgDoc) => {
        batch.delete(msgDoc.ref);
      });
      
      // Eliminar typing status
      const typingQuery = query(collection(db, 'chats', chatId, 'typingStatus'));
      const typingSnapshot = await getDocs(typingQuery);
      typingSnapshot.docs.forEach((typingDoc) => {
        batch.delete(typingDoc.ref);
      });
      
      await batch.commit();
      
      // Eliminar el chat principal
      await deleteDoc(doc(db, 'chats', chatId));
      console.log(`✅ Chat ${chatId} eliminado con sus mensajes`);
    }
    
    console.log('✅ Todos los chats eliminados');
  } catch (error) {
    console.error('❌ Error eliminando chats:', error);
    throw error;
  }
}

// Eliminar matches del usuario
async function deleteUserMatches(userId: string): Promise<void> {
  console.log('🗑️ Eliminando matches del usuario:', userId);
  
  try {
    // Eliminar matches donde el usuario es user1
    const matchesQuery1 = query(
      collection(db, 'matches'),
      where('user1', '==', userId)
    );
    
    // Eliminar matches donde el usuario es user2
    const matchesQuery2 = query(
      collection(db, 'matches'),
      where('user2', '==', userId)
    );
    
    const [matchesSnapshot1, matchesSnapshot2] = await Promise.all([
      getDocs(matchesQuery1),
      getDocs(matchesQuery2)
    ]);
    
    console.log(`📊 Matches encontrados: ${matchesSnapshot1.size + matchesSnapshot2.size}`);
    
    const batch = writeBatch(db);
    
    matchesSnapshot1.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    matchesSnapshot2.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('✅ Matches eliminados');
  } catch (error) {
    console.error('❌ Error eliminando matches:', error);
    throw error;
  }
}

// Eliminar likes del usuario
async function deleteUserLikes(userId: string): Promise<void> {
  console.log('🗑️ Eliminando likes del usuario:', userId);
  
  try {
    // Eliminar likes dados por el usuario
    const likesGivenQuery = query(
      collection(db, 'likes'),
      where('fromUserId', '==', userId)
    );
    
    // Eliminar likes recibidos por el usuario
    const likesReceivedQuery = query(
      collection(db, 'likes'),
      where('toUserId', '==', userId)
    );
    
    const [likesGivenSnapshot, likesReceivedSnapshot] = await Promise.all([
      getDocs(likesGivenQuery),
      getDocs(likesReceivedQuery)
    ]);
    
    console.log(`📊 Likes encontrados: ${likesGivenSnapshot.size + likesReceivedSnapshot.size}`);
    
    const batch = writeBatch(db);
    
    likesGivenSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    likesReceivedSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('✅ Likes eliminados');
  } catch (error) {
    console.error('❌ Error eliminando likes:', error);
    throw error;
  }
}

// Eliminar configuración de privacidad del usuario
async function deleteUserPrivacySettings(userId: string): Promise<void> {
  console.log('🗑️ Eliminando configuración de privacidad:', userId);
  
  try {
    const privacyRef = doc(db, 'privacySettings', userId);
    await deleteDoc(privacyRef);
    console.log('✅ Configuración de privacidad eliminada');
  } catch (error) {
    console.error('❌ Error eliminando configuración de privacidad:', error);
    // No lanzar error si no existe
  }
}

// Eliminar verificación del usuario
async function deleteUserVerification(userId: string): Promise<void> {
  console.log('🗑️ Eliminando verificación del usuario:', userId);
  
  try {
    const verificationRef = doc(db, 'verifications', userId);
    await deleteDoc(verificationRef);
    console.log('✅ Verificación eliminada');
  } catch (error) {
    console.error('❌ Error eliminando verificación:', error);
    // No lanzar error si no existe
  }
}

// Eliminar estado de presencia del usuario
async function deleteUserPresence(userId: string): Promise<void> {
  console.log('🗑️ Eliminando estado de presencia:', userId);
  
  try {
    const presenceRef = doc(db, 'presence', userId);
    await deleteDoc(presenceRef);
    console.log('✅ Estado de presencia eliminado');
  } catch (error) {
    console.error('❌ Error eliminando estado de presencia:', error);
    // No lanzar error si no existe
  }
}

// Eliminar cuenta de Firebase Auth
async function deleteAuthAccount(): Promise<void> {
  console.log('🗑️ Eliminando cuenta de Firebase Auth');
  
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    
    await deleteUser(user);
    console.log('✅ Cuenta de Firebase Auth eliminada');
  } catch (error) {
    console.error('❌ Error eliminando cuenta de Auth:', error);
    throw error;
  }
}

/**
 * Función principal para eliminar completamente una cuenta de usuario
 * Elimina todos los datos del usuario de Firestore y Firebase Auth
 * 
 * @param userId - ID del usuario a eliminar
 * @throws Error si falla alguna operación crítica
 */
export async function deleteUserAccount(userId: string): Promise<void> {
  console.log('🗑️ ========================================');
  console.log('🗑️ INICIANDO ELIMINACIÓN DE CUENTA');
  console.log('🗑️ Usuario ID:', userId);
  console.log('🗑️ Timestamp:', new Date().toISOString());
  console.log('🗑️ ========================================');
  
  try {
    // 1. Eliminar datos de Firestore (en orden de dependencias)
    await deleteUserStories(userId);
    await deleteUserChats(userId);
    await deleteUserMatches(userId);
    await deleteUserLikes(userId);
    await deleteUserPrivacySettings(userId);
    await deleteUserVerification(userId);
    await deleteUserPresence(userId);
    await deleteUserProfile(userId);
    
    // 2. Eliminar cuenta de Firebase Auth (último paso)
    await deleteAuthAccount();
    
    console.log('🗑️ ========================================');
    console.log('🗑️ ✅ CUENTA ELIMINADA EXITOSAMENTE');
    console.log('🗑️ Usuario ID:', userId);
    console.log('🗑️ Timestamp:', new Date().toISOString());
    console.log('🗑️ ========================================');
    
  } catch (error) {
    console.error('🗑️ ========================================');
    console.error('🗑️ ❌ ERROR CRÍTICO EN ELIMINACIÓN');
    console.error('🗑️ Usuario ID:', userId);
    console.error('🗑️ Error:', error);
    console.error('🗑️ Stack:', (error as Error).stack);
    console.error('🗑️ ========================================');
    throw error;
  }
}

export default {
  deleteUserAccount
};
