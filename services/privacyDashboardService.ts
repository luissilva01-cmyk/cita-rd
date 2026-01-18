// cita-rd/services/privacyDashboardService.ts

// Tipos para configuración de privacidad
export interface PrivacySettings {
  userId: string;
  
  // Visibilidad del perfil
  profileVisibility: {
    discoverable: boolean; // Aparecer en búsquedas
    showAge: boolean;
    showLocation: 'exact' | 'approximate' | 'city' | 'hidden';
    showLastSeen: boolean;
    showOnlineStatus: boolean;
  };
  
  // Control de fotos
  photoPrivacy: {
    requireMatchToView: boolean;
    blurPhotosUntilMatch: boolean;
    allowPhotoDownload: boolean;
    watermarkPhotos: boolean;
    autoDeleteAfterDays?: number;
  };
  
  // Configuración de mensajes
  messageSettings: {
    allowMessagesFrom: 'everyone' | 'matches_only' | 'verified_only';
    readReceipts: boolean;
    typingIndicators: boolean;
    allowVoiceMessages: boolean;
    allowVideoMessages: boolean;
  };
  
  // Datos y IA
  dataUsage: {
    allowAIAnalysis: boolean;
    allowEmotionalAnalysis: boolean;
    allowMatchingAI: boolean;
    allowDataForImprovement: boolean;
    allowPersonalizedAds: boolean;
  };
  
  // Modo incógnito
  incognitoMode: {
    enabled: boolean;
    hideFromRecentlyViewed: boolean;
    hideFromWhoLikedYou: boolean;
    noReadReceipts: boolean;
    noTypingIndicators: boolean;
  };
  
  // Bloqueos y reportes
  blockingSettings: {
    autoBlockSuspiciousAccounts: boolean;
    blockUnverifiedAccounts: boolean;
    hideFromBlockedUsers: boolean;
    allowReportsFromMatches: boolean;
  };
  
  // Configuración de ubicación
  locationSettings: {
    shareExactLocation: boolean;
    maxDistanceToShow: number; // en km
    hideLocationFromProfile: boolean;
    allowLocationBasedMatching: boolean;
  };
  
  // Configuración de datos
  dataRetention: {
    deleteMessagesAfterDays?: number;
    deleteMatchesAfterDays?: number;
    deletePhotosAfterDays?: number;
    autoDeleteInactiveAccount: boolean;
    inactiveAccountDays: number;
  };
  
  // Configuración de notificaciones de privacidad
  privacyNotifications: {
    notifyOnProfileView: boolean;
    notifyOnScreenshot: boolean;
    notifyOnDataExport: boolean;
    notifyOnSettingsChange: boolean;
  };
  
  // Metadatos
  lastUpdated: Date;
  version: string;
}

export interface DataExportRequest {
  id: string;
  userId: string;
  requestDate: Date;
  status: 'pending' | 'processing' | 'ready' | 'downloaded' | 'expired';
  dataTypes: string[];
  downloadUrl?: string;
  expiresAt?: Date;
}

export interface PrivacyAuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

class PrivacyDashboardService {
  private defaultSettings: Omit<PrivacySettings, 'userId' | 'lastUpdated' | 'version'> = {
    profileVisibility: {
      discoverable: true,
      showAge: true,
      showLocation: 'approximate',
      showLastSeen: true,
      showOnlineStatus: true
    },
    photoPrivacy: {
      requireMatchToView: false,
      blurPhotosUntilMatch: false,
      allowPhotoDownload: false,
      watermarkPhotos: true
    },
    messageSettings: {
      allowMessagesFrom: 'matches_only',
      readReceipts: true,
      typingIndicators: true,
      allowVoiceMessages: true,
      allowVideoMessages: true
    },
    dataUsage: {
      allowAIAnalysis: true,
      allowEmotionalAnalysis: true,
      allowMatchingAI: true,
      allowDataForImprovement: true,
      allowPersonalizedAds: false
    },
    incognitoMode: {
      enabled: false,
      hideFromRecentlyViewed: false,
      hideFromWhoLikedYou: false,
      noReadReceipts: false,
      noTypingIndicators: false
    },
    blockingSettings: {
      autoBlockSuspiciousAccounts: true,
      blockUnverifiedAccounts: false,
      hideFromBlockedUsers: true,
      allowReportsFromMatches: true
    },
    locationSettings: {
      shareExactLocation: false,
      maxDistanceToShow: 50,
      hideLocationFromProfile: false,
      allowLocationBasedMatching: true
    },
    dataRetention: {
      autoDeleteInactiveAccount: false,
      inactiveAccountDays: 365
    },
    privacyNotifications: {
      notifyOnProfileView: false,
      notifyOnScreenshot: true,
      notifyOnDataExport: true,
      notifyOnSettingsChange: true
    }
  };

  // Obtener configuración de privacidad
  async getPrivacySettings(userId: string): Promise<PrivacySettings> {
    console.log('🔒 Obteniendo configuración de privacidad para:', userId);
    
    try {
      // En producción, esto vendría de Firebase
      const stored = localStorage.getItem(`privacy_settings_${userId}`);
      
      if (stored) {
        const settings = JSON.parse(stored);
        console.log('✅ Configuración encontrada:', settings);
        return settings;
      }
      
      // Crear configuración por defecto
      const defaultSettings: PrivacySettings = {
        userId,
        profileVisibility: this.defaultSettings.profileVisibility,
        photoPrivacy: this.defaultSettings.photoPrivacy,
        messageSettings: this.defaultSettings.messageSettings,
        dataUsage: this.defaultSettings.dataUsage,
        incognitoMode: this.defaultSettings.incognitoMode,
        blockingSettings: this.defaultSettings.blockingSettings,
        locationSettings: this.defaultSettings.locationSettings,
        dataRetention: this.defaultSettings.dataRetention,
        privacyNotifications: this.defaultSettings.privacyNotifications,
        lastUpdated: new Date(),
        version: '1.0.0'
      };
      
      await this.savePrivacySettings(defaultSettings);
      console.log('✅ Configuración por defecto creada');
      return defaultSettings;
      
    } catch (error) {
      console.error('❌ Error obteniendo configuración:', error);
      throw new Error('Error al obtener configuración de privacidad');
    }
  }

  // Guardar configuración de privacidad
  async savePrivacySettings(settings: PrivacySettings): Promise<void> {
    console.log('💾 Guardando configuración de privacidad:', settings.userId);
    
    try {
      settings.lastUpdated = new Date();
      settings.version = '1.0.0';
      
      // En producción, esto iría a Firebase
      localStorage.setItem(`privacy_settings_${settings.userId}`, JSON.stringify(settings));
      
      // Registrar en audit log
      await this.logPrivacyAction(settings.userId, 'settings_updated', 'Configuración de privacidad actualizada');
      
      console.log('✅ Configuración guardada exitosamente');
      
    } catch (error) {
      console.error('❌ Error guardando configuración:', error);
      throw new Error('Error al guardar configuración de privacidad');
    }
  }

  // Actualizar configuración específica
  async updatePrivacySetting<K extends keyof PrivacySettings>(
    userId: string,
    category: K,
    updates: Partial<PrivacySettings[K]>
  ): Promise<void> {
    console.log('🔄 Actualizando configuración:', category, updates);
    
    try {
      const currentSettings = await this.getPrivacySettings(userId);
      
      // Actualizar la categoría específica
      const updatedCategory = {
        ...(currentSettings[category] as object),
        ...(updates as object)
      };
      
      currentSettings[category] = updatedCategory as PrivacySettings[K];
      
      await this.savePrivacySettings(currentSettings);
      
      console.log('✅ Configuración actualizada:', category);
      
    } catch (error) {
      console.error('❌ Error actualizando configuración:', error);
      throw new Error(`Error al actualizar ${String(category)}`);
    }
  }

  // Solicitar exportación de datos
  async requestDataExport(userId: string, dataTypes: string[]): Promise<DataExportRequest> {
    console.log('📤 Solicitando exportación de datos:', userId, dataTypes);
    
    try {
      const request: DataExportRequest = {
        id: `export_${Date.now()}_${userId}`,
        userId,
        requestDate: new Date(),
        status: 'pending',
        dataTypes
      };
      
      // En producción, esto iniciaría el proceso de exportación
      localStorage.setItem(`data_export_${request.id}`, JSON.stringify(request));
      
      // Simular procesamiento
      setTimeout(async () => {
        request.status = 'ready';
        request.downloadUrl = `https://citard.com/exports/${request.id}.zip`;
        request.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días
        
        localStorage.setItem(`data_export_${request.id}`, JSON.stringify(request));
      }, 5000);
      
      await this.logPrivacyAction(userId, 'data_export_requested', `Exportación solicitada: ${dataTypes.join(', ')}`);
      
      console.log('✅ Solicitud de exportación creada:', request.id);
      return request;
      
    } catch (error) {
      console.error('❌ Error solicitando exportación:', error);
      throw new Error('Error al solicitar exportación de datos');
    }
  }

  // Eliminar cuenta y datos
  async deleteAccount(userId: string, reason?: string): Promise<void> {
    console.log('🗑️ Eliminando cuenta:', userId, reason);
    
    try {
      // En producción, esto eliminaría todos los datos del usuario
      const keysToDelete = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(userId)) {
          keysToDelete.push(key);
        }
      }
      
      keysToDelete.forEach(key => localStorage.removeItem(key));
      
      await this.logPrivacyAction(userId, 'account_deleted', `Cuenta eliminada. Razón: ${reason || 'No especificada'}`);
      
      console.log('✅ Cuenta eliminada exitosamente');
      
    } catch (error) {
      console.error('❌ Error eliminando cuenta:', error);
      throw new Error('Error al eliminar cuenta');
    }
  }

  // Obtener audit log
  async getPrivacyAuditLog(userId: string, limit: number = 50): Promise<PrivacyAuditLog[]> {
    console.log('📋 Obteniendo audit log:', userId);
    
    try {
      const stored = localStorage.getItem(`privacy_audit_${userId}`);
      
      if (stored) {
        const logs: PrivacyAuditLog[] = JSON.parse(stored);
        return logs.slice(0, limit).sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      }
      
      return [];
      
    } catch (error) {
      console.error('❌ Error obteniendo audit log:', error);
      return [];
    }
  }

  // Registrar acción en audit log
  private async logPrivacyAction(userId: string, action: string, details: string): Promise<void> {
    try {
      const log: PrivacyAuditLog = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        action,
        details,
        timestamp: new Date(),
        ipAddress: '192.168.1.1', // En producción, obtener IP real
        userAgent: navigator.userAgent
      };
      
      const stored = localStorage.getItem(`privacy_audit_${userId}`);
      const logs: PrivacyAuditLog[] = stored ? JSON.parse(stored) : [];
      
      logs.unshift(log);
      
      // Mantener solo los últimos 100 logs
      if (logs.length > 100) {
        logs.splice(100);
      }
      
      localStorage.setItem(`privacy_audit_${userId}`, JSON.stringify(logs));
      
    } catch (error) {
      console.error('❌ Error registrando en audit log:', error);
    }
  }

  // Verificar si el usuario puede realizar una acción
  async canPerformAction(userId: string, action: string, targetUserId?: string): Promise<boolean> {
    console.log('🔍 Verificando permisos:', userId, action, targetUserId);
    
    try {
      const settings = await this.getPrivacySettings(userId);
      
      switch (action) {
        case 'view_profile':
          return settings.profileVisibility.discoverable;
          
        case 'send_message':
          if (settings.messageSettings.allowMessagesFrom === 'everyone') return true;
          if (settings.messageSettings.allowMessagesFrom === 'matches_only') {
            // En producción, verificar si son matches
            return true;
          }
          if (settings.messageSettings.allowMessagesFrom === 'verified_only') {
            // En producción, verificar si el usuario está verificado
            return true;
          }
          return false;
          
        case 'view_photos':
          if (settings.photoPrivacy.requireMatchToView && targetUserId) {
            // En producción, verificar si son matches
            return true;
          }
          return true;
          
        case 'see_online_status':
          return settings.profileVisibility.showOnlineStatus;
          
        case 'see_last_seen':
          return settings.profileVisibility.showLastSeen;
          
        default:
          return true;
      }
      
    } catch (error) {
      console.error('❌ Error verificando permisos:', error);
      return false;
    }
  }

  // Obtener resumen de privacidad
  async getPrivacySummary(userId: string): Promise<{
    privacyScore: number;
    recommendations: string[];
    risksDetected: string[];
    dataShared: string[];
  }> {
    console.log('📊 Generando resumen de privacidad:', userId);
    
    try {
      const settings = await this.getPrivacySettings(userId);
      let privacyScore = 0;
      const recommendations: string[] = [];
      const risksDetected: string[] = [];
      const dataShared: string[] = [];
      
      // Calcular score de privacidad (0-100)
      if (!settings.profileVisibility.discoverable) privacyScore += 15;
      if (settings.photoPrivacy.requireMatchToView) privacyScore += 15;
      if (settings.messageSettings.allowMessagesFrom !== 'everyone') privacyScore += 10;
      if (!settings.dataUsage.allowPersonalizedAds) privacyScore += 10;
      if (settings.incognitoMode.enabled) privacyScore += 20;
      if (settings.locationSettings.shareExactLocation === false) privacyScore += 15;
      if (settings.blockingSettings.autoBlockSuspiciousAccounts) privacyScore += 10;
      if (settings.dataRetention.autoDeleteInactiveAccount) privacyScore += 5;
      
      // Generar recomendaciones
      if (settings.profileVisibility.discoverable) {
        recommendations.push('Considera desactivar la visibilidad del perfil para mayor privacidad');
      }
      
      if (!settings.photoPrivacy.requireMatchToView) {
        recommendations.push('Requiere match para ver fotos para mayor seguridad');
      }
      
      if (settings.dataUsage.allowPersonalizedAds) {
        recommendations.push('Desactiva los anuncios personalizados para reducir el seguimiento');
      }
      
      if (!settings.incognitoMode.enabled) {
        recommendations.push('Activa el modo incógnito para navegar de forma privada');
      }
      
      // Detectar riesgos
      if (settings.locationSettings.shareExactLocation) {
        risksDetected.push('Compartiendo ubicación exacta - riesgo de seguridad');
      }
      
      if (settings.messageSettings.allowMessagesFrom === 'everyone') {
        risksDetected.push('Permitiendo mensajes de cualquiera - posible spam/acoso');
      }
      
      if (!settings.blockingSettings.autoBlockSuspiciousAccounts) {
        risksDetected.push('No bloqueas cuentas sospechosas automáticamente');
      }
      
      // Datos compartidos
      if (settings.dataUsage.allowAIAnalysis) dataShared.push('Análisis de IA');
      if (settings.dataUsage.allowEmotionalAnalysis) dataShared.push('Análisis emocional');
      if (settings.dataUsage.allowMatchingAI) dataShared.push('IA de matching');
      if (settings.dataUsage.allowDataForImprovement) dataShared.push('Mejora del servicio');
      if (settings.dataUsage.allowPersonalizedAds) dataShared.push('Publicidad personalizada');
      
      return {
        privacyScore,
        recommendations,
        risksDetected,
        dataShared
      };
      
    } catch (error) {
      console.error('❌ Error generando resumen:', error);
      return {
        privacyScore: 50,
        recommendations: ['Error al generar recomendaciones'],
        risksDetected: ['Error al detectar riesgos'],
        dataShared: ['Error al obtener datos compartidos']
      };
    }
  }
}

// Instancia singleton
export const privacyDashboardService = new PrivacyDashboardService();
export default privacyDashboardService;