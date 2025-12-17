// src/components/comunes/Toast.jsx
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { useState, useEffect } from "react";

const toastTypes = {
  success: {
    icon: CheckCircle,
    bgClass: "bg-gradient-to-r from-green-500 to-emerald-500",
    iconColor: "text-white"
  },
  error: {
    icon: XCircle,
    bgClass: "bg-gradient-to-r from-red-500 to-pink-500",
    iconColor: "text-white"
  },
  warning: {
    icon: AlertCircle,
    bgClass: "bg-gradient-to-r from-yellow-500 to-orange-500",
    iconColor: "text-white"
  },
  info: {
    icon: Info,
    bgClass: "bg-gradient-to-r from-blue-500 to-purple-500",
    iconColor: "text-white"
  }
};

export default function Toast({ 
  type = "info", 
  message, 
  isVisible, 
  onClose, 
  duration = 4000,
  position = "top-right" 
}) {
  const [progress, setProgress] = useState(100);
  const toastConfig = toastTypes[type];
  const Icon = toastConfig.icon;

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          onClose();
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible, duration, onClose]);

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2"
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={`fixed ${positionClasses[position]} z-50 max-w-sm w-full`}
        >
          <div className={`${toastConfig.bgClass} rounded-2xl shadow-2xl overflow-hidden`}>
            {/* Contenido principal */}
            <div className="p-4 flex items-center gap-3">
              <Icon className={toastConfig.iconColor} size={24} />
              <p className="text-white font-medium flex-1">{message}</p>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Barra de progreso */}
            <div className="h-1 bg-white/20">
              <motion.div
                className="h-full bg-white"
                initial={{ width: "100%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook para usar toasts
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (type, message, options = {}) => {
    const id = Date.now();
    const newToast = {
      id,
      type,
      message,
      ...options
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove después del duration
    setTimeout(() => {
      removeToast(id);
    }, options.duration || 4000);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, options) => showToast("success", message, options);
  const error = (message, options) => showToast("error", message, options);
  const warning = (message, options) => showToast("warning", message, options);
  const info = (message, options) => showToast("info", message, options);

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast
  };
}

// Contenedor de toasts
export function ToastContainer({ toasts, removeToast, position = "top-right" }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -50 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              x: position.includes('right') ? 0 : position.includes('left') ? 0 : '-50%'
            }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ delay: index * 0.1 }}
            className={`absolute pointer-events-auto ${
              position === 'top-right' ? `top-4 right-4` :
              position === 'top-left' ? `top-4 left-4` :
              position === 'bottom-right' ? `bottom-4 right-4` :
              position === 'bottom-left' ? `bottom-4 left-4` :
              position === 'top-center' ? `top-4 left-1/2` :
              `bottom-4 left-1/2`
            }`}
            style={{ 
              transform: position.includes('center') ? 'translateX(-50%)' : 'none',
              marginTop: position.includes('top') ? `${index * 80}px` : 'auto',
              marginBottom: position.includes('bottom') ? `${index * 80}px` : 'auto'
            }}
          >
            <Toast
              type={toast.type}
              message={toast.message}
              isVisible={true}
              onClose={() => removeToast(toast.id)}
              duration={toast.duration || 4000}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}