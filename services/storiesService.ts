// cita-rd/services/storiesService.ts
import { privacyService } from './privacyService';

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
  private stories: Story[] = [];
  private storyGroups: StoryGroup[] = [];

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // ✅ NO cargar datos mock - solo stories reales
    this.stories = [];
    this.storyGroups = [];
  }

  // Obtener todos los grupos de stories (con filtrado de privacidad)
  async getStoryGroups(currentUserId: string): Promise<StoryGroup[]> {
    console.log('📊 === CARGANDO STORY GROUPS ===');
    console.log('📊 Current User ID:', currentUserId);
    console.log('📊 Total Stories en memoria:', this.stories.length);
    console.log('📊 Total Story Groups en memoria:', this.storyGroups.length);
    
    try {
      // Validar parámetro de entrada
      if (!currentUserId) {
        console.log('❌ currentUserId vacío, retornando array vacío');
        return [];
      }
      
      // Filtrar stories expiradas
      const now = new Date();
      const activeStories = this.stories.filter(story => {
        try {
          const isActive = story && story.expiresAt && story.expiresAt > now;
          if (!isActive && story) {
            console.log('⏰ Story expirada:', story.id, 'de usuario:', story.userId);
          }
          return isActive;
        } catch (storyError) {
          console.error('❌ Error filtrando story:', storyError);
          return false;
        }
      });
      
      console.log('✅ Stories activas (no expiradas):', activeStories.length);
      
      // Filtrar grupos según configuración de privacidad
      const filteredGroups: StoryGroup[] = [];
      
      for (const group of this.storyGroups) {
        try {
          // Validar que el grupo tenga datos válidos
          if (!group || !group.userId || !group.user) {
            console.log('⚠️ Grupo inválido, saltando');
            continue;
          }
          
          console.log('🔍 Verificando grupo de:', group.user.name, '(userId:', group.userId, ')');
          
          // Verificar si el usuario actual puede ver las stories de este grupo
          const canView = await privacyService.canViewStories(currentUserId, group.userId);
          
          console.log('👁️ ¿Puede ver?', canView);
          
          if (canView) {
            // Filtrar stories activas del grupo
            const groupActiveStories = activeStories.filter(story => {
              try {
                return story && story.userId === group.userId;
              } catch (filterError) {
                console.error('❌ Error filtrando story del grupo:', filterError);
                return false;
              }
            });
            
            console.log('📝 Stories activas en este grupo:', groupActiveStories.length);
            
            if (groupActiveStories.length > 0) {
              const hasUnviewed = groupActiveStories.some(story => {
                try {
                  return story && story.viewedBy && !story.viewedBy.includes(currentUserId);
                } catch (viewedError) {
                  console.error('❌ Error verificando vistas:', viewedError);
                  return false;
                }
              });
              
              console.log('✅ Agregando grupo:', group.user.name, '- No vistas:', hasUnviewed);
              
              filteredGroups.push({
                ...group,
                stories: groupActiveStories,
                hasUnviewed
              });
            } else {
              console.log('⚠️ Grupo sin stories activas, no se agrega');
            }
          } else {
            console.log('🔒 No puede ver este grupo (privacidad)');
          }
        } catch (groupError) {
          console.error('❌ Error procesando grupo:', groupError);
          // Continuar con el siguiente grupo en caso de error
        }
      }
      
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
      // Retornar array vacío en caso de error para evitar crashes
      return [];
    }
  }

  // Obtener stories de un usuario específico
  async getUserStories(userId: string): Promise<Story[]> {
    const now = new Date();
    const userStories = this.stories
      .filter(story => story.userId === userId && story.expiresAt > now)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return userStories;
  }

  // Marcar story como vista
  async markStoryAsViewed(storyId: string, viewerId: string): Promise<void> {
    const story = this.stories.find(s => s.id === storyId);
    if (story && !story.viewedBy.includes(viewerId)) {
      story.viewedBy.push(viewerId);
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
    const newStory: Story = {
      id: `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      content,
      backgroundColor: options?.backgroundColor,
      textColor: options?.textColor,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      viewedBy: []
    };

    this.stories.push(newStory);
    
    // Actualizar o crear grupo de usuario
    let userGroup = this.storyGroups.find(g => g.userId === userId);
    if (userGroup) {
      userGroup.stories.push(newStory);
      userGroup.lastUpdated = new Date();
      userGroup.hasUnviewed = true;
    } else {
      // Crear nuevo grupo para el usuario actual
      userGroup = {
        id: `group_${userId}`,
        userId,
        user: {
          name: userProfile?.name || 'Mi Story',
          avatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
        },
        stories: [newStory],
        hasUnviewed: true,
        lastUpdated: new Date()
      };
      this.storyGroups.unshift(userGroup); // Agregar al inicio
    }
    
    return newStory;
  }

  // Eliminar story
  async deleteStory(storyId: string, userId: string): Promise<boolean> {
    const storyIndex = this.stories.findIndex(s => s.id === storyId && s.userId === userId);
    if (storyIndex === -1) {
      return false;
    }

    this.stories.splice(storyIndex, 1);
    
    // Actualizar grupo
    const userGroup = this.storyGroups.find(g => g.userId === userId);
    if (userGroup) {
      userGroup.stories = userGroup.stories.filter(s => s.id !== storyId);
      if (userGroup.stories.length === 0) {
        const groupIndex = this.storyGroups.findIndex(g => g.userId === userId);
        if (groupIndex !== -1) {
          this.storyGroups.splice(groupIndex, 1);
        }
      }
    }

    return true;
  }

  // Obtener estadísticas de una story
  async getStoryStats(storyId: string): Promise<{ views: number; viewers: string[] }> {
    const story = this.stories.find(s => s.id === storyId);
    if (!story) {
      return { views: 0, viewers: [] };
    }

    return {
      views: story.viewedBy.length,
      viewers: story.viewedBy
    };
  }
}

// Instancia singleton
export const storiesService = new StoriesService();
export default storiesService;