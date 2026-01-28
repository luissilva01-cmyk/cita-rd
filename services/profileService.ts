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
import { UserProfile } from '../types';

// Crear o actualizar perfil de usuario
export const createOrUpdateProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  const docRef = doc(db, "perfiles", userId);
  
  const data = {
    ...profileData,
    id: userId,
    timestamp: Date.now(),
    serverTimestamp: serverTimestamp()
  };
  
  await setDoc(docRef, data, { merge: true });
};

// Obtener perfil de usuario
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

// Obtener perfiles para Discovery (excluir el usuario actual y matches)
export const getDiscoveryProfiles = async (
  currentUserId: string, 
  callback: (profiles: UserProfile[]) => void
) => {
  // Importar privacyService para obtener matches
  const { privacyService } = await import('./privacyService');
  
  // Obtener matches del usuario actual
  const matchedUserIds = await privacyService.getUserMatches(currentUserId);
  console.log('🔍 Discovery - Excluyendo matches:', matchedUserIds);
  
  const q = query(
    collection(db, "perfiles"),
    orderBy("timestamp", "desc")
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const profiles: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      const profile = { id: doc.id, ...doc.data() } as UserProfile;
      
      // Excluir el perfil del usuario actual
      if (profile.id === currentUserId) {
        return;
      }
      
      // Excluir perfiles con los que ya hizo match
      if (matchedUserIds.includes(profile.id)) {
        console.log('🚫 Excluyendo match:', profile.name || profile.id);
        return;
      }
      
      profiles.push(profile);
    });
    
    console.log('✅ Perfiles para Discovery:', profiles.length);
    callback(profiles);
  });
};

// Buscar perfiles por criterios
export const searchProfiles = async (searchCriteria: {
  ageMin?: number;
  ageMax?: number;
  location?: string;
  interests?: string[];
}): Promise<UserProfile[]> => {
  try {
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
    
    return profiles;
  } catch (error) {
    console.error("Error searching profiles:", error);
    return [];
  }
};