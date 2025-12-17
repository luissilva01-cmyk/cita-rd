import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { obtenerPerfilesRecomendados } from '../services/perfilesService';
import { crearLike } from '../services/likesService';
import { useMatchAnimation, useSoundEffects } from '../hooks/useMatchAnimation';
import { useNotificationToast } from '../components/comunes/NotificationToast';
import { useDatingGeolocation } from '../hooks/useGeolocation';
// Premium service import removed for now since monetization is disabled
// import { obtenerEstadoPremium } from '../services/premiumService';
import MatchModal from '../components/MatchModal';

export default function UltraModernHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados principales
  const [currentProfile, setCurrentProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  // Premium status removed for now since monetization is disabled
  // const [premiumStatus, setPremiumStatus] = useState(null);

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
    NotificationToast
  } = useNotificationToast();

  // Geolocalización
  const { 
    location, 
    calculateDistancesToProfiles,
    formatDistance 
  } = useDatingGeolocation();

  // Función para cargar datos iniciales
  const loadInitialData = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      
      // Intentar cargar perfiles reales, si falla usar datos de prueba
      let recommendedProfiles = [];
      try {
        recommendedProfiles = await obtenerPerfilesRecomendados(user.uid);
      } catch (error) {
        console.log('Using demo profiles:', error);
        // Datos de prueba mejorados
        recommendedProfiles = [
          {
            id: 'demo1',
            nombre: 'Laura',
            edad: 24,
            ciudad: 'Santo Domingo',
            fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG1JY78qK0u3NYUmsPmQhRdr4VfIXoUaPBskD7zMjs3HGO0A4X6Qhfr3Ol_zYVIaKYubMmealj49JYFxwlGtaWdQm4DVz85U3IwCjTmAMOQk1xY3Y6R8Ut_ZpqNwru0HvJoeYwTzD3nnC9qhpPkAgpPhRKVYcta9035NPTlp8mQ47TeHyOw2QhqAAEK5lZifyEwn3KC3ej7lk5Qqy7lmF-0SPfRaQgl_LoZUaIS_EKgbHlS5S2ttKnYVAPsbs_QMB3y730TKaXH2oF',
            fotos: [
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCG1JY78qK0u3NYUmsPmQhRdr4VfIXoUaPBskD7zMjs3HGO0A4X6Qhfr3Ol_zYVIaKYubMmealj49JYFxwlGtaWdQm4DVz85U3IwCjTmAMOQk1xY3Y6R8Ut_ZpqNwru0HvJoeYwTzD3nnC9qhpPkAgpPhRKVYcta9035NPTlp8mQ47TeHyOw2QhqAAEK5lZifyEwn3KC3ej7lk5Qqy7lmF-0SPfRaQgl_LoZUaIS_EKgbHlS5S2ttKnYVAPsbs_QMB3y730TKaXH2oF',
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=500&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop&crop=face'
            ],
            intereses: ['Senderismo', 'Sushi', 'Fotografía'],
            descripcion: 'Amante de la naturaleza y la buena comida. Siempre con la cámara lista para capturar momentos únicos.',
            verificado: true,
            enLinea: true,
            distance: 5
          },
          {
            id: 'demo2',
            nombre: 'Camila',
            edad: 26,
            ciudad: 'Santiago',
            fotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop&crop=face',
            fotos: [
              'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=500&fit=crop&crop=face'
            ],
            intereses: ['Arte', 'Cocina', 'Yoga'],
            descripcion: 'Artista y chef en mis tiempos libres. Me encanta crear cosas nuevas.',
            verificado: false,
            enLinea: false,
            distance: 12
          }
        ];
      }
      
      // Agregar distancias si tenemos geolocalización
      if (location) {
        recommendedProfiles = calculateDistancesToProfiles(recommendedProfiles);
      }
      
      setProfiles(recommendedProfiles);
      setCurrentProfile(recommendedProfiles[0]);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, location, calculateDistancesToProfiles]);

  // Premium status loading removed for now since monetization is disabled
  // const cargarEstadoPremium = useCallback(async () => {
  //   if (user?.uid) {
  //     const status = await obtenerEstadoPremium(user.uid);
  //     setPremiumStatus(status);
  //   }
  // }, [user?.uid]);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
    // Premium features disabled for now
    // Precargar sonidos
    preloadMatchSound();
    preloadSounds();
  }, [loadInitialData, preloadMatchSound, preloadSounds]);

  // Verificar autenticación
  if (!user) {
    navigate('/login');
    return null;
  }

  // Acciones de swipe
  const handleLike = async () => {
    if (!currentProfile) return;
    
    try {
      playLikeSound();
      const resultado = await crearLike(user.uid, currentProfile.id, 'like');
      
      if (resultado.match && resultado.matchedUser) {
        triggerMatchAnimation(resultado.matchedUser);
      } else {
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
        triggerMatchAnimation(resultado.matchedUser);
      } else {
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
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentProfile(profiles[newIndex]);
    } else {
      setCurrentProfile(null);
    }
  };

  const handlePhotoNavigation = (direction) => {
    if (!currentProfile?.fotos) return;
    
    if (direction === 'prev' && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    } else if (direction === 'next' && currentPhotoIndex < currentProfile.fotos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfiles...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-white text-4xl">favorite</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¡No hay más perfiles por ahora!
          </h2>
          <p className="text-gray-600 mb-6">
            Vuelve más tarde para descubrir nuevas personas increíbles
          </p>
          <button
            onClick={loadInitialData}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            Buscar más perfiles
          </button>
        </div>
      </div>
    );
  }

  const currentPhoto = currentProfile.fotos?.[currentPhotoIndex] || currentProfile.fotoUrl;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white h-screen w-full overflow-hidden flex flex-col relative antialiased">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-12 pb-2 bg-gray-50 dark:bg-gray-900 z-20 shrink-0">
        {/* User Avatar */}
        <button 
          onClick={() => navigate('/ultra-profile')}
          className="relative group"
        >
          <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow-sm">
            <img 
              className="w-full h-full object-cover" 
              src={user?.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
              alt="User profile thumbnail" 
            />
          </div>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-pink-500 text-2xl">favorite</span>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">CitaRD</h1>
        </div>

        {/* Notification Bell */}
        <button 
          onClick={() => navigate('/matches')}
          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined text-gray-900 dark:text-white text-[28px]">notifications</span>
          <span className="absolute top-2 right-2.5 h-2.5 w-2.5 rounded-full bg-pink-500 border-2 border-gray-50 dark:border-gray-900"></span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-between w-full max-w-md mx-auto px-4 pb-4 pt-2 relative z-10">
        {/* Profile Card Stack */}
        <div className="relative w-full h-full flex flex-col rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-gray-800 group">
          {/* Main Image */}
          <div className="absolute inset-0 bg-gray-200">
            <img 
              className="w-full h-full object-cover" 
              src={currentPhoto}
              alt={`${currentProfile.nombre} profile`}
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent via-60% to-black/90"></div>

          {/* Progress Indicators */}
          {currentProfile.fotos && currentProfile.fotos.length > 1 && (
            <div className="absolute top-3 left-0 right-0 px-3 flex gap-1.5 z-20">
              {currentProfile.fotos.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1 flex-1 rounded-full ${
                    index === currentPhotoIndex ? 'bg-white shadow-sm' : 'bg-white/40 backdrop-blur-sm'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Card Information Content */}
          <div className="absolute bottom-0 w-full p-5 flex flex-col gap-3 z-20 text-white select-none">
            {/* Name & Age */}
            <div className="flex items-end gap-3">
              <h2 className="text-3xl font-extrabold leading-none shadow-black/10 drop-shadow-md">
                {currentProfile.nombre}, {currentProfile.edad}
              </h2>
              {currentProfile.enLinea && (
                <div className="flex items-center gap-1 mb-1 opacity-90">
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                  <span className="text-xs font-semibold">Activa ahora</span>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-white/90">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
              <span className="text-base font-medium">
                {currentProfile.ciudad}
                {currentProfile.distance && ` • ${formatDistance(currentProfile.distance)}`}
              </span>
            </div>

            {/* Interest Chips */}
            {currentProfile.intereses && currentProfile.intereses.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {currentProfile.intereses.slice(0, 3).map((interes, index) => {
                  const iconMap = {
                    'Senderismo': 'hiking',
                    'Sushi': 'restaurant',
                    'Fotografía': 'photo_camera',
                    'Arte': 'palette',
                    'Cocina': 'restaurant',
                    'Yoga': 'self_improvement',
                    'Música': 'music_note',
                    'Viajes': 'flight',
                    'Deportes': 'sports_soccer'
                  };
                  
                  return (
                    <div 
                      key={index}
                      className="flex items-center px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/10 shadow-sm"
                    >
                      <span className="text-[16px] mr-1.5 material-symbols-outlined">
                        {iconMap[interes] || 'favorite'}
                      </span>
                      <span className="text-xs font-semibold tracking-wide">{interes}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Side Tap Areas (Invisible) */}
          <div 
            className="absolute inset-y-0 left-0 w-1/2 z-10 cursor-w-resize" 
            onClick={() => handlePhotoNavigation('prev')}
            title="Previous Photo"
          />
          <div 
            className="absolute inset-y-0 right-0 w-1/2 z-10 cursor-e-resize" 
            onClick={() => handlePhotoNavigation('next')}
            title="Next Photo"
          />
        </div>

        {/* Action Controls */}
        <div className="w-full flex items-center justify-center gap-6 pt-5 pb-2 shrink-0">
          {/* Reject Button */}
          <button 
            onClick={handlePass}
            className="group flex items-center justify-center h-16 w-16 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-red-500 text-[32px] group-hover:scale-110 transition-transform">close</span>
          </button>

          {/* Super Like Button */}
          <button 
            onClick={handleSuperLike}
            className="group flex items-center justify-center h-12 w-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-blue-500 text-[28px] group-hover:rotate-12 transition-transform">star</span>
          </button>

          {/* Like Button */}
          <button 
            onClick={handleLike}
            className="group flex items-center justify-center h-16 w-16 rounded-full bg-gray-900 shadow-lg shadow-gray-900/30 hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-white text-[32px] group-hover:scale-110 transition-transform">favorite</span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="shrink-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe pt-2">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
          {/* Home (Active) */}
          <button className="flex flex-col items-center justify-center w-16 gap-1 text-gray-900 dark:text-white group">
            <span className="material-symbols-outlined text-[28px]">style</span>
            <span className="h-1 w-1 rounded-full bg-gray-900 dark:bg-white mt-0.5"></span>
          </button>

          {/* Explore */}
          <button 
            onClick={() => navigate('/ultra-explore')}
            className="flex flex-col items-center justify-center w-16 gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <span className="material-symbols-outlined text-[28px]">grid_view</span>
          </button>

          {/* Chats */}
          <button 
            onClick={() => navigate('/ultra-chats')}
            className="flex flex-col items-center justify-center w-16 gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors relative"
          >
            <span className="material-symbols-outlined text-[28px]">chat_bubble</span>
            <div className="absolute top-0 right-3 h-2.5 w-2.5 rounded-full bg-pink-500 border-2 border-white dark:border-gray-900"></div>
          </button>

          {/* Profile */}
          <button 
            onClick={() => navigate('/ultra-profile')}
            className="flex flex-col items-center justify-center w-16 gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <span className="material-symbols-outlined text-[28px]">person</span>
          </button>
        </div>

        {/* Safe area spacing for iOS home indicator */}
        <div className="h-5 w-full"></div>
      </nav>

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => {
          closeMatchModal();
          nextProfile();
        }}
        matchedUser={matchedUser}
        currentUser={user}
        onSendMessage={(matchUser) => {
          navigate(`/chat/${[user.uid, matchUser.id].sort().join('_')}`);
        }}
        onKeepSwiping={() => {
          closeMatchModal();
          nextProfile();
        }}
      />

      {/* Notification Toast */}
      <NotificationToast />
    </div>
  );
}