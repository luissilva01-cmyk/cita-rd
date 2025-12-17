import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, X, Check } from 'lucide-react';

const NotificationToast = ({ 
  isVisible, 
  type = 'like', 
  message, 
  onClose,
  duration = 2000 
}) => {
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'like':
        return <Heart className="text-pink-500" size={20} fill="currentColor" />;
      case 'superlike':
        return <Star className="text-blue-500" size={20} fill="currentColor" />;
      case 'pass':
        return <X className="text-gray-500" size={20} />;
      case 'success':
        return <Check className="text-green-500" size={20} />;
      default:
        return <Heart className="text-pink-500" size={20} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'like':
        return 'bg-pink-500 text-white';
      case 'superlike':
        return 'bg-blue-500 text-white';
      case 'pass':
        return 'bg-gray-500 text-white';
      case 'success':
        return 'bg-green-500 text-white';
      default:
        return 'bg-pink-500 text-white';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`${getColors()} px-6 py-3 rounded-full shadow-lg flex items-center gap-3 backdrop-blur-sm`}>
            {getIcon()}
            <span className="font-medium">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook para manejar notificaciones
export const useNotificationToast = () => {
  const [notification, setNotification] = React.useState({
    isVisible: false,
    type: 'like',
    message: ''
  });

  const showNotification = React.useCallback((type, message) => {
    setNotification({
      isVisible: true,
      type,
      message
    });
  }, []);

  const hideNotification = React.useCallback(() => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const showLikeNotification = React.useCallback(() => {
    showNotification('like', '❤️ Like enviado');
  }, [showNotification]);

  const showSuperLikeNotification = React.useCallback(() => {
    showNotification('superlike', '⭐ Super Like enviado');
  }, [showNotification]);

  const showPassNotification = React.useCallback(() => {
    showNotification('pass', '👋 Perfil pasado');
  }, [showNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
    showLikeNotification,
    showSuperLikeNotification,
    showPassNotification,
    NotificationToast: (props) => (
      <NotificationToast
        {...notification}
        {...props}
        onClose={hideNotification}
      />
    )
  };
};

export default NotificationToast;