// cita-rd/components/OfflineBanner.tsx
// Banner que se muestra cuando no hay conexión a internet

import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OfflineBannerProps {
  isOnline: boolean;
  onRetry?: () => void;
}

/**
 * Banner que se muestra cuando el usuario está offline
 * 
 * @example
 * const isOnline = useOfflineDetection();
 * <OfflineBanner isOnline={isOnline} onRetry={() => window.location.reload()} />
 */
export const OfflineBanner: React.FC<OfflineBannerProps> = ({ 
  isOnline, 
  onRetry 
}) => {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-3 shadow-lg"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5" />
              <div>
                <p className="font-semibold">Sin conexión a internet</p>
                <p className="text-sm text-red-100">
                  Verifica tu conexión e intenta de nuevo
                </p>
              </div>
            </div>

            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-2 bg-white text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="font-medium">Reintentar</span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Banner simple sin animaciones (para mejor performance)
 */
export const SimpleOfflineBanner: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 text-center">
      <p className="text-sm font-medium">
        ⚠️ Sin conexión a internet
      </p>
    </div>
  );
};

export default OfflineBanner;
