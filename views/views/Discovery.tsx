
import React, { useState, useEffect } from 'react';
import { Heart, X, Star, Brain, Zap } from 'lucide-react';
import { UserProfile } from '../../types';
import SwipeCard from '../../components/SwipeCard';
import { calculateProfileScore } from '../../services/photoAnalysisService';
import StoriesRingWorking from '../../components/StoriesRingWorking';
import StoriesViewer from '../../components/StoriesViewer';
import CreateStoryModal from '../../components/CreateStoryModal';
import ErrorBoundary from '../../components/ErrorBoundary';
import { StoryGroup } from '../../services/storiesService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useMatchingAI } from '../../hooks/useMatchingAI';
import { MatchPrediction } from '../../services/matchingAI';

interface DiscoveryProps {
  users?: UserProfile[];
  onLike?: (user: UserProfile) => Promise<boolean> | boolean;
  onAction?: (userId: string) => void;
  onOpenChat?: (userId: string) => void;
  onSendMessage?: (userId: string, message: string, type?: 'text' | 'story_reaction') => Promise<void>;
  currentUserId?: string;
}

// Mock user para el usuario actual
const CURRENT_USER_MOCK: UserProfile = {
  id: 'current-user',
  name: 'Usuario Actual',
  age: 25,
  bio: 'Usuario de prueba para el sistema de matching IA',
  location: 'Santo Domingo',
  distance: '0km',
  images: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600'],
  interests: ['Tecnología', 'Música', 'Deportes'],
  job: 'Desarrollador',
  isVerified: true
};
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
  onSendMessage,
  currentUserId = 'demo-user'
}) => {
  const { t } = useLanguage();
  const { 
    predictions, 
    generatePredictions, 
    recordSwipe, 
    isAnalyzing,
    error: aiError 
  } = useMatchingAI();
  
  // Usar los usuarios pasados como prop, o fallback a MOCK_USERS
  const availableUsers = users && users.length > 0 ? users : MOCK_USERS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const [sortedUsers, setSortedUsers] = useState<UserProfile[]>([]);
  const [isLoadingScores, setIsLoadingScores] = useState(true);
  const [aiOptimizedUsers, setAiOptimizedUsers] = useState<UserProfile[]>([]);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [swipeStartTime, setSwipeStartTime] = useState<number>(Date.now());

  // Estados para Stories
  const [showStoriesViewer, setShowStoriesViewer] = useState(false);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState<StoryGroup | null>(null);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
  const [storiesKey, setStoriesKey] = useState(0); // Para forzar re-render de stories

  // Función para ordenar usuarios con IA
  const optimizeUsersWithAI = async (users: UserProfile[]): Promise<UserProfile[]> => {
    console.log('🤖 Optimizando usuarios con IA para', users.length, 'candidatos...');
    
    try {
      // Generar predicciones de matching
      await generatePredictions(currentUserId, [CURRENT_USER_MOCK, ...users]);
      
      // Calcular scores de visibilidad tradicionales
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

      // Combinar con predicciones de IA si están disponibles
      const optimizedUsers = usersWithScores.map(user => {
        const prediction = predictions.find(p => p.targetUserId === user.id);
        if (prediction) {
          return {
            ...user,
            aiCompatibility: prediction.compatibilityScore.overall,
            aiPriority: prediction.priority,
            aiRecommendation: prediction.recommendationReason,
            matchLikelihood: prediction.likelihoodOfMatch
          };
        }
        return user;
      });

      // Ordenar por IA primero, luego por visibility boost
      const sorted = optimizedUsers.sort((a, b) => {
        // Priorizar usuarios con predicciones de IA
        if (a.aiCompatibility && b.aiCompatibility) {
          const aScore = a.aiCompatibility * (a.matchLikelihood || 0.5);
          const bScore = b.aiCompatibility * (b.matchLikelihood || 0.5);
          if (Math.abs(aScore - bScore) > 0.1) {
            return bScore - aScore;
          }
        }
        
        // Fallback a visibility boost
        if (b.visibilityBoost !== a.visibilityBoost) {
          return b.visibilityBoost - a.visibilityBoost;
        }
        return (b.profileScore || 0) - (a.profileScore || 0);
      });

      console.log('🎯 Usuarios optimizados con IA:', 
        sorted.slice(0, 3).map(u => ({ 
          name: u.name, 
          aiScore: u.aiCompatibility ? Math.round(u.aiCompatibility * 100) : 'N/A',
          priority: u.aiPriority || 'N/A',
          boost: u.visibilityBoost 
        }))
      );

      return sorted;
    } catch (error) {
      console.error('Error optimizando con IA:', error);
      return users;
    }
  };

  // Efecto para optimizar usuarios con IA cuando cambian
  useEffect(() => {
    const loadAndOptimizeUsers = async () => {
      setIsLoadingScores(true);
      try {
        const optimized = await optimizeUsersWithAI(availableUsers);
        setSortedUsers(optimized);
        setAiOptimizedUsers(optimized);
      } catch (error) {
        console.error('Error optimizando usuarios:', error);
        setSortedUsers(availableUsers);
      } finally {
        setIsLoadingScores(false);
      }
    };

    loadAndOptimizeUsers();
  }, [availableUsers, currentUserId]);

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
    
    const timeSpent = Date.now() - swipeStartTime;
    console.log(`🎯 Acción: ${action} en usuario:`, currentUser.name, 'Tiempo:', timeSpent + 'ms');
    
    // Registrar swipe en el sistema de IA
    try {
      await recordSwipe(currentUserId, currentUser.id, action, currentUser, timeSpent);
      console.log('🤖 Swipe registrado en IA');
    } catch (error) {
      console.error('Error registrando swipe en IA:', error);
    }
    
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
    
    // Avanza al siguiente usuario y resetea el tiempo
    console.log('📈 Avanzando índice de', currentIndex, 'a', currentIndex + 1);
    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      console.log('📊 Nuevo índice:', newIndex, 'Total usuarios:', displayUsers.length);
      return newIndex;
    });
    
    // Resetear tiempo para el próximo usuario
    setSwipeStartTime(Date.now());
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

  // Mostrar loading mientras se calculan los scores y la IA
  if (isLoadingScores || isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          <Brain className="absolute inset-0 m-auto text-purple-600" size={20} />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          {isAnalyzing ? 'Analizando con IA...' : t('optimizingProfiles')}
        </h2>
        <p className="text-slate-600">
          {isAnalyzing ? 'Calculando compatibilidad inteligente' : t('calculatingCompatibility')}
        </p>
        {aiError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">Error de IA: {aiError}</p>
          </div>
        )}
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
        {/* Componente StoriesRingWorking - versión funcional */}
        <StoriesRingWorking
          currentUserId={currentUserId}
          onStoryClick={handleStoryClick}
          onCreateStory={handleCreateStory}
        />
      </div>

      {/* Profile Cards Stack */}
      <div className="flex-1 p-4 max-h-[calc(100vh-200px)]">
        {/* AI Insights Toggle */}
        {predictions.length > 0 && (
          <div className="mb-4 flex justify-between items-center">
            <button
              onClick={() => setShowAIInsights(!showAIInsights)}
              className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              <Brain size={16} />
              IA Insights
              <Zap size={14} />
            </button>
            
            {showAIInsights && currentUser && (
              <div className="text-xs text-gray-600">
                {predictions.find(p => p.targetUserId === currentUser.id)?.recommendationReason || 'Analizando...'}
              </div>
            )}
          </div>
        )}

        <div className="relative h-full max-h-[600px]">
          {/* Next Card (Background) */}
          {nextUser && (
            <div className="absolute inset-0 z-10 opacity-50 scale-95 pointer-events-none">
              <SwipeCard
                user={nextUser}
                currentUser={CURRENT_USER_MOCK}
                onSwipeLeft={() => {}}
                onSwipeRight={() => {}}
                isTop={false}
              />
            </div>
          )}
          
          {/* Current Card (Interactive) */}
          <SwipeCard
            user={currentUser}
            currentUser={CURRENT_USER_MOCK}
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
      <ErrorBoundary fallback={
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 m-4 max-w-md">
            <h3 className="text-lg font-bold text-red-600 mb-2">Error en Stories</h3>
            <p className="text-gray-600 mb-4">Hubo un problema al cargar las historias.</p>
            <details className="mb-4">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Ver detalles técnicos
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono">
                <p>Posibles causas:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Error en storiesService.getStoryGroups()</li>
                  <li>Error en privacyService.canViewStories()</li>
                  <li>Problema con IDs de usuario</li>
                  <li>Error de red o Firebase</li>
                </ul>
                <p className="mt-2">
                  Revisa la consola del navegador (F12) para más detalles.
                </p>
              </div>
            </details>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  console.log('🔄 Recargando página para reiniciar stories...');
                  window.location.reload();
                }}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {t('reload')}
              </button>
              <button 
                onClick={() => setShowStoriesViewer(false)}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      }>
        <StoriesViewer
          isOpen={showStoriesViewer}
          storyGroup={selectedStoryGroup}
          currentUserId={currentUserId}
          onClose={handleCloseStoriesViewer}
          onSendMessage={onSendMessage}
        />
      </ErrorBoundary>
      
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