// cita-rd/src/components/comunes/LoadingSpinner.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className={`${sizes[size]} bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4`}
      >
        <Heart className="text-white" size={size === 'sm' ? 16 : size === 'md' ? 24 : 32} />
      </motion.div>
      
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-white text-center"
      >
        <p className="text-lg font-semibold">Ta' Pa' Ti</p>
        <p className="text-sm text-gray-300">Cargando...</p>
      </motion.div>
    </div>
  );
}