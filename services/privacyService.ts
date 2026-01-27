// cita-rd/services/privacyService.ts
export interface PrivacySettings {
  userId: string;
  storiesVisibility: 'everyone' | 'matches_only' | 'close_friends';
  allowStoryReplies: boolean;
  showOnlineStatus: boolean;
  allowProfileViews: 'everyone' | 'matches_only';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserMatch {
  userId1: string;
  userId2: string;
  matchedAt: Date;
  isActive: boolean;
}

class PrivacyService {
  private privacySettings: Map<string, PrivacySettings> = new Map();
  private userMatches: UserMatch[] = [];

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Configuraciones de privacidad demo
    const demoSettings: PrivacySettings[] = [
      {
        userId: 'KU5ZalR92QcPV7RGbLFTjEjTXZm2', // Usuario actual
        storiesVisibility: 'everyone',
        allowStoryReplies: true,
        showOnlineStatus: true,
        allowProfileViews: 'everyone',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: '1', // Carolina
        storiesVisibility: 'everyone',
        allowStoryReplies: true,
        showOnlineStatus: true,
        allowProfileViews: 'everyone',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: '2', // Marcos
        storiesVisibility: 'everyone',
        allowStoryReplies: true,
        showOnlineStatus: true,
        allowProfileViews: 'everyone',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: '3', // Isabella
        storiesVisibility: 'everyone',
        allowStoryReplies: true,
        showOnlineStatus: true,
        allowProfileViews: 'everyone',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: '4', // Rafael
        storiesVisibility: 'everyone',
        allowStoryReplies: true,
        showOnlineStatus: true,
        allowProfileViews: 'everyone',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: '5', // Sofía
        storiesVisibility: 'everyone',
        allowStoryReplies: true,
        showOnlineStatus: true,
        allowProfileViews: 'everyone',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: '6', // Diego
        storiesVisibility: 'everyone',
        allowStoryReplies: true,
        showOnlineStatus: true,
        allowProfileViews: 'everyone',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 'demo-user',
        storiesVisibility: 'everyone',
        allowStoryReplies: true,
        showOnlineStatus: true,
        allowProfileViews: 'everyone',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    demoSettings.forEach(setting => {
      this.privacySettings.set(setting.userId, setting);
    });

    // Matches demo - simular que el usuario actual tiene matches con todos los usuarios
    this.userMatches = [
      {
        userId1: 'KU5ZalR92QcPV7RGbLFTjEjTXZm2',
        userId2: '1', // Carolina
        matchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        userId1: 'KU5ZalR92QcPV7RGbLFTjEjTXZm2',
        userId2: '2', // Marcos
        matchedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        userId1: 'KU5ZalR92QcPV7RGbLFTjEjTXZm2',
        userId2: '3', // Isabella
        matchedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        userId1: 'KU5ZalR92QcPV7RGbLFTjEjTXZm2',
        userId2: '4', // Rafael
        matchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        userId1: 'KU5ZalR92QcPV7RGbLFTjEjTXZm2',
        userId2: '5', // Sofía
        matchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        userId1: 'KU5ZalR92QcPV7RGbLFTjEjTXZm2',
        userId2: '6', // Diego
        matchedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        isActive: true
      }
    ];
  }

  // Obtener configuración de privacidad de un usuario
  async getPrivacySettings(userId: string): Promise<PrivacySettings> {
    console.log('🔒 Obteniendo configuración de privacidad para:', userId);
    
    let settings = this.privacySettings.get(userId);
    
    if (!settings) {
      // Crear configuración por defecto - SIEMPRE PÚBLICO para nuevos usuarios
      settings = {
        userId,
        storiesVisibility: 'everyone', // ✅ Por defecto, todos pueden ver
        allowStoryReplies: true,
        showOnlineStatus: true,
        allowProfileViews: 'everyone',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.privacySettings.set(userId, settings);
      console.log('✅ Configuración por defecto creada (público)');
    }

    console.log('✅ Configuración obtenida:', settings);
    return settings;
  }

  // Actualizar configuración de privacidad
  async updatePrivacySettings(userId: string, updates: Partial<PrivacySettings>): Promise<PrivacySettings> {
    console.log('🔧 Actualizando configuración de privacidad:', { userId, updates });
    
    const currentSettings = await this.getPrivacySettings(userId);
    const updatedSettings: PrivacySettings = {
      ...currentSettings,
      ...updates,
      updatedAt: new Date()
    };

    this.privacySettings.set(userId, updatedSettings);
    
    console.log('✅ Configuración actualizada:', updatedSettings);
    return updatedSettings;
  }

  // Verificar si dos usuarios tienen match
  async areUsersMatched(userId1: string, userId2: string): Promise<boolean> {
    const isMatched = this.userMatches.some(match => 
      match.isActive && (
        (match.userId1 === userId1 && match.userId2 === userId2) ||
        (match.userId1 === userId2 && match.userId2 === userId1)
      )
    );

    console.log('🔍 Verificando match entre', userId1, 'y', userId2, ':', isMatched);
    return isMatched;
  }

  // Verificar si un usuario puede ver las stories de otro
  async canViewStories(viewerId: string, storyOwnerId: string): Promise<boolean> {
    console.log('👁️ Verificando si', viewerId, 'puede ver stories de', storyOwnerId);
    
    // El usuario siempre puede ver sus propias stories
    if (viewerId === storyOwnerId) {
      console.log('✅ Usuario viendo sus propias stories');
      return true;
    }

    // Obtener configuración de privacidad del dueño de la story
    const ownerSettings = await this.getPrivacySettings(storyOwnerId);
    
    switch (ownerSettings.storiesVisibility) {
      case 'everyone':
        console.log('✅ Stories públicas - todos pueden ver');
        return true;
        
      case 'matches_only':
        const areMatched = await this.areUsersMatched(viewerId, storyOwnerId);
        console.log('🔒 Stories solo para matches:', areMatched);
        return areMatched;
        
      case 'close_friends':
        // Por ahora, close_friends funciona igual que matches_only
        // En el futuro se puede implementar una lista de amigos cercanos
        const areCloseFriends = await this.areUsersMatched(viewerId, storyOwnerId);
        console.log('👥 Stories para amigos cercanos:', areCloseFriends);
        return areCloseFriends;
        
      default:
        console.log('❌ Configuración de privacidad desconocida');
        return false;
    }
  }

  // Verificar si un usuario puede responder a stories
  async canReplyToStories(viewerId: string, storyOwnerId: string): Promise<boolean> {
    console.log('💬 === VERIFICANDO PERMISOS DE RESPUESTA ===');
    console.log('💬 Viewer ID:', viewerId);
    console.log('💬 Story Owner ID:', storyOwnerId);
    
    try {
      // Validar parámetros de entrada
      if (!viewerId) {
        console.error('❌ viewerId es null, undefined o vacío:', viewerId);
        return false;
      }
      
      if (!storyOwnerId) {
        console.error('❌ storyOwnerId es null, undefined o vacío:', storyOwnerId);
        return false;
      }
      
      // Primero verificar si puede ver las stories
      console.log('👁️ Verificando permisos de visualización...');
      const canView = await this.canViewStories(viewerId, storyOwnerId);
      console.log('👁️ Puede ver stories:', canView);
      
      if (!canView) {
        console.log('❌ No puede ver las stories, por lo tanto no puede responder');
        return false;
      }

      // Obtener configuración del dueño
      console.log('⚙️ Obteniendo configuración del dueño...');
      const ownerSettings = await this.getPrivacySettings(storyOwnerId);
      console.log('⚙️ Configuración del dueño:', ownerSettings);
      
      if (!ownerSettings) {
        console.error('❌ No se pudo obtener configuración de privacidad para:', storyOwnerId);
        return false;
      }
      
      console.log('💬 Respuestas permitidas:', ownerSettings.allowStoryReplies);
      console.log('💬 === RESULTADO FINAL ===', ownerSettings.allowStoryReplies);
      
      return ownerSettings.allowStoryReplies;
      
    } catch (error) {
      console.error('🚨 === ERROR en canReplyToStories ===');
      console.error('❌ Error:', error);
      console.error('❌ Error message:', (error as Error).message);
      console.error('❌ Error stack:', (error as Error).stack);
      console.error('❌ Parámetros:', { viewerId, storyOwnerId });
      console.error('🚨 === FIN ERROR ===');
      
      // En caso de error, denegar por seguridad
      return false;
    }
  }

  // Crear un match entre dos usuarios (para testing)
  async createMatch(userId1: string, userId2: string): Promise<void> {
    console.log('💕 Creando match entre', userId1, 'y', userId2);
    
    // Verificar que no existe ya
    const existingMatch = this.userMatches.find(match =>
      (match.userId1 === userId1 && match.userId2 === userId2) ||
      (match.userId1 === userId2 && match.userId2 === userId1)
    );

    if (existingMatch) {
      existingMatch.isActive = true;
      console.log('✅ Match reactivado');
    } else {
      this.userMatches.push({
        userId1,
        userId2,
        matchedAt: new Date(),
        isActive: true
      });
      console.log('✅ Nuevo match creado');
    }
  }

  // Obtener todos los matches de un usuario
  async getUserMatches(userId: string): Promise<string[]> {
    const matchedUserIds = this.userMatches
      .filter(match => match.isActive && (match.userId1 === userId || match.userId2 === userId))
      .map(match => match.userId1 === userId ? match.userId2 : match.userId1);

    console.log('👥 Matches de', userId, ':', matchedUserIds);
    return matchedUserIds;
  }

  // Obtener estadísticas de privacidad
  async getPrivacyStats(): Promise<{
    totalUsers: number;
    publicStories: number;
    privateStories: number;
    totalMatches: number;
  }> {
    const totalUsers = this.privacySettings.size;
    const publicStories = Array.from(this.privacySettings.values())
      .filter(s => s.storiesVisibility === 'everyone').length;
    const privateStories = totalUsers - publicStories;
    const totalMatches = this.userMatches.filter(m => m.isActive).length;

    return {
      totalUsers,
      publicStories,
      privateStories,
      totalMatches
    };
  }
}

// Instancia singleton
export const privacyService = new PrivacyService();
export default privacyService;