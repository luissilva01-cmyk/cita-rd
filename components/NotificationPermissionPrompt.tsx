// cita-rd/components/NotificationPermissionPrompt.tsx
import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { logger } from '../utils/logger';

interface NotificationPermissionPromptProps {
  userId: string;
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

const NotificationPermissionPrompt: React.FC<NotificationPermissionPromptProps> = ({
  userId,
  onPermissionGranted,
  onPermissionDenied
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Verificar si debemos mostrar el prompt
    const checkPermissionStatus = () => {
      const status = notificationService.getPermissionStatus();
      
      // Mostrar prompt solo si:
      // 1. Las notificaciones están soportadas
      // 2. El permiso está en estado "default" (no se ha pedido aún)
      // 3. No se ha rechazado antes (guardado en localStorage)
      const hasDeclined = localStorage.getItem('notification-declined');
      
      if (notificationService.isSupported() && status.default && !hasDeclined) {
        // Esperar 5 segundos antes de mostrar el prompt (mejor UX)
        setTimeout(() => {
          setShowPrompt(true);
        }, 5000);
      }
    };

    checkPermissionStatus();
  }, []);

  const handleAllow = async () => {
    setIsRequesting(true);
    
    try {
      const granted = await notificationService.requestPermission();
      
      if (granted) {
        logger.notification.success('Notification permission granted');
        
        // Obtener y guardar token
        await notificationService.getAndSaveToken(userId);
        
        // Mostrar notificación de prueba
        await notificationService.showTestNotification();
        
        setShowPrompt(false);
        onPermissionGranted?.();
      } else {
        logger.notification.warn('Notification permission denied');
        localStorage.setItem('notification-declined', 'true');
        setShowPrompt(false);
        onPermissionDenied?.();
      }
    } catch (error) {
      logger.notification.error('Error requesting notification permission', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismiss = () => {
    // Guardar que el usuario rechazó (no volver a preguntar en esta sesión)
    localStorage.setItem('notification-declined', 'true');
    setShowPrompt(false);
    onPermissionDenied?.();
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bell size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Activa las Notificaciones</h3>
              <p className="text-sm text-white/90">No te pierdas ningún match</p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition-colors"
              disabled={isRequesting}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-gray-600 text-sm mb-4">
            Recibe notificaciones instantáneas cuando:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-rose-500">💕</span>
              <span>Alguien te da like o super like</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-rose-500">💬</span>
              <span>Recibes un nuevo mensaje</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-rose-500">⭐</span>
              <span>Tienes un nuevo match</span>
            </li>
          </ul>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              disabled={isRequesting}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Ahora no
            </button>
            <button
              onClick={handleAllow}
              disabled={isRequesting}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isRequesting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Activando...</span>
                </>
              ) : (
                <>
                  <Bell size={18} />
                  <span>Activar</span>
                </>
              )}
            </button>
          </div>

          {/* Privacy note */}
          <p className="text-xs text-gray-500 mt-3 text-center">
            Puedes desactivarlas en cualquier momento desde la configuración
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermissionPrompt;
