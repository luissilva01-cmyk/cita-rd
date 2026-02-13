// cita-rd/services/likesService.ts
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  Unsubscribe,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { logger } from '../utils/logger';
import { UserProfile } from '../types';
import { getUserProfile } from './profileService';

export interface ReceivedLike {
  id: string;
  fromUserId: string;
  fromUser?: UserProfile;
  timestamp: number;
  isSuperLike?: boolean;
}

/**
 * Obtener likes recibidos por el usuario actual
 */
export async function getReceivedLikes(userId: string): Promise<ReceivedLike[]> {
  try {
    logger.match.debug('Obteniendo likes recibidos', { userId });
    
    // Query para obtener todos los likes donde toUserId = userId actual
    const likesRef = collection(db, 'likes');
    const q = query(
      likesRef,
      where('toUserId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(100) // Limitar a últimos 100 likes
    );
    
    const snapshot = await getDocs(q);
    
    const likes: ReceivedLike[] = [];
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Obtener perfil del usuario que dio like
      try {
        const fromUserProfile = await getUserProfile(data.fromUserId);
        
        if (fromUserProfile) {
          likes.push({
            id: doc.id,
            fromUserId: data.fromUserId,
            fromUser: fromUserProfile,
            timestamp: data.timestamp || Date.now(),
            isSuperLike: data.isSuperLike || false
          });
        }
      } catch (error) {
        logger.match.warn('Error obteniendo perfil de usuario que dio like', { 
          fromUserId: data.fromUserId, 
          error 
        });
      }
    }
    
    logger.match.success('Likes recibidos obtenidos', { count: likes.length });
    return likes;
    
  } catch (error) {
    logger.match.error('Error obteniendo likes recibidos', error);
    return [];
  }
}

/**
 * Contar likes recibidos (sin obtener perfiles completos)
 */
export async function countReceivedLikes(userId: string): Promise<number> {
  try {
    const likesRef = collection(db, 'likes');
    const q = query(
      likesRef,
      where('toUserId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
    
  } catch (error) {
    logger.match.error('Error contando likes recibidos', error);
    return 0;
  }
}

/**
 * Escuchar cambios en likes recibidos en tiempo real
 */
export function listenToReceivedLikes(
  userId: string,
  callback: (likes: ReceivedLike[]) => void
): Unsubscribe {
  logger.match.debug('Configurando listener de likes recibidos', { userId });
  
  const likesRef = collection(db, 'likes');
  const q = query(
    likesRef,
    where('toUserId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(100)
  );
  
  return onSnapshot(q, async (snapshot) => {
    logger.match.debug('Cambio detectado en likes recibidos', { 
      size: snapshot.size 
    });
    
    const likes: ReceivedLike[] = [];
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      try {
        const fromUserProfile = await getUserProfile(data.fromUserId);
        
        if (fromUserProfile) {
          likes.push({
            id: doc.id,
            fromUserId: data.fromUserId,
            fromUser: fromUserProfile,
            timestamp: data.timestamp || Date.now(),
            isSuperLike: data.isSuperLike || false
          });
        }
      } catch (error) {
        logger.match.warn('Error obteniendo perfil en listener', { 
          fromUserId: data.fromUserId 
        });
      }
    }
    
    callback(likes);
  }, (error) => {
    logger.match.error('Error en listener de likes recibidos', error);
  });
}

/**
 * Verificar si un usuario específico te dio like
 */
export async function hasUserLikedMe(myUserId: string, otherUserId: string): Promise<boolean> {
  try {
    const likesRef = collection(db, 'likes');
    const q = query(
      likesRef,
      where('fromUserId', '==', otherUserId),
      where('toUserId', '==', myUserId),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    return !snapshot.empty;
    
  } catch (error) {
    logger.match.error('Error verificando si usuario dio like', error);
    return false;
  }
}
