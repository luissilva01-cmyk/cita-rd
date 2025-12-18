import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useMatchAnimation, useSoundEffects } from '../hooks/useMatchAnimation';
import { useNotificationToast } from '../components/comunes/NotificationToast';
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

  // Hooks para animaciones y sonidos
  const { 
    showMatchModal, 
    matchedUser, 
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

  // Función simple para formatear distancia
  const formatDistance = (distance) => {
    return distance < 1 ? '< 1 km' : `${distance} km`;
  };

  // Función para cargar datos iniciales
  const loadInitialData = () => {
    try {
      setLoading(true);
      
      // Datos demo optimizados
      const recommendedProfiles = [
        {
          id: 'demo1',
          nombre: 'Laura',
          edad: 24,
          ciudad: 'Santo Domingo',
          fotoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600&h=800&fit=crop&crop=face',
          fotos: [
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600&h=800&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop&crop=face'
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
          fotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop&crop=face',
          fotos: [
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600&h=800&fit=crop&crop=face'
          ],
          intereses: ['Arte', 'Cocina', 'Yoga'],
          descripcion: 'Artista y chef en mis tiempos libres. Me encanta crear cosas nuevas.',
          verificado: false,
          enLinea: false,
          distance: 12
        },
        {
          id: 'demo3',
          nombre: 'Sofia',
          edad: 23,
          ciudad: 'Santo Domingo',
          fotoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop&crop=face',
          fotos: [
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop&crop=face'
          ],
          intereses: ['Música', 'Baile', 'Playa'],
          descripcion: 'Bailarina profesional. Amo la música y los atardeceres en la playa.',
          verificado: true,
          enLinea: true,
          distance: 3
        }
      ];
      
      setProfiles(recommendedProfiles);
      setCurrentProfile(recommendedProfiles[0]);
      setLoading(false);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
    if (preloadMatchSound) preloadMatchSound();
    if (preloadSounds) preloadSounds();
  }, [preloadMatchSound, preloadSounds]);

  // Acciones de swipe
  const handleLike = async () => {
    if (!currentProfile) return;
    
    try {
      playLikeSound();
      showLikeNotification();
      nextProfile();
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
      showSuperLikeNotification();
      nextProfile();
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
    <>
      {/* Desktop Background */}
      <div className="hidden md:block fixed inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 -z-10"></div>
      
      {/* Main Container - Mobile First, Centered on Desktop */}
      <div className="min-h-screen md:min-h-0 md:h-screen md:flex md:items-center md:justify-center md:p-4">
        <div className="w-full md:max-w-[430px] md:h-[calc(100vh-2rem)] md:max-h-[932px] bg-white md:rounded-3xl md:shadow-2xl md:overflow-hidden flex flex-col">
          
          {/* Header */}
          <header className="flex items-center justify-between px-5 py-4 bg-white shrink-0 border-b border-gray-100">
            {/* User Avatar */}
            <button 
              onClick={() => navigate('/ultra-profile')}
              className="relative group"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-white text-[20px]">person</span>
              </div>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-red-500 text-[26px]">favorite</span>
              <h1 className="text-[22px] font-bold tracking-tight text-gray-900">CitaRD</h1>
            </div>

            {/* Notification */}
            <button 
              onClick={() => navigate('/ultra-matches')}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-700 text-[26px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
            </button>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 overflow-hidden">
            {/* Profile Card */}
            <div className="relative w-full h-full max-h-[600px] rounded-2xl overflow-hidden shadow-xl bg-gray-200">
              {/* Main Image */}
              <img 
                className="w-full h-full object-cover" 
                src={currentPhoto}
                alt={`${currentProfile.nombre} profile`}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent via-40% to-black/70"></div>

              {/* Progress Indicators */}
              {currentProfile.fotos && currentProfile.fotos.length > 1 && (
                <div className="absolute top-3 left-3 right-3 flex gap-1.5 z-20">
                  {currentProfile.fotos.map((_, index) => (
                    <div 
                      key={index}
                      className={`h-0.5 flex-1 rounded-full transition-all ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Card Information */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-20 text-white">
                {/* Name & Age */}
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl font-bold leading-none drop-shadow-lg">
                    {currentProfile.nombre}, {currentProfile.edad}
                  </h2>
                  {currentProfile.verificado && (
                    <span className="material-symbols-outlined text-blue-400 text-[24px] drop-shadow-lg">verified</span>
                  )}
                  {currentProfile.enLinea && (
                    <div className="flex items-center gap-1 ml-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 shadow-lg"></span>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 mb-3 text-white/95">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  <span className="text-sm font-medium drop-shadow">
                    {currentProfile.ciudad} • {formatDistance(currentProfile.distance)}
                  </span>
                </div>

                {/* Interest Chips */}
                {currentProfile.intereses && currentProfile.intereses.length > 0 && (
                  <div className="flex flex-wrap gap-2">
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
                        'Deportes': 'sports_soccer',
                        'Baile': 'music_note',
                        'Playa': 'beach_access'
                      };
                      
                      return (
                        <div 
                          key={index}
                          className="flex items-center px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20"
                        >
                          <span className="material-symbols-outlined text-[16px] mr-1.5">
                            {iconMap[interes] || 'favorite'}
                          </span>
                          <span className="text-xs font-semibold">{interes}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Side Tap Areas */}
              <div 
                className="absolute inset-y-0 left-0 w-1/2 z-10 cursor-pointer" 
                onClick={() => handlePhotoNavigation('prev')}
              />
              <div 
                className="absolute inset-y-0 right-0 w-1/2 z-10 cursor-pointer" 
                onClick={() => handlePhotoNavigation('next')}
              />
            </div>

            {/* Action Buttons */}
            <div className="w-full flex items-center justify-center gap-5 pt-5 shrink-0">
              {/* Pass Button */}
              <button 
                onClick={handlePass}
                className="flex items-center justify-center h-14 w-14 rounded-full bg-white shadow-lg border border-gray-100 hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <span className="material-symbols-outlined text-red-500 text-[28px]">close</span>
              </button>

              {/* Super Like Button */}
              <button 
                onClick={handleSuperLike}
                className="flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-lg border border-gray-100 hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <span className="material-symbols-outlined text-blue-500 text-[24px]">star</span>
              </button>

              {/* Like Button */}
              <button 
                onClick={handleLike}
                className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <span className="material-symbols-outlined text-white text-[28px]">favorite</span>
              </button>
            </div>
          </main>

          {/* Bottom Navigation */}
          <nav className="shrink-0 bg-white border-t border-gray-100 safe-area-bottom">
            <div className="flex justify-around items-center h-16 px-2">
              {/* Home (Active) */}
              <button className="flex flex-col items-center justify-center w-16 gap-0.5 text-pink-500">
                <span className="material-symbols-outlined text-[26px] filled">style</span>
                <span className="h-1 w-1 rounded-full bg-pink-500"></span>
              </button>

              {/* Explore */}
              <button 
                onClick={() => navigate('/ultra-explore')}
                className="flex flex-col items-center justify-center w-16 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[26px]">grid_view</span>
              </button>

              {/* Chats */}
              <button 
                onClick={() => navigate('/ultra-chats')}
                className="flex flex-col items-center justify-center w-16 text-gray-400 hover:text-gray-600 transition-colors relative"
              >
                <span className="material-symbols-outlined text-[26px]">chat_bubble</span>
                <div className="absolute top-0 right-3 h-2 w-2 rounded-full bg-red-500"></div>
              </button>

              {/* Profile */}
              <button 
                onClick={() => navigate('/ultra-profile')}
                className="flex flex-col items-center justify-center w-16 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[26px]">person</span>
              </button>
            </div>
          </nav>

        </div>
      </div>

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
          navigate(`/chat/${[user?.uid, matchUser.id].sort().join('_')}`);
        }}
        onKeepSwiping={() => {
          closeMatchModal();
          nextProfile();
        }}
      />

      {/* Notification Toast */}
      <NotificationToast />
    </>
  );
}
