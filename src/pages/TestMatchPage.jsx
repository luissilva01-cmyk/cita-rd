import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, X, Play } from 'lucide-react';
import MatchModal from '../components/MatchModal';
import { useMatchAnimation, useSoundEffects } from '../hooks/useMatchAnimation';
import { useNotificationToast } from '../components/comunes/NotificationToast';

export default function TestMatchPage() {
  const [showDemo, setShowDemo] = useState(false);
  
  const { 
    showMatchModal, 
    matchedUser, 
    triggerMatchAnimation, 
    closeMatchModal,
    createConfetti,
    playMatchSound
  } = useMatchAnimation();
  
  const { 
    playLikeSound, 
    playPassSound, 
    playSuperLikeSound 
  } = useSoundEffects();

  const {
    showLikeNotification,
    showSuperLikeNotification,
    showPassNotification,
    NotificationToast
  } = useNotificationToast();

  // Usuario de prueba
  const demoUser = {
    id: 'demo-user',
    nombre: 'Isabella',
    edad: 25,
    ciudad: 'Santo Domingo',
    fotoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face'
  };

  const currentUser = {
    uid: 'current-user',
    displayName: 'Tu Nombre',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
  };

  const handleTestMatch = () => {
    triggerMatchAnimation(demoUser);
  };

  const handleTestLike = () => {
    playLikeSound();
    showLikeNotification();
  };

  const handleTestSuperLike = () => {
    playSuperLikeSound();
    showSuperLikeNotification();
  };

  const handleTestPass = () => {
    playPassSound();
    showPassNotification();
  };

  const handleTestConfetti = () => {
    createConfetti();
  };

  const handleTestSound = () => {
    playMatchSound();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Test de Animaciones de Match
          </h1>
          <p className="text-gray-600">
            Prueba todas las animaciones y efectos de sonido de CitaRD
          </p>
        </div>

        {/* Tarjeta de demo */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="relative h-64">
            <img
              src={demoUser.fotoUrl}
              alt={demoUser.nombre}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold">{demoUser.nombre}, {demoUser.edad}</h3>
              <p className="text-white/90">{demoUser.ciudad}</p>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Prueba las animaciones:
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Test Match */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTestMatch}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <Heart size={20} fill="currentColor" />
                Test Match
              </motion.button>

              {/* Test Like */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTestLike}
                className="bg-pink-500 text-white p-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <Heart size={20} />
                Test Like
              </motion.button>

              {/* Test Super Like */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTestSuperLike}
                className="bg-blue-500 text-white p-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <Star size={20} />
                Test Super Like
              </motion.button>

              {/* Test Pass */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTestPass}
                className="bg-gray-500 text-white p-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <X size={20} />
                Test Pass
              </motion.button>

              {/* Test Confetti */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTestConfetti}
                className="bg-yellow-500 text-white p-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                🎊
                Test Confetti
              </motion.button>

              {/* Test Sound */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTestSound}
                className="bg-green-500 text-white p-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <Play size={20} />
                Test Sound
              </motion.button>
            </div>
          </div>
        </div>

        {/* Información */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ℹ️ Información de las animaciones
          </h3>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <Heart className="text-pink-500 mt-0.5" size={16} />
              <div>
                <strong>Match:</strong> Animación completa con confetti, sonido, modal celebratorio y opciones de acción.
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Heart className="text-pink-400 mt-0.5" size={16} />
              <div>
                <strong>Like:</strong> Notificación toast sutil con sonido suave.
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Star className="text-blue-500 mt-0.5" size={16} />
              <div>
                <strong>Super Like:</strong> Notificación especial con sonido distintivo.
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <X className="text-gray-500 mt-0.5" size={16} />
              <div>
                <strong>Pass:</strong> Feedback mínimo para no interrumpir el flujo.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={closeMatchModal}
        matchedUser={matchedUser}
        currentUser={currentUser}
        onSendMessage={(matchUser) => {
          console.log('Enviar mensaje a:', matchUser.nombre);
          closeMatchModal();
        }}
        onKeepSwiping={() => {
          closeMatchModal();
        }}
      />

      {/* Notification Toast */}
      <NotificationToast />
    </div>
  );
}