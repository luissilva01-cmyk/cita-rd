// cita-rd/hooks/useOfflineDetection.ts
// Hook para detectar estado de conexión online/offline

import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';

/**
 * Hook para detectar si el usuario está online u offline
 * 
 * @example
 * const isOnline = useOfflineDetection();
 * 
 * if (!isOnline) {
 *   return <OfflineBanner />;
 * }
 */
export function useOfflineDetection(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      logger.network.info('Connection restored');
      setIsOnline(true);
    };

    const handleOffline = () => {
      logger.network.warn('Connection lost');
      setIsOnline(false);
    };

    // Agregar event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar estado inicial
    setIsOnline(navigator.onLine);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Hook extendido con información adicional de conexión
 */
export function useNetworkStatus() {
  const [status, setStatus] = useState({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    wasOffline: false,
    offlineSince: null as Date | null,
    reconnectedAt: null as Date | null
  });

  useEffect(() => {
    const handleOnline = () => {
      const now = new Date();
      logger.network.info('Connection restored', {
        offlineDuration: status.offlineSince 
          ? now.getTime() - status.offlineSince.getTime()
          : 0
      });

      setStatus(prev => ({
        isOnline: true,
        wasOffline: prev.offlineSince !== null,
        offlineSince: null,
        reconnectedAt: now
      }));
    };

    const handleOffline = () => {
      const now = new Date();
      logger.network.warn('Connection lost');

      setStatus(prev => ({
        ...prev,
        isOnline: false,
        offlineSince: now
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [status.offlineSince]);

  return status;
}

export default useOfflineDetection;
