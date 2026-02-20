
import React, { useState, useEffect, lazy, Suspense } from 'react';
import Layout from './components/components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineBanner from './components/OfflineBanner';
import { useOfflineDetection } from './hooks/useOfflineDetection';

// Code Splitting: Lazy load de vistas para reducir bundle inicial
// Esto reduce el bundle de ~1.3MB a ~400KB (-70%)
const Landing = lazy(() => import('./views/views/Landing'));
const Home = lazy(() => import('./views/views/Home'));
const Discovery = lazy(() => import('./views/views/Discovery'));
const Messages = lazy(() => import('./views/views/Messages'));
const Matches = lazy(() => import('./views/views/Matches'));
const AICoach = lazy(() => import('./views/views/AICoach'));
const ProfileView = lazy(() => import('./views/views/Profile'));
const ChatView = lazy(() => import('./views/views/ChatView'));
const LikesReceived = lazy(() => import('./views/views/LikesReceived'));
const AdminPanel = lazy(() => import('./views/views/AdminPanel'));
const StoriesViewer = lazy(() => import('./components/StoriesViewer'));
const CreateStoryModal = lazy(() => import('./components/CreateStoryModal'));
import { UserProfile, Message } from './types';

// Extender el tipo View para incluir 'admin'
type View = 'home' | 'discovery' | 'messages' | 'matches' | 'ai-coach' | 'profile' | 'likes-received' | 'chat' | 'admin';
import { getUserChats, sendMessage, listenToMessages, findOrCreateChat, Chat } from './services/chatService';
import { getDiscoveryProfiles, createOrUpdateProfile, getUserProfile } from './services/profileService';
import { privacyService } from './services/privacyService';
import { LanguageProvider } from './contexts/LanguageContext';
import { StoryGroup } from './services/storiesService';
import { auth, db } from './services/firebase';
import { doc, getDoc, setDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { setUserOnline, setUserOffline } from './services/presenceService';
import { logger } from './utils/logger';
import NotificationPermissionPrompt from './components/NotificationPermissionPrompt';
import { analyticsService } from './services/analyticsService';
import { errorTrackingService } from './services/errorTrackingService';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

const INITIAL_POTENTIAL_MATCHES: UserProfile[] = [];

// Helper function para obtener perfil completo desde Firestore
const getUserProfileFromFirestore = async (userId: string): Promise<Partial<UserProfile> | null> => {
  try {
    const perfilDoc = await getDoc(doc(db, 'perfiles', userId));
    if (perfilDoc.exists()) {
      const data = perfilDoc.data();
      return {
        id: userId,
        name: data.name || data.nombre || data.displayName || `Usuario ${userId.substring(0, 6)}`,
        age: data.age || data.edad || 25,
        bio: data.bio || data.biografia || '',
        location: data.location || data.ubicacion || '',
        images: data.images || data.fotos || [],
        interests: data.interests || data.intereses || []
      };
    }
  } catch (error) {
    logger.profile.error('Error obteniendo perfil de usuario', { userId, error });
  }
  return null;
};

// Inicializar Analytics y Error Tracking FUERA del componente para evitar doble inicialización
// Version: 17feb2026-v4 - Force new build hash
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_MEASUREMENT_ID && !analyticsService.isInitialized) {
  analyticsService.initialize(GA_MEASUREMENT_ID);
  errorTrackingService.initialize();
  logger.analytics.info('Analytics and Error Tracking initialized');
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [discoveryRefreshTrigger, setDiscoveryRefreshTrigger] = useState(0); // ⚡ NUEVO: Trigger para recargar Discovery
  
  // Offline detection
  const isOnline = useOfflineDetection();

  const [potentialMatches, setPotentialMatches] = useState<UserProfile[]>(INITIAL_POTENTIAL_MATCHES);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>({});
  
  // Cache de perfiles de usuarios obtenidos de Firestore
  const [userProfilesCache, setUserProfilesCache] = useState<Record<string, Partial<UserProfile>>>({});
  
  // Estados para Stories
  const [showStoriesViewer, setShowStoriesViewer] = useState(false);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState<StoryGroup | null>(null);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
  const [storiesRefreshKey, setStoriesRefreshKey] = useState(0);
  
  // Estado para mostrar prompt de notificaciones
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  // Cargar perfil del usuario autenticado
  useEffect(() => {
    logger.auth.info('🚀 [INIT] Configurando onAuthStateChanged listener');
    
    // ⚡ FIX: Usar onAuthStateChanged para detectar cambios de autenticación
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      logger.auth.info('🔔 [AUTH] onAuthStateChanged triggered', { 
        hasUser: !!user, 
        userId: user?.uid,
        email: user?.email 
      });
      
      if (!user) {
        logger.auth.warn('❌ [AUTH] No authenticated user, showing login');
        setLoading(false);
        setCurrentUser(null);
        return;
      }

      logger.auth.success('✅ [AUTH] User authenticated, loading profile', { userId: user.uid });

      try {
        logger.profile.info('📡 [AUTH] Calling getUserProfile...', { userId: user.uid });
        const profile = await getUserProfile(user.uid);
        logger.profile.info('📦 [AUTH] getUserProfile returned', { 
          hasProfile: !!profile,
          profileId: profile?.id,
          profileName: profile?.name
        });
        
        if (profile) {
          logger.profile.success('✅ [AUTH] Setting currentUser state', { 
            userId: profile.id,
            name: profile.name
          });
          setCurrentUser(profile);
          
          // Set user ID in analytics
          analyticsService.setUserId(user.uid);
          
          // Verificar si el perfil está incompleto y redirigir a Profile
          const isIncomplete = !profile.images || profile.images.length === 0 || 
                               !profile.bio || profile.bio.trim() === '' ||
                               !profile.location || profile.location.trim() === '';
          
          if (isIncomplete) {
            logger.profile.warn('⚠️ [AUTH] Incomplete profile detected, redirecting to Profile', { userId: user.uid });
            setActiveView('profile');
          } else {
            logger.profile.success('✅ [AUTH] Profile complete, ready to use app');
            // Perfil completo - mostrar prompt de notificaciones después de 3 segundos
            setTimeout(() => {
              setShowNotificationPrompt(true);
            }, 3000);
          }
        } else {
          logger.profile.warn('⚠️ [AUTH] No profile found, creating basic profile');
          // Crear perfil básico si no existe
          const basicProfile: UserProfile = {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Usuario',
            age: 18,
            bio: '',
            location: '',
            images: [],
            interests: [],
            isVerified: false
          };
          setCurrentUser(basicProfile);
          // Guardar perfil básico en Firebase
          await createOrUpdateProfile(user.uid, basicProfile);
          // Redirigir a Profile para completar
          setActiveView('profile');
        }
      } catch (error) {
        logger.profile.error('❌ [AUTH] Error cargando perfil', error);
        // Mostrar mensaje al usuario
        alert('Error al cargar tu perfil. Por favor recarga la página.');
      } finally {
        logger.auth.info('🏁 [AUTH] Setting loading to false');
        setLoading(false);
      }
    });

    // Cleanup: cancelar listener al desmontar
    return () => {
      logger.auth.info('🧹 [AUTH] Cleaning up onAuthStateChanged listener');
      unsubscribe();
    };
  }, []);

  // Setup presence system when user is loaded
  useEffect(() => {
    if (!currentUser) return;
    
    logger.auth.info('Setting up presence system', { userId: currentUser.id });
    
    // Set user online immediately
    setUserOnline(currentUser.id);
    
    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setUserOffline(currentUser.id);
      } else {
        setUserOnline(currentUser.id);
      }
    };
    
    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      logger.auth.info('Cleaning up presence system', { userId: currentUser.id });
      // IMPORTANTE: Solo limpiar listeners, NO actualizar Firestore
      // El logout ya maneja setUserOffline() ANTES de cerrar sesión
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentUser]);

  // Cargar chats del usuario en tiempo real
  useEffect(() => {
    if (!currentUser) return;
    
    const unsubscribe = getUserChats(currentUser.id, (userChats) => {
      setChats(userChats);
      
      // Cargar perfiles completos de usuarios de los chats
      userChats.forEach(async (chat) => {
        const otherUserId = chat.participants.find(p => p !== currentUser.id);
        if (otherUserId && !userProfilesCache[otherUserId]) {
          const userProfile = await getUserProfileFromFirestore(otherUserId);
          if (userProfile) {
            setUserProfilesCache(prev => ({ ...prev, [otherUserId]: userProfile }));
          }
        }
      });
    });

    return () => {
      // Cancelar listener inmediatamente para evitar errores de permisos después del logout
      if (unsubscribe && typeof unsubscribe === 'function') {
        try {
          unsubscribe();
        } catch (error) {
          // Ignorar errores al cancelar listeners después del logout
          logger.firebase.debug('Listener cleanup after logout (expected)');
        }
      }
    };
  }, [currentUser]);

  // Cargar perfiles para Discovery
  // ⚡ FIX: Separar en dos useEffects para asegurar que se ejecute al montar
  useEffect(() => {
    if (!currentUser) {
      logger.profile.warn('⚠️ currentUser es null, no se cargan perfiles');
      return;
    }

    logger.profile.info('🚀 [MOUNT] Iniciando carga inicial de perfiles para Discovery', { 
      userId: currentUser.id
    });

    let unsubscribe: (() => void) | undefined;

    const setupDiscoveryListener = async () => {
      try {
        logger.profile.info('📡 [MOUNT] Llamando a getDiscoveryProfiles...', { userId: currentUser.id });
        
        unsubscribe = await getDiscoveryProfiles(currentUser.id, (profiles) => {
          logger.profile.success('✅ [MOUNT] Callback de perfiles ejecutado', { 
            profileCount: profiles.length,
            profiles: profiles.map(p => ({ id: p.id, name: p.name }))
          });
          
          if (profiles.length > 0) {
            setPotentialMatches(profiles);
            logger.profile.success('✅ [MOUNT] setPotentialMatches ejecutado', { count: profiles.length });
          } else {
            logger.profile.warn('⚠️ [MOUNT] No hay perfiles disponibles');
            setPotentialMatches([]);
          }
        });
        
        logger.profile.info('✅ [MOUNT] getDiscoveryProfiles completado');
      } catch (error) {
        logger.firebase.error('❌ [MOUNT] Error setting up discovery listener', error);
      }
    };

    setupDiscoveryListener();

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        try {
          unsubscribe();
        } catch (error) {
          logger.firebase.debug('Listener cleanup after logout (expected)');
        }
      }
    };
  }, [currentUser?.id]); // ⚡ Solo depende del ID, se ejecuta cuando currentUser se carga

  // ⚡ FIX: useEffect separado para recargas manuales (trigger)
  useEffect(() => {
    // Solo ejecutar si hay trigger Y currentUser ya está cargado
    if (discoveryRefreshTrigger === 0 || !currentUser) {
      return;
    }

    logger.profile.info('🔄 [TRIGGER] Recargando perfiles por navegación a Discovery', { 
      userId: currentUser.id,
      trigger: discoveryRefreshTrigger 
    });

    let unsubscribe: (() => void) | undefined;

    const reloadProfiles = async () => {
      try {
        logger.profile.info('📡 [TRIGGER] Llamando a getDiscoveryProfiles...', { userId: currentUser.id });
        
        unsubscribe = await getDiscoveryProfiles(currentUser.id, (profiles) => {
          logger.profile.success('✅ [TRIGGER] Callback de perfiles ejecutado', { 
            profileCount: profiles.length
          });
          
          if (profiles.length > 0) {
            setPotentialMatches(profiles);
            logger.profile.success('✅ [TRIGGER] setPotentialMatches ejecutado', { count: profiles.length });
          } else {
            logger.profile.warn('⚠️ [TRIGGER] No hay perfiles disponibles');
            setPotentialMatches([]);
          }
        });
        
        logger.profile.info('✅ [TRIGGER] getDiscoveryProfiles completado');
      } catch (error) {
        logger.firebase.error('❌ [TRIGGER] Error reloading profiles', error);
      }
    };

    reloadProfiles();

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        try {
          unsubscribe();
        } catch (error) {
          logger.firebase.debug('Listener cleanup after logout (expected)');
        }
      }
    };
  }, [discoveryRefreshTrigger]); // ⚡ Solo depende del trigger, no de currentUser

  // Escuchar mensajes del chat seleccionado
  useEffect(() => {
    if (!selectedChatId) return;

    const unsubscribe = listenToMessages(selectedChatId, (messages) => {
      setChatMessages(prev => ({ ...prev, [selectedChatId]: messages }));
    });

    return () => {
      // Cancelar listener inmediatamente para evitar errores de permisos después del logout
      if (unsubscribe && typeof unsubscribe === 'function') {
        try {
          unsubscribe();
        } catch (error) {
          // Ignorar errores al cancelar listeners después del logout
          logger.firebase.debug('Listener cleanup after logout (expected)');
        }
      }
    };
  }, [selectedChatId]);

  // Crear perfil del usuario actual si no existe
  useEffect(() => {
    if (!currentUser) return;
    
    createOrUpdateProfile(currentUser.id, currentUser);
  }, [currentUser]);

  const handleLike = async (user: UserProfile) => {
    if (!currentUser) return false;
    
    try {
      const db = getFirestore();
      
      // 1. Guardar el like del usuario actual
      const likeRef = doc(db, 'likes', `${currentUser.id}_${user.id}`);
      await setDoc(likeRef, {
        fromUserId: currentUser.id,
        toUserId: user.id,
        timestamp: Date.now(),
        createdAt: serverTimestamp()
      });
      
      logger.match.info('Like guardado', { from: currentUser.id, to: user.id });
      
      // 2. Verificar si el otro usuario ya dio like (match mutuo)
      const reverseLikeRef = doc(db, 'likes', `${user.id}_${currentUser.id}`);
      const reverseLikeSnap = await getDoc(reverseLikeRef);
      
      if (reverseLikeSnap.exists()) {
        // ¡ES UN MATCH! Ambos se dieron like
        logger.match.success('¡MATCH MUTUO!', { user1: currentUser.id, user2: user.id });
        
        // Crear o encontrar chat existente
        const chatId = await findOrCreateChat(currentUser.id, user.id);
        
        // Crear documento de match en Firestore
        const matchRef = doc(db, 'matches', chatId);
        await setDoc(matchRef, {
          users: [currentUser.id, user.id],
          timestamp: Date.now(),
          createdAt: serverTimestamp(),
          chatId: chatId
        });
        
        logger.match.success('Match creado en Firestore', { matchId: chatId });
        
        return true; // Hay match
      } else {
        // No hay match todavía, solo se guardó el like
        logger.match.info('Like guardado, esperando reciprocidad', { from: currentUser.id, to: user.id });
        return false; // No hay match
      }
    } catch (error) {
      logger.match.error('Error procesando like', error);
      return false;
    }
  };

  const handleSendMessage = async (
    chatId: string, 
    text?: string, 
    type: Message['type'] = 'text', 
    content?: string, 
    duration?: number
  ) => {
    if (!currentUser) return;
    
    try {
      await sendMessage(chatId, currentUser.id, text, type, content, duration);
      logger.chat.success('Message sent successfully', { chatId, type });
    } catch (error) {
      logger.chat.error('Error sending message', error);
      // Mostrar mensaje al usuario
      alert('Error al enviar mensaje. Por favor intenta de nuevo.');
    }
  };

  const handleSendStoryMessage = async (
    userId: string, 
    message: string, 
    type: 'text' | 'story_reaction' = 'text'
  ) => {
    try {
      if (!userId || !message || !currentUser!.id) {
        throw new Error('Parámetros inválidos');
      }
      
      // Buscar o crear chat con el usuario
      const chatId = await findOrCreateChat(currentUser!.id, userId);
      
      // Enviar mensaje
      await sendMessage(chatId, currentUser!.id, message, type);
      
      logger.chat.success('Story message sent successfully', { userId, type });
    } catch (error) {
      logger.chat.error('Error enviando mensaje de story', error);
      alert('Error al enviar mensaje. Por favor intenta de nuevo.');
    }
  };

  // Funciones para Stories
  const handleStoryClick = (storyGroup: StoryGroup) => {
    setSelectedStoryGroup(storyGroup);
    setShowStoriesViewer(true);
  };

  const handleCreateStory = () => {
    setShowCreateStoryModal(true);
  };

  const handleCloseStoriesViewer = () => {
    setShowStoriesViewer(false);
    setSelectedStoryGroup(null);
  };

  // Loading fallback para Suspense
  const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Cargando...</p>
      </div>
    </div>
  );

  const renderView = () => {
    // En este punto, currentUser ya fue verificado como no-null
    const user = currentUser!;
    
    switch (activeView) {
      case 'home':
        // Convertir chats reales a UserProfile[] para recentMatches
        const recentMatchesFromChats = chats.slice(0, 3).map(chat => {
          const otherUserId = chat.participants.find(p => p !== user.id) || '';
          // Buscar en potentialMatches o en cache
          let matchUser = potentialMatches.find(u => u.id === otherUserId);
          
          if (!matchUser) {
            // Usar perfil del cache o crear perfil básico
            const cachedProfile = userProfilesCache[otherUserId];
            matchUser = {
              id: otherUserId,
              name: cachedProfile?.name || `Usuario ${otherUserId.substring(0, 6)}`,
              age: cachedProfile?.age || 25,
              bio: cachedProfile?.bio || '',
              location: cachedProfile?.location || '',
              images: cachedProfile?.images || [],
              interests: cachedProfile?.interests || []
            };
          }
          
          return matchUser;
        });
        
        return (
          <ErrorBoundary level="section">
            <Home 
              currentUser={user}
              recentMatches={recentMatchesFromChats}
              onNavigateToDiscovery={() => setActiveView('discovery')}
              onNavigateToMessages={() => setActiveView('messages')}
              onNavigateToProfile={() => setActiveView('profile')}
              onNavigateToLikesReceived={() => setActiveView('likes-received')}
              availableProfilesCount={potentialMatches.length}
            />
          </ErrorBoundary>
        );
      case 'discovery':
        return (
          <ErrorBoundary level="section">
            <Discovery 
              users={potentialMatches} 
              currentUserId={currentUser!.id}
              onLike={handleLike} 
              onSendMessage={handleSendStoryMessage}
              onAction={(id) => {
                // No remover usuarios, solo hacer log
                // setPotentialMatches(p => p.filter(u => u.id !== id)) // REMOVIDO
              }}
              onOpenChat={(userId) => {
                // Buscar el chat existente para este usuario
                const existingChat = chats.find(chat => 
                  chat.participants.includes(userId) && chat.participants.includes(currentUser!.id)
                );
                
                if (existingChat) {
                  setSelectedChatId(existingChat.id);
                  setActiveView('chat');
                } else {
                  // Ir a la vista de mensajes como fallback
                  setActiveView('messages');
                }
              }}
            />
          </ErrorBoundary>
        );
      case 'messages':
        return (
          <ErrorBoundary level="section">
            <Messages 
              currentUserId={currentUser!.id}
              matches={chats.map(chat => {
                // Encontrar el ID del otro usuario
                const otherUserId = chat.participants.find(p => p !== currentUser!.id) || '';
                
                // Buscar el usuario en potentialMatches o en cache
                let otherUser = potentialMatches.find(u => u.id === otherUserId);
                
                // Si no se encuentra, usar perfil del cache o crear básico
                if (!otherUser) {
                  const cachedProfile = userProfilesCache[otherUserId];
                  otherUser = {
                    id: otherUserId,
                    name: cachedProfile?.name || `Usuario ${otherUserId.substring(0, 6)}`,
                    age: cachedProfile?.age || 25,
                    bio: cachedProfile?.bio || '',
                    location: cachedProfile?.location || '',
                    images: cachedProfile?.images || ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'],
                    interests: cachedProfile?.interests || []
                  };
                }
                
                return {
                  id: chat.id,
                  user: otherUser,
                  lastMessage: chat.lastMessage || 'Nuevo match',
                  timestamp: chat.timestamp || Date.now()
                };
              })} 
              onSelectMatch={(match) => { 
                setSelectedChatId(match.id); 
                setActiveView('chat'); 
              }} 
            />
          </ErrorBoundary>
        );
      case 'matches':
        return (
          <ErrorBoundary level="section">
            <Matches 
              matches={chats.map(chat => {
                // Encontrar el ID del otro usuario
                const otherUserId = chat.participants.find(p => p !== currentUser!.id) || '';
                
                // Buscar el usuario en potentialMatches o en cache
                let otherUser = potentialMatches.find(u => u.id === otherUserId);
                
                // Si no se encuentra, usar perfil del cache o crear básico
                if (!otherUser) {
                  const cachedProfile = userProfilesCache[otherUserId];
                  otherUser = {
                    id: otherUserId,
                    name: cachedProfile?.name || `Usuario ${otherUserId.substring(0, 6)}`,
                    age: cachedProfile?.age || 25,
                    bio: cachedProfile?.bio || '',
                    location: cachedProfile?.location || '',
                    images: cachedProfile?.images || ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'],
                    interests: cachedProfile?.interests || []
                  };
                }
                
                return {
                  id: chat.id,
                  user: otherUser,
                  lastMessage: chat.lastMessage || 'Nuevo match',
                  timestamp: chat.timestamp || Date.now()
                };
              })} 
              onSelectMatch={(match) => { 
                setSelectedChatId(match.id); 
                setActiveView('chat'); 
              }}
              currentUserId={currentUser!.id}
            />
          </ErrorBoundary>
        );
      case 'ai-coach':
        return (
          <ErrorBoundary level="section">
            <AICoach profile={user} />
          </ErrorBoundary>
        );
      case 'profile':
        return (
          <ErrorBoundary level="section">
            <ProfileView 
              user={user} 
              onUpdate={setCurrentUser}
              onNavigateToAdmin={() => setActiveView('admin')}
            />
          </ErrorBoundary>
        );
      case 'likes-received':
        return (
          <ErrorBoundary level="section">
            <LikesReceived
              currentUserId={user.id}
              onLike={handleLike}
              onPass={(userId) => {
                logger.match.info('Usuario pasado desde likes recibidos', { userId });
              }}
              onBack={() => setActiveView('home')}
            />
          </ErrorBoundary>
        );
      case 'chat':
        const currentChat = chats.find(c => c.id === selectedChatId);
        if (!currentChat) return null;
        
        // Encontrar el ID del otro usuario
        const otherUserId = currentChat.participants.find(p => p !== currentUser!.id) || '';
        
        // Buscar el usuario en potentialMatches o en cache
        let otherUser = potentialMatches.find(u => u.id === otherUserId);
        
        // Si no se encuentra, usar perfil del cache o crear básico
        if (!otherUser) {
          const cachedProfile = userProfilesCache[otherUserId];
          otherUser = {
            id: otherUserId,
            name: cachedProfile?.name || `Usuario ${otherUserId.substring(0, 6)}`,
            age: cachedProfile?.age || 25,
            bio: cachedProfile?.bio || '',
            location: cachedProfile?.location || '',
            images: cachedProfile?.images || ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'],
            interests: cachedProfile?.interests || []
          };
        }
        
        return (
          <ErrorBoundary level="section">
            <ChatView 
              match={{
                id: currentChat.id,
                user: otherUser,
                lastMessage: currentChat.lastMessage,
                timestamp: currentChat.timestamp
              }}
              messages={chatMessages[currentChat.id] || []} 
              onSendMessage={(text, type, content, duration) => 
                handleSendMessage(currentChat.id, text, type, content, duration)
              } 
              onBack={() => setActiveView('messages')} 
              currentUserId={currentUser!.id}
              chatId={currentChat.id}
            />
          </ErrorBoundary>
        );
      case 'admin':
        return (
          <ErrorBoundary level="section">
            <AdminPanel />
          </ErrorBoundary>
        );
      default:
        return null;
    }
  };

  // ⚡ FIX CRÍTICO: Mostrar loading mientras se carga el perfil
  // NO renderizar la app hasta que currentUser esté completamente cargado
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  // ⚡ FIX CRÍTICO: Si no hay usuario autenticado, mostrar Landing Page
  if (!currentUser) {
    return (
      <ErrorBoundary level="app">
        <Suspense fallback={<LoadingFallback />}>
          <Landing onGetStarted={() => window.location.reload()} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary level="app">
      <LanguageProvider>
        <Suspense fallback={<LoadingFallback />}>
          {/* Offline Banner */}
          <OfflineBanner 
            isOnline={isOnline} 
            onRetry={() => window.location.reload()} 
          />
          
          <Layout 
            activeView={activeView === 'chat' ? 'messages' : activeView === 'admin' ? 'profile' : activeView} 
            onViewChange={(view) => {
              // Verificar si el perfil está incompleto
              const isIncomplete = !currentUser.images || currentUser.images.length === 0 || 
                                   !currentUser.bio || currentUser.bio.trim() === '' ||
                                   !currentUser.location || currentUser.location.trim() === '';
              
              // Si el perfil está incompleto y el usuario intenta navegar fuera de Profile, mostrar alerta
              if (isIncomplete && view !== 'profile') {
                alert('⚠️ Por favor completa tu perfil antes de explorar la app.\n\n📸 Sube al menos una foto\n✍️ Escribe una bio\n📍 Selecciona tu provincia');
                return;
              }
              
              // ⚡ NUEVO: Si navega a Discovery, forzar recarga de perfiles
              if (view === 'discovery') {
                logger.profile.info('🔄 Navegando a Discovery, forzando recarga de perfiles');
                setDiscoveryRefreshTrigger(prev => prev + 1);
              }
              
              setActiveView(view);
            }}
            chats={chats}
            currentUserId={currentUser!.id}
            onStoryClick={handleStoryClick}
            onCreateStory={handleCreateStory}
            storiesRefreshKey={storiesRefreshKey}
          >
            {renderView()}
          </Layout>
          
          {/* Notification Permission Prompt */}
          {showNotificationPrompt && (
            <NotificationPermissionPrompt
              userId={currentUser!.id}
              onPermissionGranted={() => {
                logger.notification.success('User granted notification permission');
                setShowNotificationPrompt(false);
              }}
              onPermissionDenied={() => {
                logger.notification.info('User denied notification permission');
                setShowNotificationPrompt(false);
              }}
            />
          )}
          
          {/* Stories Viewer - Lazy loaded */}
          {showStoriesViewer && (
            <Suspense fallback={null}>
              <StoriesViewer
                isOpen={showStoriesViewer}
                storyGroup={selectedStoryGroup}
                currentUserId={currentUser!.id}
                onClose={handleCloseStoriesViewer}
                onSendMessage={handleSendStoryMessage}
              />
            </Suspense>
          )}
          
          {/* Create Story Modal - Lazy loaded */}
          {showCreateStoryModal && (
            <Suspense fallback={null}>
              <CreateStoryModal
                isOpen={showCreateStoryModal}
                currentUserId={currentUser!.id}
                onClose={() => setShowCreateStoryModal(false)}
                onStoryCreated={() => {
                  setShowCreateStoryModal(false);
                  // Forzar recarga de stories incrementando la key
                  setStoriesRefreshKey(prev => prev + 1);
                }}
                userProfile={{
                  name: currentUser!.name,
                  avatar: currentUser!.images?.[0] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
                }}
              />
            </Suspense>
          )}
          
          {/* Analytics Dashboard (Dev Only) */}
          <AnalyticsDashboard />
        </Suspense>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;

