// cita-rd/services/notificationService.ts
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { logger } from '../utils/logger';

// VAPID Key de Firebase Console
// Project Settings > Cloud Messaging > Web Push certificates
const VAPID_KEY = 'BPYyFAePfkeyT_bRq5IkbHLYRtbffQtN2lXJIlcGmiCEUhn96ODpanN98M4kMpgOs7oHFIMOvI6Y7uu_G597Cw0';

export interface NotificationPermissionStatus {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

class NotificationService {
  private messaging: Messaging | null = null;
  private currentToken: string | null = null;

  constructor() {
    // Inicializar messaging solo si está soportado
    if (this.isSupported()) {
      try {
        this.messaging = getMessaging();
        this.setupForegroundListener();
      } catch (error) {
        logger.notification.error('Error inicializando Firebase Messaging', error);
      }
    }
  }

  /**
   * Verificar si las notificaciones push están soportadas
   */
  isSupported(): boolean {
    return 'Notification' in window && 
           'serviceWorker' in navigator && 
           'PushManager' in window;
  }

  /**
   * Obtener el estado actual del permiso de notificaciones
   */
  getPermissionStatus(): NotificationPermissionStatus {
    if (!this.isSupported()) {
      return { granted: false, denied: true, default: false };
    }

    const permission = Notification.permission;
    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      default: permission === 'default'
    };
  }

  /**
   * Solicitar permiso para notificaciones
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      logger.notification.warn('Push notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      logger.notification.info('Notification permission:', permission);
      
      if (permission === 'granted') {
        // Obtener token FCM
        await this.getAndSaveToken();
        return true;
      }
      
      return false;
    } catch (error) {
      logger.notification.error('Error requesting notification permission', error);
      return false;
    }
  }

  /**
   * Obtener token FCM y guardarlo en Firestore
   */
  async getAndSaveToken(userId?: string): Promise<string | null> {
    if (!this.messaging) {
      logger.notification.warn('Messaging not initialized');
      return null;
    }

    try {
      // Registrar service worker primero
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      logger.notification.info('Service Worker registered');

      // Esperar a que esté activo
      await navigator.serviceWorker.ready;

      // Obtener token
      const token = await getToken(this.messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration
      });

      if (token) {
        logger.notification.success('FCM Token obtained', { token: token.substring(0, 20) + '...' });
        this.currentToken = token;

        // Guardar token en Firestore si tenemos userId
        if (userId) {
          await this.saveTokenToFirestore(userId, token);
        }

        return token;
      } else {
        logger.notification.warn('No FCM token available');
        return null;
      }
    } catch (error) {
      logger.notification.error('Error getting FCM token', error);
      return null;
    }
  }

  /**
   * Guardar token en Firestore
   */
  private async saveTokenToFirestore(userId: string, token: string): Promise<void> {
    try {
      // Primero obtener el documento existente para preservar createdAt
      const tokenRef = doc(db, 'fcmTokens', userId);
      const existingDoc = await getDoc(tokenRef);
      
      const tokenData: any = {
        token,
        userId,
        updatedAt: serverTimestamp(),
        platform: 'web',
        userAgent: navigator.userAgent,
        deleted: false // Marcar explícitamente como NO eliminado
      };
      
      // Solo agregar createdAt si es un documento nuevo
      if (!existingDoc.exists()) {
        tokenData.createdAt = serverTimestamp();
      }
      
      // Usar merge: true para preservar createdAt pero sobrescribir deleted
      await setDoc(tokenRef, tokenData, { merge: true });

      logger.notification.success('FCM token saved to Firestore');
    } catch (error) {
      logger.notification.error('Error saving FCM token to Firestore', error);
    }
  }

  /**
   * Configurar listener para mensajes en foreground
   */
  private setupForegroundListener(): void {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload) => {
      logger.notification.info('Foreground message received', payload);

      // Mostrar notificación usando Service Worker
      this.showNotificationViaServiceWorker(payload);
    });
  }

  /**
   * Mostrar notificación a través del Service Worker
   */
  private async showNotificationViaServiceWorker(payload: any): Promise<void> {
    try {
      // Verificar que el Service Worker esté registrado
      const registration = await navigator.serviceWorker.ready;

      const notificationTitle = payload.notification?.title || 'Ta\' Pa\' Ti';
      const notificationOptions: NotificationOptions = {
        body: payload.notification?.body || 'Tienes una nueva notificación',
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: payload.data?.type || 'general',
        data: payload.data,
        requireInteraction: false,
        vibrate: [200, 100, 200],
      };

      // Mostrar notificación a través del Service Worker
      await registration.showNotification(notificationTitle, notificationOptions);
      logger.notification.success('Notification shown via Service Worker');
    } catch (error) {
      logger.notification.error('Error showing notification via Service Worker', error);
    }
  }

  /**
   * Eliminar token (cuando el usuario cierra sesión)
   */
  async deleteToken(userId: string): Promise<void> {
    try {
      // Eliminar de Firestore
      await setDoc(doc(db, 'fcmTokens', userId), {
        token: null,
        updatedAt: serverTimestamp(),
        deleted: true
      }, { merge: true });

      this.currentToken = null;
      logger.notification.info('FCM token deleted');
    } catch (error) {
      logger.notification.error('Error deleting FCM token', error);
    }
  }

  /**
   * Obtener el token actual
   */
  getCurrentToken(): string | null {
    return this.currentToken;
  }

  /**
   * Mostrar notificación de prueba
   */
  async showTestNotification(): Promise<void> {
    if (Notification.permission !== 'granted') {
      logger.notification.warn('Notification permission not granted');
      return;
    }

    try {
      // Usar Service Worker para mostrar la notificación
      const registration = await navigator.serviceWorker.ready;
      
      await registration.showNotification('🎉 Ta\' Pa\' Ti', {
        body: 'Las notificaciones están funcionando correctamente!',
        icon: '/logo192.png',
        badge: '/logo192.png',
        vibrate: [200, 100, 200],
        tag: 'test-notification',
        requireInteraction: false,
        data: {
          url: window.location.origin
        }
      });

      logger.notification.success('Test notification shown via Service Worker');
    } catch (error) {
      logger.notification.error('Error showing test notification', error);
    }
  }
}

// Exportar instancia singleton
export const notificationService = new NotificationService();
export default notificationService;
