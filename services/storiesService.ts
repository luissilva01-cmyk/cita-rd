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
    // Datos demo para mostrar inmediatamente
    const demoStories: Story[] = [
      {
        id: 'story1',
        userId: '1', // Carolina
        type: 'image',
        content: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 horas restantes
        viewedBy: []
      },
      {
        id: 'story2',
        userId: '1', // Carolina
        type: 'text',
        content: '¡Hermoso día en Santo Domingo! ☀️',
        backgroundColor: '#FF6B6B',
        textColor: '#FFFFFF',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
        expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23 horas restantes
        viewedBy: []
      },
      {
        id: 'story3',
        userId: '2', // Marcos
        type: 'image',
        content: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 horas atrás
        expiresAt: new Date(Date.now() + 21 * 60 * 60 * 1000), // 21 horas restantes
        viewedBy: []
      },
      {
        id: 'story4',
        userId: '3', // Isabella
        type: 'image',
        content: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop',
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
        expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000), // 23.5 horas restantes
        viewedBy: []
      },
      {
        id: 'story5',
        userId: '3', // Isabella
        type: 'text',
        content: 'Explorando la Zona Colonial 🏛️',
        backgroundColor: '#4ECDC4',
        textColor: '#FFFFFF',
        createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutos atrás
        expiresAt: new Date(Date.now() + 23.25 * 60 * 60 * 1000), // 23.25 horas restantes
        viewedBy: []
      },
      {
        id: 'story6',
        userId: '4', // Rafael
        type: 'image',
        content: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
        expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000), // 20 horas restantes
        viewedBy: []
      }
    ];

    this.stories = demoStories;

    // Agrupar stories por usuario
    this.storyGroups = [
      {
        id: 'group1',
        userId: '1', // Carolina
        user: {
          name: 'Carolina',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face'
        },
        stories: demoStories.filter(s => s.userId === '1'),
        hasUnviewed: true,
        lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        id: 'group2',
        userId: '2', // Marcos
        user: {
          name: 'Marcos',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face'
        },
        stories: demoStories.filter(s => s.userId === '2'),
        hasUnviewed: false,
        lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: 'group3',
        userId: '3', // Isabella
        user: {
          name: 'Isabella',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face'
        },
        stories: demoStories.filter(s => s.userId === '3'),
        hasUnviewed: true,
        lastUpdated: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: 'group4',
        userId: '4', // Rafael
        user: {
          name: 'Rafael',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
        },
        stories: demoStories.filter(s => s.userId === '4'),
        hasUnviewed: false,
        lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ];
  }

  // Obtener todos los grupos de stories (con filtrado de privacidad)
  async getStoryGroups(currentUserId: string): Promise<StoryGroup[]> {
    console.log('📱 === OBTENIENDO STORY GROUPS ===');
    console.log('📱 Usuario actual:', currentUserId);
    
    try {
      // Filtrar stories expiradas
      const now = new Date();
      const activeStories = this.stories.filter(story => story.expiresAt > now);
      console.log('📱 Stories activas:', activeStories.length, 'de', this.stories.length);
      
      // Filtrar grupos según configuración de privacidad
      const filteredGroups: StoryGroup[] = [];
      
      console.log('📱 Verificando privacidad para', this.storyGroups.length, 'grupos...');
      
      for (const group of this.storyGroups) {
        console.log('🔍 Verificando grupo:', group.user.name, '(ID:', group.userId, ')');
        
        try {
          // Verificar si el usuario actual puede ver las stories de este grupo
          const canView = await privacyService.canViewStories(currentUserId, group.userId);
          console.log('👁️ Puede ver stories de', group.user.name, ':', canView);
          
          if (canView) {
            // Filtrar stories activas del grupo
            const groupActiveStories = activeStories.filter(story => story.userId === group.userId);
            console.log('📖 Stories activas del grupo', group.user.name, ':', groupActiveStories.length);
            
            if (groupActiveStories.length > 0) {
              const hasUnviewed = groupActiveStories.some(story => !story.viewedBy.includes(currentUserId));
              
              filteredGroups.push({
                ...group,
                stories: groupActiveStories,
                hasUnviewed
              });
              
              console.log('✅ Grupo agregado:', group.user.name, '- No vistas:', hasUnviewed);
            } else {
              console.log('⚠️ Grupo sin stories activas:', group.user.name);
            }
          } else {
            console.log('🔒 Usuario', currentUserId, 'no puede ver stories de', group.user.name);
          }
        } catch (groupError) {
          console.error('❌ Error verificando grupo', group.user.name, ':', groupError);
          // Continuar con el siguiente grupo en caso de error
        }
      }

      console.log('✅ Story groups filtrados:', filteredGroups.length, 'de', this.storyGroups.length);
      console.log('📱 === FIN OBTENIENDO STORY GROUPS ===');
      
      return filteredGroups;
      
    } catch (error) {
      console.error('🚨 === ERROR EN getStoryGroups ===');
      console.error('❌ Error:', error);
      console.error('❌ Error message:', (error as Error).message);
      console.error('❌ Error stack:', (error as Error).stack);
      console.error('🚨 === FIN ERROR ===');
      
      // Retornar array vacío en caso de error para evitar crashes
      return [];
    }
  }

  // Obtener stories de un usuario específico
  async getUserStories(userId: string): Promise<Story[]> {
    console.log('📖 Obteniendo stories del usuario:', userId);
    
    const now = new Date();
    const userStories = this.stories
      .filter(story => story.userId === userId && story.expiresAt > now)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    console.log('✅ Stories encontradas:', userStories.length);
    return userStories;
  }

  // Marcar story como vista
  async markStoryAsViewed(storyId: string, viewerId: string): Promise<void> {
    console.log('👁️ Marcando story como vista:', { storyId, viewerId });
    
    const story = this.stories.find(s => s.id === storyId);
    if (story && !story.viewedBy.includes(viewerId)) {
      story.viewedBy.push(viewerId);
      console.log('✅ Story marcada como vista');
    }
  }

  // Crear nueva story
  async createStory(userId: string, type: 'image' | 'text', content: string, options?: {
    backgroundColor?: string;
    textColor?: string;
  }): Promise<Story> {
    console.log('📸 Creando nueva story:', { userId, type, content });
    
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
      // Crear nuevo grupo (esto normalmente vendría de la base de datos de usuarios)
      userGroup = {
        id: `group_${userId}`,
        userId,
        user: {
          name: 'Usuario',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
        },
        stories: [newStory],
        hasUnviewed: true,
        lastUpdated: new Date()
      };
      this.storyGroups.push(userGroup);
    }

    console.log('✅ Story creada exitosamente:', newStory.id);
    return newStory;
  }

  // Eliminar story
  async deleteStory(storyId: string, userId: string): Promise<boolean> {
    console.log('🗑️ Eliminando story:', { storyId, userId });
    
    const storyIndex = this.stories.findIndex(s => s.id === storyId && s.userId === userId);
    if (storyIndex === -1) {
      console.log('❌ Story no encontrada o no autorizada');
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

    console.log('✅ Story eliminada exitosamente');
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