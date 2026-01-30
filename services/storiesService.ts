// cita-rd/services/storiesService.ts
import { privacyService } from './privacyService';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs, 
  getDoc,
  orderBy,
  Timestamp,
  arrayUnion
} from 'firebase/firestore';

export interface Story {
  id: string;
  userId: string;
  type: 'image' | 'text';
  content: string;
  backgroundColor?: string;
  textColor?: string;
  createdAt: Date;
  expiresAt: Date;
  viewedBy: string[];
}

export interface StoryGroup {
  id: string;
  userId: string;
  user: {
    name: string;
    avatar: string;
  };
  stories: Story[];
  hasUnviewed: boolean;
  lastUpdated: Date;
}

class StoriesService {
  private storiesCollection = collection(db, 'stories');
  private perfilesCollection = collection(db, 'perfiles');

  constructor() {
    console.log('📱 StoriesService inicializado con persistencia en Firestore');
  }

  // Obtener todos los grupos de stories (con filtrado de privacidad)
  async getStoryGroups(currentUserId: string): Promise<StoryGroup[]> {
    console.log('📊 === CARGANDO STORY GROUPS DESDE FIRESTORE ===');
    console.log('📊 Current User ID:', currentUserId);
    
    try {
      // Validar parámetro de entrada
      if (!currentUserId) {
        console.log('❌ currentUserId vacío, retornando array vacío');
        return [];
      }
      
      // Obtener todas las stories activas desde Firestore
      const now = new Date();
      const storiesQuery = query(
        this.storiesCollection,
        where('expiresAt', '>', Timestamp.fromDate(now)),
        orderBy('expiresAt'),
        orderBy('createdAt', 'desc')
      );
      
      const storiesSnapshot = await getDocs(storiesQuery);
      console.log('📊 Stories encontradas en Firestore:', storiesSnapshot.size);
      
      // Convertir documentos a objetos Story
      const allStories: Story[] = storiesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          type: data.type,
          content: data.content,
          backgroundColor: data.backgroundColor,
          textColor: data.textColor,
          createdAt: data.createdAt.toDate(),
          expiresAt: data.expiresAt.toDate(),
          viewedBy: data.viewedBy || []
        };
      });
      
      console.log('✅ Stories activas cargadas:', allStories.length);
      
      // Agrupar stories por usuario
      const storiesByUser = new Map<string, Story[]>();
      for (const story of allStories) {
        if (!storiesByUser.has(story.userId)) {
          storiesByUser.set(story.userId, []);
        }
        storiesByUser.get(story.userId)!.push(story);
      }
      
      console.log('📊 Usuarios con stories:', storiesByUser.size);
      
      // Obtener matches del usuario actual para filtrar
      const userMatches = await privacyService.getUserMatches(currentUserId);
      console.log('🔗 Matches del usuario:', userMatches.length);
      
      // Crear grupos con información de perfil
      const filteredGroups: StoryGroup[] = [];
      
      for (const [userId, userStories] of storiesByUser.entries()) {
        try {
          console.log('🔍 Procesando usuario:', userId, '- Stories:', userStories.length);
          
          // Verificar privacidad - esto ya maneja la lógica de matches vs everyone
          const canView = await privacyService.canViewStories(currentUserId, userId);
          console.log('👁️ ¿Puede ver?', canView);
          
          if (!canView) {
            console.log('🔒 No puede ver este grupo (privacidad)');
            continue;
          }
          
          // Obtener información del perfil
          const perfilDoc = await getDoc(doc(this.perfilesCollection, userId));
          
          if (!perfilDoc.exists()) {
            console.log('⚠️ Perfil no encontrado para userId:', userId);
            continue;
          }
          
          const perfilData = perfilDoc.data();
          
          // Verificar si hay stories no vistas
          const hasUnviewed = userStories.some(story => 
            !story.viewedBy.includes(currentUserId)
          );
          
          // Crear grupo
          const group: StoryGroup = {
            id: `group_${userId}`,
            userId,
            user: {
              name: perfilData.nombre || 'Usuario',
              avatar: perfilData.fotos?.[0] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
            },
            stories: userStories.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
            hasUnviewed,
            lastUpdated: userStories[userStories.length - 1].createdAt
          };
          
          console.log('✅ Agregando grupo:', group.user.name, '- No vistas:', hasUnviewed);
          filteredGroups.push(group);
          
        } catch (groupError) {
          console.error('❌ Error procesando grupo:', groupError);
        }
      }
      
      // Ordenar grupos: no vistas primero, luego por última actualización
      filteredGroups.sort((a, b) => {
        if (a.hasUnviewed && !b.hasUnviewed) return -1;
        if (!a.hasUnviewed && b.hasUnviewed) return 1;
        return b.lastUpdated.getTime() - a.lastUpdated.getTime();
      });
      
      console.log('📊 === RESULTADO FINAL ===');
      console.log('📊 Grupos filtrados:', filteredGroups.length);
      console.log('📊 Grupos:', filteredGroups.map(g => g.user.name));
      console.log('📊 === FIN CARGA ===');
      
      return filteredGroups;
      
    } catch (error) {
      console.error('🚨 === ERROR CRÍTICO en getStoryGroups ===');
      console.error('❌ Error:', error);
      console.error('❌ Stack:', (error as Error).stack);
      console.error('🚨 === FIN ERROR ===');
      return [];
    }
  }

  // Obtener stories de un usuario específico
  async getUserStories(userId: string): Promise<Story[]> {
    try {
      const now = new Date();
      const userStoriesQuery = query(
        this.storiesCollection,
        where('userId', '==', userId),
        where('expiresAt', '>', Timestamp.fromDate(now)),
        orderBy('expiresAt'),
        orderBy('createdAt', 'asc')
      );
      
      const snapshot = await getDocs(userStoriesQuery);
      
      const userStories: Story[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          type: data.type,
          content: data.content,
          backgroundColor: data.backgroundColor,
          textColor: data.textColor,
          createdAt: data.createdAt.toDate(),
          expiresAt: data.expiresAt.toDate(),
          viewedBy: data.viewedBy || []
        };
      });
      
      console.log('📱 Stories de usuario', userId, ':', userStories.length);
      return userStories;
      
    } catch (error) {
      console.error('❌ Error obteniendo stories de usuario:', error);
      return [];
    }
  }

  // Marcar story como vista
  async markStoryAsViewed(storyId: string, viewerId: string): Promise<void> {
    try {
      const storyRef = doc(this.storiesCollection, storyId);
      const storyDoc = await getDoc(storyRef);
      
      if (!storyDoc.exists()) {
        console.log('⚠️ Story no encontrada:', storyId);
        return;
      }
      
      const viewedBy = storyDoc.data().viewedBy || [];
      
      if (!viewedBy.includes(viewerId)) {
        await updateDoc(storyRef, {
          viewedBy: arrayUnion(viewerId)
        });
        console.log('✅ Story marcada como vista:', storyId, 'por', viewerId);
      }
      
    } catch (error) {
      console.error('❌ Error marcando story como vista:', error);
    }
  }

  // Crear nueva story
  async createStory(
    userId: string, 
    type: 'image' | 'text', 
    content: string, 
    options?: {
      backgroundColor?: string;
      textColor?: string;
    },
    userProfile?: { name: string; avatar: string }
  ): Promise<Story> {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas
      
      // Crear documento en Firestore
      const storyData = {
        userId,
        type,
        content,
        backgroundColor: options?.backgroundColor || null,
        textColor: options?.textColor || null,
        createdAt: Timestamp.fromDate(now),
        expiresAt: Timestamp.fromDate(expiresAt),
        viewedBy: []
      };
      
      const docRef = await addDoc(this.storiesCollection, storyData);
      
      console.log('✅ Story creada en Firestore:', docRef.id);
      
      // Retornar objeto Story
      const newStory: Story = {
        id: docRef.id,
        userId,
        type,
        content,
        backgroundColor: options?.backgroundColor,
        textColor: options?.textColor,
        createdAt: now,
        expiresAt,
        viewedBy: []
      };
      
      return newStory;
      
    } catch (error) {
      console.error('❌ Error creando story en Firestore:', error);
      throw error;
    }
  }

  // Eliminar story
  async deleteStory(storyId: string, userId: string): Promise<boolean> {
    try {
      const storyRef = doc(this.storiesCollection, storyId);
      const storyDoc = await getDoc(storyRef);
      
      if (!storyDoc.exists()) {
        console.log('⚠️ Story no encontrada:', storyId);
        return false;
      }
      
      // Verificar que el usuario sea el dueño
      if (storyDoc.data().userId !== userId) {
        console.log('❌ Usuario no autorizado para eliminar story');
        return false;
      }
      
      await deleteDoc(storyRef);
      console.log('✅ Story eliminada:', storyId);
      return true;
      
    } catch (error) {
      console.error('❌ Error eliminando story:', error);
      return false;
    }
  }

  // Obtener estadísticas de una story
  async getStoryStats(storyId: string): Promise<{ views: number; viewers: string[] }> {
    try {
      const storyRef = doc(this.storiesCollection, storyId);
      const storyDoc = await getDoc(storyRef);
      
      if (!storyDoc.exists()) {
        return { views: 0, viewers: [] };
      }
      
      const viewedBy = storyDoc.data().viewedBy || [];
      
      return {
        views: viewedBy.length,
        viewers: viewedBy
      };
      
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de story:', error);
      return { views: 0, viewers: [] };
    }
  }
}

// Instancia singleton
export const storiesService = new StoriesService();
export default storiesService;