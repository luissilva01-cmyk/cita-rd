
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
    images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600'],
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
    images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600'],
    interests: ['Béisbol', 'Tecnología', 'Café'],
    job: 'Desarrollador',
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
    const unsubscribe = getUserChats(CURRENT_USER_ID, (userChats) => {
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
  }, [currentUser]);

  const handleLike = async (user: UserProfile) => {
    // 70% chance of match for demo purposes
    if (Math.random() > 0.3) {
      try {
        // Crear o encontrar chat existente
        const chatId = await findOrCreateChat(CURRENT_USER_ID, user.id);
        
        // Enviar mensaje inicial
        await sendMessage(chatId, CURRENT_USER_ID, '¡Hola! Me gustó tu perfil 😊');
        
        return true;
      } catch (error) {
        console.error('Error creating match:', error);
        return false;
      }
    }
    return false;
  };

  const handleSendMessage = async (chatId: string, text: string) => {
    try {
      await sendMessage(chatId, CURRENT_USER_ID, text);
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
            onLike={handleLike} 
            onAction={(id) => setPotentialMatches(p => p.filter(u => u.id !== id))} 
            onOpenChat={(chat: any) => { 
              setSelectedChatId(chat.id); 
              setActiveView('chat'); 
            }} 
          />
        );
      case 'messages':
        return (
          <Messages 
            matches={chats.map(chat => ({
              id: chat.id,
              user: chat.otherUser || {
                id: chat.participants.find(p => p !== CURRENT_USER_ID) || '',
                name: 'Usuario',
                age: 25,
                bio: '',
                location: '',
                images: ['https://picsum.photos/200'],
                interests: []
              },
              lastMessage: chat.lastMessage,
              timestamp: chat.timestamp
            }))} 
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
        return currentChat ? (
          <ChatView 
            match={{
              id: currentChat.id,
              user: currentChat.otherUser || {
                id: currentChat.participants.find(p => p !== CURRENT_USER_ID) || '',
                name: 'Usuario',
                age: 25,
                bio: '',
                location: '',
                images: ['https://picsum.photos/200'],
                interests: []
              },
              lastMessage: currentChat.lastMessage,
              timestamp: currentChat.timestamp
            }}
            messages={chatMessages[currentChat.id] || []} 
            onSendMessage={(text) => handleSendMessage(currentChat.id, text)} 
            onBack={() => setActiveView('messages')} 
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Layout activeView={activeView === 'chat' ? 'messages' : activeView} onViewChange={setActiveView}>
      {renderView()}
    </Layout>
  );
};

export default App;