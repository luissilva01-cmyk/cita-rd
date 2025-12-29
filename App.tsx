
import React, { useState, useEffect } from 'react';
import Layout from './components/components/Layout';
import Discovery from './views/views/Discovery';
import Messages from './views/views/Messages';
import AICoach from './views/views/AICoach';
import ProfileView from './views/views/Profile';
import ChatView from './views/views/ChatView';
import { View, UserProfile, Message } from './types';
import { getUserChats, sendMessage, listenToMessages, findOrCreateChat, Chat } from './services/chatService';
import { getDiscoveryProfiles, createOrUpdateProfile } from './services/profileService';
import { privacyService } from './services/privacyService';
import { LanguageProvider } from './contexts/LanguageContext';

// Mock user ID - En producción esto vendría de la autenticación
const CURRENT_USER_ID = 'KU5ZalR92QcPV7RGbLFTjEjTXZm2'; // Tu ID de usuario real

const INITIAL_POTENTIAL_MATCHES: UserProfile[] = [
  {
    id: '1',
    name: 'Carolina',
    age: 24,
    bio: 'Amo el mofongo y bailar bachata en la Zona Colonial. Busco a alguien para ir de aventura a Samaná.',
    location: 'Santo Domingo',
    distance: '3km',
    images: ['https://randomuser.me/api/portraits/women/1.jpg'],
    interests: ['Bachata', 'Playa', 'Gastronomía'],
    job: 'Arquitecta',
    isVerified: true
  },
  {
    id: '2',
    name: 'Marcos',
    age: 27,
    bio: 'Fanático de las Águilas Cibaeñas. Si no estamos viendo pelota, estamos en la playa.',
    location: 'Santiago',
    distance: '15km',
    images: ['https://randomuser.me/api/portraits/men/2.jpg'],
    interests: ['Béisbol', 'Tecnología', 'Café'],
    job: 'Desarrollador',
    isVerified: true
  },
  {
    id: '3',
    name: 'Isabella',
    age: 26,
    bio: 'Doctora apasionada por ayudar a otros. Me encanta la salsa y los atardeceres en el Malecón.',
    location: 'Santo Domingo',
    distance: '5km',
    images: ['https://randomuser.me/api/portraits/women/3.jpg'],
    interests: ['Medicina', 'Salsa', 'Fotografía'],
    job: 'Doctora',
    isVerified: true
  },
  {
    id: '4',
    name: 'Rafael',
    age: 29,
    bio: 'Chef profesional. Si quieres probar el mejor mangú de la ciudad, ya sabes a quién llamar.',
    location: 'Santiago',
    distance: '12km',
    images: ['https://randomuser.me/api/portraits/men/4.jpg'],
    interests: ['Cocina', 'Música', 'Viajes'],
    job: 'Chef',
    isVerified: false
  },
  {
    id: '5',
    name: 'Sofía',
    age: 23,
    bio: 'Estudiante de arte. Me encanta pintar y explorar galerías en la Zona Colonial.',
    location: 'Santo Domingo',
    distance: '2km',
    images: ['https://randomuser.me/api/portraits/women/5.jpg'],
    interests: ['Arte', 'Pintura', 'Cultura'],
    job: 'Estudiante',
    isVerified: false
  },
  {
    id: '6',
    name: 'Diego',
    age: 30,
    bio: 'Ingeniero y surfista. Los fines de semana me encuentras en las playas de Cabarete.',
    location: 'Puerto Plata',
    distance: '25km',
    images: ['https://randomuser.me/api/portraits/men/6.jpg'],
    interests: ['Surf', 'Ingeniería', 'Aventura'],
    job: 'Ingeniero',
    isVerified: true
  }
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('discovery');
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: CURRENT_USER_ID,
    name: 'Juan Pérez',
    age: 26,
    bio: 'Me gusta el merengue y salir con amigos a comer.',
    location: 'Santo Domingo, RD',
    images: ['https://picsum.photos/seed/user/200/200'],
    interests: ['Playa', 'Bailar', 'Cine'],
    isVerified: false
  });

  const [potentialMatches, setPotentialMatches] = useState<UserProfile[]>(INITIAL_POTENTIAL_MATCHES);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>({});

  // Cargar chats del usuario en tiempo real
  useEffect(() => {
    console.log('🔍 Cargando chats para usuario:', CURRENT_USER_ID);
    
    const unsubscribe = getUserChats(CURRENT_USER_ID, (userChats) => {
      console.log('📱 Chats recibidos:', userChats.length, userChats);
      setChats(userChats);
    });

    return () => unsubscribe();
  }, []);

  // Cargar perfiles para Discovery
  useEffect(() => {
    const unsubscribe = getDiscoveryProfiles(CURRENT_USER_ID, (profiles) => {
      if (profiles.length > 0) {
        setPotentialMatches(profiles);
      }
      // Si no hay perfiles en Firebase, usar los mock
    });

    return () => unsubscribe();
  }, []);

  // Escuchar mensajes del chat seleccionado
  useEffect(() => {
    if (!selectedChatId) return;

    const unsubscribe = listenToMessages(selectedChatId, (messages) => {
      setChatMessages(prev => ({ ...prev, [selectedChatId]: messages }));
    });

    return () => unsubscribe();
  }, [selectedChatId]);

  // Crear perfil del usuario actual si no existe
  useEffect(() => {
    createOrUpdateProfile(CURRENT_USER_ID, currentUser);
    
    // Crear algunos matches de demo para probar el sistema de privacidad
    initializeDemoMatches();
  }, [currentUser]);

  // Inicializar matches de demo
  const initializeDemoMatches = async () => {
    try {
      console.log('💕 Inicializando matches de demo...');
      
      // Crear matches con algunos usuarios
      await privacyService.createMatch(CURRENT_USER_ID, '1'); // Match con Carolina
      await privacyService.createMatch(CURRENT_USER_ID, '3'); // Match con Isabella
      
      console.log('✅ Matches de demo creados');
    } catch (error) {
      console.error('Error creando matches de demo:', error);
    }
  };

  const handleLike = async (user: UserProfile) => {
    console.log('🔥 Haciendo like a:', user.name);
    
    // 100% chance of match for testing purposes
    if (Math.random() > 0.0) {
      try {
        console.log('✅ ¡Es un match! Creando chat...');
        
        // Crear o encontrar chat existente
        const chatId = await findOrCreateChat(CURRENT_USER_ID, user.id);
        console.log('📱 Chat creado con ID:', chatId);
        
        // Enviar mensaje inicial
        await sendMessage(chatId, CURRENT_USER_ID, '¡Hola! Me gustó tu perfil 😊');
        console.log('💬 Mensaje inicial enviado');
        
        return true;
      } catch (error) {
        console.error('❌ Error creating match:', error);
        return false;
      }
    } else {
      console.log('💔 No hubo match esta vez');
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
    try {
      await sendMessage(chatId, CURRENT_USER_ID, text, type, content, duration);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'discovery':
        return (
          <Discovery 
            users={potentialMatches} 
            currentUserId={CURRENT_USER_ID}
            onLike={handleLike} 
            onAction={(id) => {
              // No remover usuarios, solo hacer log
              console.log('👤 Usuario procesado:', id);
              // setPotentialMatches(p => p.filter(u => u.id !== id)) // REMOVIDO
            }}
            onOpenChat={(userId) => {
              // Buscar el chat existente para este usuario
              const existingChat = chats.find(chat => 
                chat.participants.includes(userId) && chat.participants.includes(CURRENT_USER_ID)
              );
              
              if (existingChat) {
                console.log('📱 Abriendo chat existente:', existingChat.id);
                setSelectedChatId(existingChat.id);
                setActiveView('chat');
              } else {
                console.log('❌ No se encontró chat para el usuario:', userId);
                // Ir a la vista de mensajes como fallback
                setActiveView('messages');
              }
            }}
          />
        );
      case 'messages':
        return (
          <Messages 
            matches={chats.map(chat => {
              // Encontrar el ID del otro usuario
              const otherUserId = chat.participants.find(p => p !== CURRENT_USER_ID) || '';
              
              // Crear un usuario basado en los perfiles mock o usar datos por defecto
              let otherUser = potentialMatches.find(u => u.id === otherUserId);
              
              if (!otherUser) {
                // Si no está en los matches, crear un usuario por defecto
                otherUser = {
                  id: otherUserId,
                  name: otherUserId === '1' ? 'Carolina' : otherUserId === '2' ? 'Marcos' : 'Usuario',
                  age: 25,
                  bio: '',
                  location: 'Santo Domingo',
                  images: [otherUserId === '1' 
                    ? 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600'
                    : otherUserId === '2' 
                    ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600'
                    : 'https://picsum.photos/200'
                  ],
                  interests: []
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
      case 'ai-coach':
        return <AICoach profile={currentUser} />;
      case 'profile':
        return <ProfileView user={currentUser} onUpdate={setCurrentUser} />;
      case 'chat':
        const currentChat = chats.find(c => c.id === selectedChatId);
        if (!currentChat) return null;
        
        // Encontrar el ID del otro usuario
        const otherUserId = currentChat.participants.find(p => p !== CURRENT_USER_ID) || '';
        
        // Crear un usuario basado en los perfiles mock o usar datos por defecto
        let otherUser = potentialMatches.find(u => u.id === otherUserId);
        
        if (!otherUser) {
          otherUser = {
            id: otherUserId,
            name: otherUserId === '1' ? 'Carolina' : otherUserId === '2' ? 'Marcos' : 'Usuario',
            age: 25,
            bio: '',
            location: 'Santo Domingo',
            images: [otherUserId === '1' 
              ? 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600'
              : otherUserId === '2' 
              ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600'
              : 'https://picsum.photos/200'
            ],
            interests: []
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
            currentUserId={CURRENT_USER_ID}
          />
        );
      default:
        return null;
    }
  };

  return (
    <LanguageProvider>
      <Layout activeView={activeView === 'chat' ? 'messages' : activeView} onViewChange={setActiveView}>
        {renderView()}
      </Layout>
    </LanguageProvider>
  );
};

export default App;