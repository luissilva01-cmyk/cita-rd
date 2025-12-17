import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  X, 
  Sparkles,
  Star,
  Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Componente de confetti
const ConfettiPiece = ({ delay = 0, color = '#ff6b9d' }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full"
    style={{ backgroundColor: color }}
    initial={{ 
      x: Math.random() * window.innerWidth,
      y: -20,
      rotate: 0,
      scale: Math.random() * 0.5 + 0.5
    }}
    animate={{ 
      y: window.innerHeight + 20,
      rotate: 360,
      x: Math.random() * window.innerWidth
    }}
    transition={{ 
      duration: 3 + Math.random() * 2,
      delay,
      ease: "easeOut"
    }}
  />
);

// Componente de corazones flotantes
const FloatingHeart = ({ delay = 0 }) => (
  <motion.div
    className="absolute text-pink-500"
    initial={{ 
      x: Math.random() * window.innerWidth,
      y: window.innerHeight,
      scale: 0,
      rotate: 0
    }}
    animate={{ 
      y: -50,
      scale: [0, 1, 0.8, 0],
      rotate: [0, 15, -15, 0],
      x: Math.random() * window.innerWidth
    }}
    transition={{ 
      duration: 4,
      delay,
      ease: "easeOut"
    }}
  >
    <Heart size={24} fill="currentColor" />
  </motion.div>
);

export default function MatchModal({ 
  isOpen, 
  onClose, 
  matchedUser, 
  currentUser,
  onSendMessage,
  onKeepSwiping 
}) {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSound, setPlaySound] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setPlaySound(true);
      
      // Reproducir sonido de match (opcional)
      if (playSound) {
        try {
          const audio = new Audio('/sounds/match.mp3');
          audio.volume = 0.3;
          audio.play().catch(e => console.log('No se pudo reproducir el sonido:', e));
        } catch (e) {
          console.log('Audio no disponible');
        }
      }

      // Ocultar confetti después de 4 segundos
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, playSound]);

  const handleSendMessage = () => {
    if (onSendMessage) {
      onSendMessage(matchedUser);
    } else {
      // Navegar al chat
      navigate(`/chat/${generateChatId(currentUser.uid, matchedUser.id)}`);
    }
    onClose();
  };

  const handleKeepSwiping = () => {
    if (onKeepSwiping) {
      onKeepSwiping();
    }
    onClose();
  };

  const generateChatId = (uid1, uid2) => {
    return [uid1, uid2].sort().join('_');
  };

  if (!matchedUser) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay con gradiente animado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{
              background: 'linear-gradient(45deg, #ff6b9d, #c44569, #f8b500, #ff6b9d)',
              backgroundSize: '400% 400%'
            }}
          >
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full"
              style={{
                background: 'linear-gradient(45deg, #ff6b9d, #c44569, #f8b500, #ff6b9d)',
                backgroundSize: '400% 400%'
              }}
            />
          </motion.div>

          {/* Confetti */}
          {showConfetti && (
            <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <ConfettiPiece 
                  key={`confetti-${i}`}
                  delay={i * 0.1}
                  color={['#ff6b9d', '#c44569', '#f8b500', '#ff9ff3', '#54a0ff'][i % 5]}
                />
              ))}
              {[...Array(20)].map((_, i) => (
                <FloatingHeart key={`heart-${i}`} delay={i * 0.2} />
              ))}
            </div>
          )}

          {/* Modal Principal */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              type: "spring", 
              damping: 15, 
              stiffness: 300,
              duration: 0.8
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden relative">
              
              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-black/20 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Header con animación */}
              <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="mb-4"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Heart className="text-pink-500" size={40} fill="currentColor" />
                    </motion.div>
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  ¡Es un Match!
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-white/90"
                >
                  A {matchedUser.nombre} también le gustas
                </motion.p>

                {/* Estrellas decorativas */}
                <div className="absolute top-2 left-4">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Sparkles className="text-yellow-300" size={20} />
                  </motion.div>
                </div>

                <div className="absolute top-2 right-12">
                  <motion.div
                    animate={{ 
                      rotate: -360,
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Star className="text-yellow-300" size={16} />
                  </motion.div>
                </div>

                <div className="absolute bottom-2 left-8">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Flame className="text-orange-300" size={18} />
                  </motion.div>
                </div>
              </div>

              {/* Fotos de los usuarios */}
              <div className="p-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-center gap-4 mb-6"
                >
                  {/* Foto del usuario actual */}
                  <div className="relative">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                      alt="Tu foto"
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-pink-200 shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                      <Heart className="text-white" size={16} fill="currentColor" />
                    </div>
                  </div>

                  {/* Corazón central animado */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-pink-500"
                  >
                    <Heart size={32} fill="currentColor" />
                  </motion.div>

                  {/* Foto del match */}
                  <div className="relative">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={matchedUser.fotoUrl}
                      alt={matchedUser.nombre}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-200 shadow-lg"
                    />
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Heart className="text-white" size={16} fill="currentColor" />
                    </div>
                  </div>
                </motion.div>

                {/* Info del match */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center mb-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {matchedUser.nombre}
                  </h3>
                  {matchedUser.edad && (
                    <p className="text-gray-600">
                      {matchedUser.edad} años
                    </p>
                  )}
                  {matchedUser.ciudad && (
                    <p className="text-gray-500 text-sm">
                      {matchedUser.ciudad}
                    </p>
                  )}
                </motion.div>

                {/* Botones de acción */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="space-y-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendMessage}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <MessageCircle size={20} />
                    Enviar mensaje
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleKeepSwiping}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Seguir explorando
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}