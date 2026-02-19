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
  setDoc,
  limit,
  startAfter,
  DocumentSnapshot
} from "firebase/firestore";
import { UserProfile } from '../types';
import { logger } from '../utils/logger';
import { retryWithBackoff } from '../utils/retry';

// Crear o actualizar perfil de usuario
export const createOrUpdateProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  return retryWithBackoff(
    async () => {
      const docRef = doc(db, "perfiles", userId);
      
      const data = {
        ...profileData,
        id: userId,
        timestamp: Date.now(),
        serverTimestamp: serverTimestamp()
      };
      
      await setDoc(docRef, data, { merge: true });
    },
    {
      maxRetries: 3,
      baseDelay: 1000,
      onRetry: (attempt) => {
        logger.profile.warn(`Retrying createOrUpdateProfile, attempt ${attempt}`, { userId });
      }
    }
  );
};

// Obtener perfil de usuario
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
          logger.profile.warn(`Retrying getUserProfile, attempt ${attempt}`, { userId });
        }
      }
    );
  } catch (error) {
    logger.profile.error("Error obteniendo perfil de usuario", error);
    return null;
  }
};

// Obtener perfiles para Discovery (excluir el usuario actual y matches)
// ⚡ OPTIMIZACIÓN: Carga única en lugar de listener en tiempo real para mejor performance
export const getDiscoveryProfiles = async (
  currentUserId: string, 
  callback: (profiles: UserProfile[]) => void,
  profileLimit: number = 10 // ⚡ Reducido de 20 a 10 para carga más rápida
) => {
  logger.profile.info('🔍 getDiscoveryProfiles iniciado', { currentUserId, profileLimit });
  
  try {
    logger.profile.info('📊 Creando query de Firestore...');
    
    // ⚡ CAMBIO: Usar getDocs (carga única) en lugar de onSnapshot (tiempo real)
    const q = query(
      collection(db, "perfiles"),
      orderBy("timestamp", "desc"),
      limit(profileLimit)
    );
    
    logger.profile.info('🔥 Ejecutando getDocs...');
    const querySnapshot = await getDocs(q);
    logger.profile.success('✅ getDocs completado', { docsCount: querySnapshot.size });
    
    const profiles: UserProfile[] = [];
    
    querySnapshot.forEach((doc) => {
      const profile = { id: doc.id, ...doc.data() } as UserProfile;
      
      logger.profile.debug('📄 Procesando perfil', { id: profile.id, name: profile.name });
      
      // Excluir el perfil del usuario actual
      if (profile.id === currentUserId) {
        logger.profile.debug('⏭️ Saltando perfil del usuario actual');
        return;
      }
      
      profiles.push(profile);
    });
    
    logger.profile.success('✅ Perfiles procesados', { 
      totalDocs: querySnapshot.size,
      profilesAfterFilter: profiles.length,
      profiles: profiles.map(p => ({ id: p.id, name: p.name }))
    });
    
    logger.profile.info('📞 Ejecutando callback con perfiles...');
    callback(profiles);
    logger.profile.success('✅ Callback ejecutado exitosamente');
    
    // ⚡ Retornar función vacía ya que no hay listener que cancelar
    return () => {
      logger.profile.debug('🧹 Cleanup de getDiscoveryProfiles (no-op)');
    };
  } catch (error) {
    logger.profile.error('❌ Error cargando perfiles para Discovery', error);
    logger.profile.info('📞 Ejecutando callback con array vacío debido a error');
    callback([]);
    return () => {};
  }
};

// Buscar perfiles por criterios
export const searchProfiles = async (searchCriteria: {
  ageMin?: number;
  ageMax?: number;
  location?: string;
  interests?: string[];
}): Promise<UserProfile[]> => {
  try {
    return await retryWithBackoff(
      async () => {
        let q = query(collection(db, "perfiles"));
        
        // Aquí puedes agregar filtros más específicos según tus necesidades
        // Por ahora, obtenemos todos y filtramos en el cliente
        const querySnapshot = await getDocs(q);
        
        const profiles: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          const profile = { id: doc.id, ...doc.data() } as UserProfile;
          
          // Filtrar por edad
          if (searchCriteria.ageMin && profile.age < searchCriteria.ageMin) return;
          if (searchCriteria.ageMax && profile.age > searchCriteria.ageMax) return;
          
          // Filtrar por ubicación (búsqueda parcial)
          if (searchCriteria.location && 
              !profile.location.toLowerCase().includes(searchCriteria.location.toLowerCase())) return;
          
          // Filtrar por intereses
          if (searchCriteria.interests && searchCriteria.interests.length > 0) {
            const hasCommonInterest = searchCriteria.interests.some(interest => 
              profile.interests.some(userInterest => 
                userInterest.toLowerCase().includes(interest.toLowerCase())
              )
            );
            if (!hasCommonInterest) return;
          }
          
          profiles.push(profile);
        });
        
        logger.profile.success('Búsqueda de perfiles completada', { found: profiles.length });
        return profiles;
      },
      {
        maxRetries: 3,
        baseDelay: 1000,
        onRetry: (attempt) => {
          logger.profile.warn(`Retrying searchProfiles, attempt ${attempt}`);
        }
      }
    );
  } catch (error) {
    logger.profile.error("Error buscando perfiles", error);
    return [];
  }
};