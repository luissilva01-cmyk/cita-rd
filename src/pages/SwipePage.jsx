import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { 
  Heart, 
  X, 
  Star, 
  RotateCcw, 
  Info,
  MapPin,
  Verified
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { obtenerPerfilesRecomendados } from '../services/perfilesService';
import { crearLike } from '../services/likesService';
import BottomNavigation from '../components/comunes/BottomNavigation';
import PerfilModal from '../components/PerfilModal';
import MatchModal from '../components/MatchModal';
import PhotoViewer from '../components/PhotoViewer';
import { useMatchAnimation, useSoundEffects } from '../hooks/useMatchAnimation';
import { useNotificationToast } from '../components/comunes/NotificationToast';
import { useDatingGeolocation } from '../hooks/useGeolocation';
import { rewindLastSwipe, obtenerEstadoPremium } from '../services/premiumService';

export default function SwipePage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState(null);
  const [rewindLoading, setRewindLoading] = useState(false);
  
  // Hooks para animaciones y sonidos
  const { 
    showMatchModal, 
    matchedUser, 
    triggerMatchAnimation, 
    closeMatchModal,
    preloadMatchSound 
  } = useMatchAnimation();
  
  const { 
    preloadSounds, 
    playLikeSound, 
    playPassSound, 
    playSuperLikeSound 
  } = useSoundEffects();

  const {
    showLikeNotification,
    showSuperLikeNotification,
    showPassNotification,
    showNotification,
    NotificationToast
  } = useNotificationToast();

  // Geolocalización
  const { 
    location, 
    calculateDistancesToProfiles,
    formatDistance 
  } = useDatingGeolocation();
  
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const nopeOpacity = useTransform(x, [-150, -50], [1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [1, 0]);

  const cargarPerfiles = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      let perfilesRecomendados = await obtenerPerfilesRecomendados(user.uid);
      
      // Agregar distancias si tenemos geolocalización
      if (location) {
        perfilesRecomendados = calculateDistancesToProfiles(perfilesRecomendados);
      }
      
      setProfiles(perfilesRecomendados);
    } catch (error) {
      console.error('Error cargando perfiles:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, location, calculateDistancesToProfiles]);

  const cargarEstadoPremium = useCallback(async () => {
    if (user?.uid) {
      const status = await obtenerEstadoPremium(user.uid);
      setPremiumStatus(status);
    }
  }, [user?.uid]);

  useEffect(() => {
    cargarPerfiles();
    cargarEstadoPremium();
    // Precargar sonidos
    preloadMatchSound();
    preloadSounds();
  }, [cargarPerfiles, cargarEstadoPremium, preloadMatchSound, preloadSounds]);



  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center px-6">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-white" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Inicia sesión para continuar
          </h2>
          <p className="text-gray-600 mb-6">
            Necesitas una cuenta para descubrir personas increíbles
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  const handleDragEnd = (_, info) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      // Like (swipe right)
      handleLike();
    } else if (info.offset.x < -threshold) {
      // Pass (swipe left)
      handlePass();
    } else {
      // Return to center
      x.set(0);
    }
  };

  const handleLike = async () => {
    if (!currentProfile) return;
    
    try {
      playLikeSound();
      const resultado = await crearLike(user.uid, currentProfile.id, 'like');
      
      if (resultado.match && resultado.matchedUser) {
        // ¡Es un match! Mostrar animación
        triggerMatchAnimation(resultado.matchedUser);
      } else {
        // Solo like, mostrar notificación y continuar
        showLikeNotification();
        nextProfile();
      }
    } catch (error) {
      console.error('Error al dar like:', error);
      nextProfile();
    }
  };

  const handlePass = () => {
    playPassSound();
    showPassNotification();
    nextProfile();
  };

  const handleSuperLike = async () => {
    if (!currentProfile) return;
    
    try {
      playSuperLikeSound();
      const resultado = await crearLike(user.uid, currentProfile.id, 'superlike');
      
      if (resultado.match && resultado.matchedUser) {
        // ¡Es un match! Mostrar animación
        triggerMatchAnimation(resultado.matchedUser);
      } else {
        // Solo super like, mostrar notificación y continuar
        showSuperLikeNotification();
        nextProfile();
      }
    } catch (error) {
      console.error('Error al dar super like:', error);
      nextProfile();
    }
  };

  const nextProfile = () => {
    setCurrentPhotoIndex(0);
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      x.set(0);
    } else {
      // No more profiles
      setCurrentIndex(profiles.length);
    }
  };

  const handleRewind = async () => {
    if (!premiumStatus?.features.rewind) {
      showNotification('error', 'Rewind requiere suscripción premium');
      return;
    }

    if (currentIndex === 0) {
      showNotification('error', 'No hay acciones para deshacer');
      return;
    }

    setRewindLoading(true);
    
    try {
      const result = await rewindLastSwipe(user.uid);
      
      if (result.success && result.restoredProfile) {
        // Agregar el perfil restaurado al inicio
        setProfiles(prev => [result.restoredProfile, ...prev]);
        setCurrentIndex(0);
        setCurrentPhotoIndex(0);
        x.set(0);
        
        showNotification('success', `Acción deshecha: ${result.action === 'like' ? 'Like' : 'Pass'} restaurado`);
      } else {
        showNotification('error', result.error || 'No se pudo deshacer la acción');
      }
    } catch (error) {
      console.error('Error en rewind:', error);
      showNotification('error', 'Error al deshacer la acción');
    } finally {
      setRewindLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfiles...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile || currentIndex >= profiles.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center px-6">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-white" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¡No hay más perfiles por ahora!
          </h2>
          <p className="text-gray-600 mb-6">
            Vuelve más tarde para descubrir nuevas personas increíbles
          </p>
          <button
            onClick={cargarPerfiles}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold"
          >
            Buscar más perfiles
          </button>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Main Card Container */}
      <div className="relative h-screen flex items-center justify-center p-4">
        {/* Background Cards (Stack Effect) */}
        {profiles.slice(currentIndex + 1, currentIndex + 3).map((profile, index) => (
          <div
            key={profile.id}
            className="absolute w-full max-w-sm h-[600px] bg-white rounded-3xl shadow-lg"
            style={{
              transform: `scale(${0.95 - index * 0.05}) translateY(${index * 10}px)`,
              zIndex: 10 - index,
              opacity: 0.8 - index * 0.3
            }}
          />
        ))}

        {/* Main Card */}
        <motion.div
          ref={cardRef}
          className="relative w-full max-w-sm h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ x, rotate, opacity, zIndex: 20 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          whileTap={{ scale: 0.95 }}
        >
          {/* Enhanced Photo Viewer */}
          <PhotoViewer
            photos={currentProfile.fotos || [currentProfile.fotoUrl]}
            currentIndex={currentPhotoIndex}
            onIndexChange={setCurrentPhotoIndex}
            showControls={true}
            className="absolute inset-0"
          />
          
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            
          {/* Profile Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl font-bold">
                {currentProfile.nombre}, {currentProfile.edad}
              </h2>
              {currentProfile.verificado && (
                <Verified className="text-blue-400" size={24} />
              )}
            </div>
            
            {(currentProfile.ciudad || currentProfile.distance) && (
              <div className="flex items-center gap-1 mb-3">
                <MapPin size={16} />
                <span className="text-white/90">
                  {currentProfile.ciudad}
                  {currentProfile.distance && (
                    <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                      {formatDistance(currentProfile.distance)}
                    </span>
                  )}
                </span>
              </div>
            )}

            {currentProfile.intereses && currentProfile.intereses.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {currentProfile.intereses.slice(0, 3).map((interes, index) => (
                  <span
                    key={index}
                    className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
                  >
                    {interes}
                  </span>
                ))}
              </div>
            )}

            {currentProfile.descripcion && (
              <p className="text-white/90 text-sm line-clamp-2 mb-4">
                {currentProfile.descripcion}
              </p>
            )}

            {/* View Full Profile Button */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
            >
              <Info size={16} />
              Ver perfil completo
            </button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-30">
          {/* Pass Button */}
          <button
            onClick={handlePass}
            className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          >
            <X className="text-red-500" size={24} />
          </button>

          {/* Super Like Button */}
          <button
            onClick={handleSuperLike}
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          >
            <Star className="text-blue-500" size={20} />
          </button>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          >
            <Heart className="text-white" size={28} />
          </button>

          {/* Rewind Button (Premium) */}
          <button
            onClick={handleRewind}
            disabled={!premiumStatus?.features.rewind || rewindLoading || currentIndex === 0}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
              premiumStatus?.features.rewind && currentIndex > 0
                ? 'bg-yellow-500 hover:bg-yellow-600 hover:scale-110'
                : 'bg-gray-200 opacity-50'
            }`}
          >
            {rewindLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <RotateCcw className={premiumStatus?.features.rewind ? "text-white" : "text-gray-500"} size={20} />
            )}
          </button>
        </div>

        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg rotate-12 opacity-0"
          style={{
            opacity: nopeOpacity
          }}
        >
          NOPE
        </motion.div>

        <motion.div
          className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg -rotate-12 opacity-0"
          style={{
            opacity: likeOpacity
          }}
        >
          LIKE
        </motion.div>
      </div>

      {/* Profile Modal */}
      <PerfilModal
        perfil={currentProfile}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onLike={handleLike}
        onSuperLike={handleSuperLike}
        onPass={handlePass}
      />

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => {
          closeMatchModal();
          nextProfile(); // Continuar al siguiente perfil después del match
        }}
        matchedUser={matchedUser}
        currentUser={user}
        onSendMessage={(matchUser) => {
          // Navegar al chat o abrir modal de mensaje
          console.log('Enviar mensaje a:', matchUser.nombre);
        }}
        onKeepSwiping={() => {
          closeMatchModal();
          nextProfile();
        }}
      />

      {/* Notification Toast */}
      <NotificationToast />

      <BottomNavigation />
    </div>
  );
}