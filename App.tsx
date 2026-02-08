
import React, { useState, useEffect } from 'react';
import Layout from './components/components/Layout';
import Home from './views/views/Home';
import Discovery from './views/views/Discovery';
import Messages from './views/views/Messages';
import Matches from './views/views/Matches';
import AICoach from './views/views/AICoach';
import ProfileView from './views/views/Profile';
import ChatView from './views/views/ChatView';
import ErrorBoundary from './components/ErrorBoundary';
import StoriesViewer from './components/StoriesViewer';
import CreateStoryModal from './components/CreateStoryModal';
import { View, UserProfile, Message } from './types';
import { getUserChats, sendMessage, listenToMessages, findOrCreateChat, Chat } from './services/chatService';
import { getDiscoveryProfiles, createOrUpdateProfile, getUserProfile } from './services/profileService';
import { privacyService } from './services/privacyService';
import { LanguageProvider } from './contexts/LanguageContext';
import { StoryGroup } from './services/storiesService';
import { auth, db } from './services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { setUserOnline, setUserOffline } from './services/presenceService';
import { logger } from './utils/logger';
import NotificationPermissionPrompt from './components/NotificationPermissionPrompt';

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

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
    const loadUserProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);
        
        if (profile) {
          setCurrentUser(profile);
          
          // Verificar si el perfil está incompleto y redirigir a Profile
          const isIncomplete = !profile.images || profile.images.length === 0 || 
                               !profile.bio || profile.bio.trim() === '' ||
                               !profile.location || profile.location.trim() === '';
          
          if (isIncomplete) {
            logger.profile.info('Incomplete profile detected, redirecting to Profile', { userId: user.uid });
            setActiveView('profile');
          } else {
            // Perfil completo - mostrar prompt de notificaciones después de 3 segundos
            setTimeout(() => {
              setShowNotificationPrompt(true);
            }, 3000);
          }
        } else {
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
        logger.profile.error('Error cargando perfil', error);
        // Mostrar mensaje al usuario
        alert('Error al cargar tu perfil. Por favor recarga la página.');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
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
  useEffect(() => {
    if (!currentUser) return;

    let unsubscribe: (() => void) | undefined;

    const setupDiscoveryListener = async () => {
      try {
        unsubscribe = await getDiscoveryProfiles(currentUser.id, (profiles) => {
          if (profiles.length > 0) {
            setPotentialMatches(profiles);
          }
          // Si no hay perfiles en Firebase, usar los mock
        });
      } catch (error) {
        logger.firebase.error('Error setting up discovery listener', error);
      }
    };

    setupDiscoveryListener();

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
      // 100% chance of match for testing purposes
      if (Math.random() > 0.0) {
        // Crear o encontrar chat existente
        const chatId = await findOrCreateChat(currentUser.id, user.id);
        
        // Enviar mensaje inicial
        await sendMessage(chatId, currentUser.id, '¡Hola! Me gustó tu perfil 😊');
        
        logger.match.success('Match created successfully', { userId: user.id });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      logger.match.error('Error creating match', error);
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
          <Home 
            currentUser={user}
            recentMatches={recentMatchesFromChats}
            onNavigateToDiscovery={() => setActiveView('discovery')}
            onNavigateToMessages={() => setActiveView('messages')}
            onNavigateToProfile={() => setActiveView('profile')}
            availableProfilesCount={potentialMatches.length}
          />
        );
      case 'discovery':
        return (
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
        );
      case 'messages':
        return (
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
        );
      case 'matches':
        return (
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
        );
      case 'ai-coach':
        return <AICoach profile={user} />;
      case 'profile':
        return <ProfileView user={user} onUpdate={setCurrentUser} />;
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
        );
      default:
        return null;
    }
  };

  // Mostrar loading mientras se carga el perfil
  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Layout 
          activeView={activeView === 'chat' ? 'messages' : activeView} 
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
        
        {/* Stories Viewer */}
        <StoriesViewer
          isOpen={showStoriesViewer}
          storyGroup={selectedStoryGroup}
          currentUserId={currentUser!.id}
          onClose={handleCloseStoriesViewer}
          onSendMessage={handleSendStoryMessage}
        />
        
        {/* Create Story Modal */}
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
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;

