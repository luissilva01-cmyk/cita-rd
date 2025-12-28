
import React, { useState, useEffect } from 'react';
import { Heart, X, Star } from 'lucide-react';
import { UserProfile } from '../../types';
import SwipeCard from '../../components/SwipeCard';
import { calculateProfileScore } from '../../services/photoAnalysisService';
import StoriesRing from '../../components/StoriesRing';
import StoriesViewer from '../../components/StoriesViewer';
import CreateStoryModal from '../../components/CreateStoryModal';
import { StoryGroup } from '../../services/storiesService';
import { useLanguage } from '../../contexts/LanguageContext';

interface DiscoveryProps {
  users?: UserProfile[];
  onLike?: (user: UserProfile) => Promise<boolean> | boolean;
  onAction?: (userId: string) => void;
  onOpenChat?: (userId: string) => void;
  currentUserId?: string;
}

// Mock users para demo/autocontenida
const MOCK_USERS: UserProfile[] = [
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
    bio: 'Emprendedor digital. Fanático de las Águilas Cibaeñas. Si no estamos viendo pelota, estamos en la playa.',
    location: 'Santiago de los Caballeros',
    distance: '15km',
    images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600'],
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
    images: ['https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=600'],
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
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'],
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
    images: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'],
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
    images: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600'],
    interests: ['Surf', 'Ingeniería', 'Aventura'],
    job: 'Ingeniero',
    isVerified: true
  }
];

const Discovery: React.FC<DiscoveryProps> = ({ 
  users, 
  onLike, 
  onAction,
  onOpenChat,
  currentUserId = 'demo-user'
}) => {
  const { t } = useLanguage();
  
  // Usar los usuarios pasados como prop, o fallback a MOCK_USERS
  const availableUsers = users && users.length > 0 ? users : MOCK_USERS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const [sortedUsers, setSortedUsers] = useState<UserProfile[]>([]);
  const [isLoadingScores, setIsLoadingScores] = useState(true);

  // Estados para Stories
  const [showStoriesViewer, setShowStoriesViewer] = useState(false);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState<StoryGroup | null>(null);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
  const [storiesKey, setStoriesKey] = useState(0); // Para forzar re-render de stories

  // Función para ordenar usuarios por visibility boost
  const sortUsersByVisibilityBoost = async (users: UserProfile[]): Promise<UserProfile[]> => {
    console.log('📊 Calculando scores de visibilidad para', users.length, 'usuarios...');
    
    const usersWithScores = await Promise.all(
      users.map(async (user) => {
        try {
          const profileScore = await calculateProfileScore(user.images || []);
          return {
            ...user,
            visibilityBoost: profileScore.visibilityBoost,
            profileScore: profileScore.totalScore
          };
        } catch (error) {
          console.error('Error calculando score para usuario', user.name, ':', error);
          return {
            ...user,
            visibilityBoost: 1.0,
            profileScore: 50
          };
        }
      })
    );

    // Ordenar por visibility boost (mayor primero) y luego por score
    const sorted = usersWithScores.sort((a, b) => {
      if (b.visibilityBoost !== a.visibilityBoost) {
        return b.visibilityBoost - a.visibilityBoost;
      }
      return (b.profileScore || 0) - (a.profileScore || 0);
    });

    console.log('✅ Usuarios ordenados por visibilidad:', 
      sorted.map(u => ({ 
        name: u.name, 
        boost: u.visibilityBoost, 
        score: u.profileScore 
      }))
    );

    return sorted;
  };

  // Efecto para ordenar usuarios cuando cambian
  useEffect(() => {
    const loadAndSortUsers = async () => {
      setIsLoadingScores(true);
      try {
        const sorted = await sortUsersByVisibilityBoost(availableUsers);
        setSortedUsers(sorted);
      } catch (error) {
        console.error('Error ordenando usuarios:', error);
        setSortedUsers(availableUsers);
      } finally {
        setIsLoadingScores(false);
      }
    };

    loadAndSortUsers();
  }, [availableUsers]);

  // Usar usuarios ordenados en lugar de availableUsers
  const displayUsers = sortedUsers.length > 0 ? sortedUsers : availableUsers;

  console.log('🔍 Discovery render:', { 
    usersLength: displayUsers?.length, 
    currentIndex, 
    currentUserName: displayUsers?.[currentIndex]?.name,
    isLoadingScores
  });

  // Asegurar que siempre tengamos un usuario válido
  const currentUser = displayUsers && displayUsers.length > 0 ? displayUsers[currentIndex % displayUsers.length] : null;
  const nextUser = displayUsers && displayUsers.length > 1 ? displayUsers[(currentIndex + 1) % displayUsers.length] : null;

  const handleAction = async (action: 'like' | 'pass') => {
    if (!currentUser) return;
    
    console.log(`🎯 Acción: ${action} en usuario:`, currentUser.name, 'Índice actual:', currentIndex);
    
    if (action === 'like' && onLike) {
      const isMatch = await onLike(currentUser);
      console.log('🎲 Resultado del like:', isMatch ? 'MATCH!' : 'No match');
      
      if (isMatch) {
        console.log('🎉 ACTIVANDO MODAL DE MATCH con usuario:', currentUser.name);
        setMatchedUser(currentUser);
        setShowMatch(true);
      }
    }
    
    // Call onAction callback if provided
    if (onAction) {
      onAction(currentUser.id);
    }
    
    // Avanza al siguiente usuario
    console.log('📈 Avanzando índice de', currentIndex, 'a', currentIndex + 1);
    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      console.log('📊 Nuevo índice:', newIndex, 'Total usuarios:', displayUsers.length);
      return newIndex;
    });
  };

  const handleSwipeLeft = () => handleAction('pass');
  const handleSwipeRight = () => handleAction('like');

  const handleMatchClose = () => {
    setShowMatch(false);
    setMatchedUser(null);
  };

  const handleRestart = () => {
    console.log('🔄 Reiniciando perfiles...');
    setCurrentIndex(0);
  };

  // Funciones para Stories
  const handleStoryClick = (storyGroup: StoryGroup) => {
    console.log('📱 Abriendo stories de:', storyGroup.user.name);
    setSelectedStoryGroup(storyGroup);
    setShowStoriesViewer(true);
  };

  const handleCreateStory = () => {
    console.log('📸 Abriendo modal para crear story');
    setShowCreateStoryModal(true);
  };

  const handleStoryCreated = () => {
    console.log('✅ Story creada, actualizando lista');
    // Forzar re-render del componente StoriesRing
    setStoriesKey(prev => prev + 1);
  };

  const handleCloseStoriesViewer = () => {
    setShowStoriesViewer(false);
    setSelectedStoryGroup(null);
  };

  // Debug: mostrar información básica
  console.log('🔍 Estado actual:', {
    usersCount: displayUsers?.length,
    currentIndex,
    hasCurrentUser: !!currentUser,
    isLoadingScores
  });

  // Mostrar loading mientras se calculan los scores
  if (isLoadingScores) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">{t('optimizingProfiles')}</h2>
        <p className="text-slate-600">{t('calculatingCompatibility')}</p>
      </div>
    );
  }

  // Solo mostrar mensaje de "no hay más" si realmente no hay usuarios
  if (!displayUsers || displayUsers.length === 0) {
    console.log('❌ No hay usuarios disponibles');
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-24 h-24 bg-linear-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center mb-6">
          <Heart className="text-white" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('noProfilesAvailable')}</h2>
        <p className="text-slate-600 mb-6">{t('comeBackLater')}</p>
      </div>
    );
  }

  if (!currentUser) {
    console.log('❌ currentUser es null');
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-24 h-24 bg-linear-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center mb-6">
          <Heart className="text-white" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('errorLoadingProfile')}</h2>
        <p className="text-slate-600 mb-6">{t('technicalProblem')}</p>
        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-linear-to-r from-rose-500 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
        >
          {t('restart')}
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col">

      {/* Stories Section */}
      <div className="shrink-0 border-b border-gray-200">
        <StoriesRing
          key={storiesKey}
          currentUserId={currentUserId}
          onStoryClick={handleStoryClick}
          onCreateStory={handleCreateStory}
        />
      </div>

      {/* Profile Cards Stack */}
      <div className="flex-1 p-4 max-h-[calc(100vh-200px)]">
        <div className="relative h-full max-h-[600px]">
          {/* Next Card (Background) */}
          {nextUser && (
            <div className="absolute inset-0 z-10 opacity-50 scale-95 pointer-events-none">
              <SwipeCard
                user={nextUser}
                onSwipeLeft={() => {}}
                onSwipeRight={() => {}}
                isTop={false}
              />
            </div>
          )}
          
          {/* Current Card (Interactive) */}
          <SwipeCard
            user={currentUser}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            isTop={true}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-6 pb-6 px-4 bg-white">
        <button
          onClick={() => handleAction('pass')}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-gray-200 relative"
          title={t('passButton')}
        >
          <X className="text-slate-500" size={32} />
          <div className="absolute inset-0 rounded-full bg-slate-100 opacity-0 hover:opacity-100 transition-opacity"></div>
        </button>
        
        <button
          onClick={handleRestart}
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-gray-200 relative"
          title={t('restartProfiles')}
        >
          <Star className="text-blue-500" size={26} />
          <div className="absolute inset-0 rounded-full bg-blue-50 opacity-0 hover:opacity-100 transition-opacity"></div>
        </button>
        
        <button
          onClick={() => handleAction('like')}
          className="w-16 h-16 bg-red-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform relative hover:bg-red-600"
          title={t('likeButton')}
        >
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="white" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Match Modal */}
      {showMatch && matchedUser && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 mx-6 text-center max-w-sm w-full">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('itsAMatch')}</h3>
            <p className="text-slate-600 mb-6">{t('youAndUserLikedEachOther', { user: matchedUser.name })}</p>
            <div className="flex gap-3">
              <button
                onClick={handleMatchClose}
                className="flex-1 py-3 px-6 border border-slate-200 rounded-full text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                {t('keepSwiping')}
              </button>
              <button
                onClick={() => {
                  handleMatchClose();
                  if (onOpenChat && matchedUser) {
                    console.log('🚀 Navegando al chat con:', matchedUser.name);
                    onOpenChat(matchedUser.id);
                  }
                }}
                className="flex-1 py-3 px-6 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-all"
              >
                {t('sendMessage')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Stories Viewer */}
      <StoriesViewer
        isOpen={showStoriesViewer}
        storyGroup={selectedStoryGroup}
        currentUserId={currentUserId}
        onClose={handleCloseStoriesViewer}
      />
      
      {/* Create Story Modal */}
      <CreateStoryModal
        isOpen={showCreateStoryModal}
        currentUserId={currentUserId}
        onClose={() => setShowCreateStoryModal(false)}
        onStoryCreated={handleStoryCreated}
      />
    </div>
  );
};

export default Discovery;