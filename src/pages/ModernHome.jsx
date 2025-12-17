import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  X, 
  Star, 
  Bell, 
  User, 
  MessageCircle, 
  Settings, 
  Target,
  MapPin,
  Eye,
  ChevronLeft,
  ChevronRight,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { obtenerPerfilesRecomendados } from '../services/perfilesService';
import { crearLike } from '../services/likesService';
import BottomNavigation from '../components/comunes/BottomNavigation';
import MatchModal from '../components/MatchModal';
import { useMatchAnimation, useSoundEffects } from '../hooks/useMatchAnimation';
import { useNotificationToast } from '../components/comunes/NotificationToast';

export default function ModernHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados principales
  const [currentProfile, setCurrentProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notifications] = useState(3);
  const [likesReceived, setLikesReceived] = useState([]);
  
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
        // Datos de prueba si no hay perfiles en Firestore
        recommendedProfiles = [
          {
            id: 'demo1',
            nombre: 'Isabella',
            edad: 25,
            ciudad: 'Santo Domingo',
            fotoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=500&fit=crop&crop=face',
            intereses: ['Música', 'Viajes', 'Fotografía'],
            descripcion: 'Amante de la música y los viajes. Siempre buscando nuevas aventuras.',
            verificado: true
          },
          {
            id: 'demo2',
            nombre: 'Camila',
            edad: 23,
            ciudad: 'Santiago',
            fotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop&crop=face',
            intereses: ['Arte', 'Cocina', 'Yoga'],
            descripcion: 'Artista y chef en mis tiempos libres. Me encanta crear cosas nuevas.',
            verificado: false
          },
          {
            id: 'demo3',
            nombre: 'Valentina',
            edad: 27,
            ciudad: 'Punta Cana',
            fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop&crop=face',
            intereses: ['Playa', 'Deportes', 'Lectura'],
            descripcion: 'Vida saludable y buenas vibras. Siempre lista para una aventura.',
            verificado: true
          }
        ];
      }
      
      setProfiles(recommendedProfiles);
      setCurrentProfile(recommendedProfiles[0]);
      
      // Simular likes recibidos (reemplazar con servicio real)
      setLikesReceived([
        { id: 1, name: 'Ana', photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
        { id: 2, name: 'María', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
        { id: 3, name: 'Sofia', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' }
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
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
      
      // TEMPORAL: Forzar match para pruebas
      const forzarMatch = true;
      
      if (forzarMatch || (resultado.match && resultado.matchedUser)) {
        // ¡Es un match! Mostrar animación
        triggerMatchAnimation(resultado.matchedUser || currentProfile);
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
    if (currentIndex < profiles.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentProfile(profiles[newIndex]);
    } else {
      setCurrentProfile(null);
    }
  };

  // Accesos rápidos
  const quickActions = [
    {
      icon: User,
      label: 'Mi Perfil',
      color: 'bg-purple-500',
      action: () => navigate('/perfil')
    },
    {
      icon: MessageCircle,
      label: 'Mensajes',
      color: 'bg-green-500',
      action: () => navigate('/chats'),
      badge: 2
    },
    {
      icon: Target,
      label: 'Preferencias',
      color: 'bg-blue-500',
      action: () => navigate('/preferencias')
    },
    {
      icon: Heart,
      label: 'Matches',
      color: 'bg-pink-500',
      action: () => navigate('/matches'),
      badge: 5
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Foto de perfil del usuario */}
            <button 
              onClick={() => navigate('/perfil')}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-colors"
            >
              <img
                src={user?.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                alt="Mi perfil"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-200"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">Hola, {user?.displayName || 'Usuario'}</p>
                <p className="text-xs text-gray-500">¡Encuentra tu match!</p>
              </div>
            </button>

            {/* Logo centrado */}
            <div className="flex items-center gap-2">
              <Flame className="text-pink-500" size={28} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                CitaRD
              </h1>
            </div>

            {/* Notificaciones */}
            <button 
              onClick={() => navigate('/matches')}
              className="relative p-2 text-gray-600 hover:text-pink-500 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Bell size={24} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Columna principal - Tarjeta de perfil */}
          <div className="lg:col-span-8">
            {currentProfile ? (
              <div className="space-y-6">
                {/* Indicador de progreso */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Perfil {currentIndex + 1} de {profiles.length}
                  </p>
                  <div className="flex gap-1">
                    {profiles.slice(0, 5).map((_, index) => (
                      <div
                        key={index}
                        className={`w-8 h-1 rounded-full ${
                          index <= currentIndex ? 'bg-pink-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Tarjeta principal del perfil */}
                <motion.div
                  key={currentProfile.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative bg-white rounded-3xl shadow-xl overflow-hidden"
                >
                  {/* Imagen principal */}
                  <div className="relative h-96 lg:h-[500px]">
                    <img
                      src={currentProfile.fotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=face'}
                      alt={currentProfile.nombre}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Gradiente overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Información del perfil */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-3xl font-bold">
                          {currentProfile.nombre}, {currentProfile.edad}
                        </h2>
                        {currentProfile.verificado && (
                          <div className="bg-blue-500 rounded-full p-1">
                            <Star className="text-white" size={16} />
                          </div>
                        )}
                      </div>
                      
                      {currentProfile.ciudad && (
                        <div className="flex items-center gap-1 mb-3">
                          <MapPin size={16} />
                          <span className="text-white/90">{currentProfile.ciudad}</span>
                        </div>
                      )}

                      {/* Intereses */}
                      {currentProfile.intereses && currentProfile.intereses.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
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

                      {/* Botón ver perfil completo */}
                      <button
                        onClick={() => navigate(`/perfil/${currentProfile.id}`)}
                        className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                      >
                        <Eye size={16} />
                        Ver perfil completo
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Botones de acción */}
                <div className="flex items-center justify-center gap-4 py-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePass}
                    className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-red-500 hover:shadow-xl transition-all duration-300"
                  >
                    <X size={24} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSuperLike}
                    className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-500 hover:shadow-xl transition-all duration-300"
                  >
                    <Star size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLike}
                    className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300"
                  >
                    <Heart size={28} />
                  </motion.button>
                </div>
              </div>
            ) : (
              /* No hay más perfiles */
              <div className="text-center py-12">
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
                  onClick={loadInitialData}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Buscar más perfiles
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Accesos rápidos y likes recibidos */}
          <div className="lg:col-span-4 mt-8 lg:mt-0 space-y-6">
            {/* Accesos rápidos */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Accesos rápidos</h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                    className={`relative p-4 rounded-xl text-white text-center transition-all duration-300 hover:shadow-lg ${action.color}`}
                  >
                    <action.icon size={24} className="mx-auto mb-2" />
                    <p className="text-sm font-medium">{action.label}</p>
                    {action.badge && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {action.badge}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Likes recibidos */}
            {likesReceived.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Te dieron like</h3>
                  <button 
                    onClick={() => navigate('/matches')}
                    className="text-pink-500 text-sm font-medium hover:text-pink-600"
                  >
                    Ver todos
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {likesReceived.map((like) => (
                    <motion.button
                      key={like.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate('/matches')}
                      className="flex-shrink-0 text-center"
                    >
                      <div className="relative">
                        <img
                          src={like.photo}
                          alt={like.name}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-pink-200"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-1">
                          <Heart className="text-white" size={12} />
                        </div>
                      </div>
                      <p className="text-xs font-medium text-gray-900 mt-2">{like.name}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
          // Navegar al chat
          navigate(`/chat/${[user.uid, matchUser.id].sort().join('_')}`);
        }}
        onKeepSwiping={() => {
          closeMatchModal();
          nextProfile();
        }}
      />

      {/* Notification Toast */}
      <NotificationToast />

      {/* Bottom Navigation - Solo en móvil */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
}