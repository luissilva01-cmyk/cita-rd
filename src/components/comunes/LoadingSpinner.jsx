// src/components/comunes/LoadingSpinner.jsx
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function LoadingSpinner({ size = "md", message = "Cargando..." }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`${sizeClasses[size]} relative`}
      >
        {/* Círculo exterior */}
        <div className="absolute inset-0 border-4 border-purple-400/30 rounded-full"></div>
        
        {/* Círculo animado */}
        <div className="absolute inset-0 border-4 border-transparent border-t-purple-400 border-r-pink-400 rounded-full"></div>
        
        {/* Corazón central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="text-pink-400 fill-current" size={size === 'xl' ? 32 : size === 'lg' ? 24 : 16} />
          </motion.div>
        </div>
      </motion.div>
      
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-white/80 font-medium"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

// Componente para pantalla completa
export function LoadingScreen({ message = "Cargando CitaRD..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-display font-bold text-white mt-6"
        >
          {message}
        </motion.h2>
      </div>
    </div>
  );
}