/**
 * Analytics Service - Ta' Pa' Ti
 * Sistema centralizado de tracking de eventos y métricas
 */

import { logger } from '../utils/logger';

// Tipos de eventos que trackearemos
export enum AnalyticsEvent {
  // Autenticación
  LOGIN = 'login',
  REGISTER = 'register',
  LOGOUT = 'logout',
  
  // Perfil
  PROFILE_VIEW = 'profile_view',
  PROFILE_EDIT = 'profile_edit',
  PHOTO_UPLOAD = 'photo_upload',
  PHOTO_DELETE = 'photo_delete',
  
  // Discovery & Matching
  PROFILE_SWIPE_LEFT = 'profile_swipe_left',
  PROFILE_SWIPE_RIGHT = 'profile_swipe_right',
  SUPER_LIKE = 'super_like',
  MATCH_CREATED = 'match_created',
  
  // Chat
  MESSAGE_SENT = 'message_sent',
  MESSAGE_RECEIVED = 'message_received',
  VOICE_MESSAGE_SENT = 'voice_message_sent',
  VIDEO_MESSAGE_SENT = 'video_message_sent',
  PHOTO_MESSAGE_SENT = 'photo_message_sent',
  
  // Stories
  STORY_CREATED = 'story_created',
  STORY_VIEWED = 'story_viewed',
  STORY_REACTION = 'story_reaction',
  
  // Notificaciones
  NOTIFICATION_PERMISSION_GRANTED = 'notification_permission_granted',
  NOTIFICATION_PERMISSION_DENIED = 'notification_permission_denied',
  NOTIFICATION_RECEIVED = 'notification_received',
  NOTIFICATION_CLICKED = 'notification_clicked',
  
  // Engagement
  APP_OPEN = 'app_open',
  SESSION_START = 'session_start',
  SESSION_END = 'session_end',
  PAGE_VIEW = 'page_view',
  
  // Errores
  ERROR_OCCURRED = 'error_occurred',
  API_ERROR = 'api_error',
}

interface AnalyticsEventParams {
  [key: string]: string | number | boolean | undefined;
}

class AnalyticsService {
  private isInitialized = false;
  private userId: string | null = null;
  private sessionId: string;
  private sessionStartTime: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    
    // Track session start
    this.trackEvent(AnalyticsEvent.SESSION_START);
    
    // Track session end on page unload
    window.addEventListener('beforeunload', () => {
      this.trackSessionEnd();
    });
  }

  /**
   * Inicializar Google Analytics 4
   */
  initialize(measurementId: string) {
    if (this.isInitialized) {
      logger.analytics.warn('Analytics already initialized');
      return;
    }

    try {
      // Cargar gtag.js
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      // Inicializar gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', measurementId, {
        send_page_view: true, // Enviar automáticamente
        anonymize_ip: true, // GDPR compliance
        cookie_flags: 'SameSite=None;Secure',
      });

      this.isInitialized = true;
      logger.analytics.info('Analytics initialized', { measurementId });
      
      // Enviar evento inicial de carga
      this.trackPageView(window.location.pathname, document.title);
    } catch (error) {
      logger.analytics.error('Failed to initialize analytics', error);
    }
  }

  /**
   * Establecer el ID del usuario
   */
  setUserId(userId: string) {
    this.userId = userId;
    
    if (this.isInitialized && window.gtag) {
      window.gtag('set', { user_id: userId });
      logger.analytics.info('User ID set', { userId });
    }
  }

  /**
   * Limpiar el ID del usuario (logout)
   */
  clearUserId() {
    this.userId = null;
    
    if (this.isInitialized && window.gtag) {
      window.gtag('set', { user_id: null });
      logger.analytics.info('User ID cleared');
    }
  }

  /**
   * Trackear un evento
   */
  trackEvent(event: AnalyticsEvent, params: AnalyticsEventParams = {}) {
    const eventData = {
      ...params,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: Date.now(),
    };

    // Log local
    logger.analytics.info(`Event: ${event}`, eventData);

    // Enviar a Google Analytics
    if (this.isInitialized && window.gtag) {
      window.gtag('event', event, eventData);
    }

    // Aquí podrías agregar otros servicios de analytics
    // Por ejemplo: Mixpanel, Amplitude, etc.
  }

  /**
   * Trackear vista de página
   */
  trackPageView(pagePath: string, pageTitle?: string) {
    this.trackEvent(AnalyticsEvent.PAGE_VIEW, {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });

    if (this.isInitialized && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle || document.title,
      });
    }
  }

  /**
   * Trackear error
   */
  trackError(error: Error, context?: string) {
    this.trackEvent(AnalyticsEvent.ERROR_OCCURRED, {
      error_message: error.message,
      error_stack: error.stack?.substring(0, 500), // Limitar tamaño
      error_context: context,
    });
  }

  /**
   * Trackear tiempo de sesión
   */
  private trackSessionEnd() {
    const sessionDuration = Date.now() - this.sessionStartTime;
    
    this.trackEvent(AnalyticsEvent.SESSION_END, {
      session_duration_ms: sessionDuration,
      session_duration_min: Math.round(sessionDuration / 60000),
    });
  }

  /**
   * Generar ID de sesión único
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Trackear conversión (match, mensaje, etc.)
   */
  trackConversion(conversionType: string, value?: number) {
    this.trackEvent(conversionType as AnalyticsEvent, {
      conversion_type: conversionType,
      value: value,
    });

    if (this.isInitialized && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: conversionType,
        value: value,
      });
    }
  }

  /**
   * Trackear timing (performance)
   */
  trackTiming(category: string, variable: string, value: number) {
    this.trackEvent('timing_complete' as AnalyticsEvent, {
      timing_category: category,
      timing_variable: variable,
      timing_value: value,
    });
  }
}

// Exportar instancia singleton
export const analyticsService = new AnalyticsService();

// Declaración de tipos para window.gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
