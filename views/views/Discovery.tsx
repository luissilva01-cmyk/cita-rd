
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
import { useToast } from '../../components/Toast';
import { logger } from '../../utils/logger';

interface DiscoveryProps {
  users?: UserProfile[];
  onLike?: (user: UserProfile) => Promise<boolean> | boolean;
  onAction?: (userId: string) => void;
  onOpenChat?: (userId: string) => void;
  onSendMessage?: (userId: string, message: string, type?: 'text' | 'story_reaction') => Promise<void>;
  currentUserId?: string;
}

// Mock user para el usuario actual (solo para sistema de matching IA)
const CURRENT_USER_MOCK: UserProfile = {
  id: 'current-user',
  name: 'Usuario Actual',
  age: 25,
  bio: 'Usuario de prueba para el sistema de matching IA',
  location: 'Santo Domingo',
  distance: '0km',
  images: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=95&w=1200&h=1600'],
  interests: ['Tecnología', 'Música', 'Deportes'],
  job: 'Desarrollador',
  isVerified: true
};

const Discovery: React.FC<DiscoveryProps> = ({ 
  users, 
  onLike, 
  onAction,
  onOpenChat,
  onSendMessage,
  currentUserId = 'demo-user'
}) => {
  const { t } = useLanguage();
  const { showToast, ToastContainer } = useToast();
  const { 
    predictions, 
    generatePredictions, 
    recordSwipe, 
    isAnalyzing,
    error: aiError 
  } = useMatchingAI();
  
  // Usar solo los usuarios pasados como prop (usuarios reales de Firebase)
  const availableUsers = users || [];
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
  
  // Estados para Super Like
  const [showSuperLikeAnimation, setShowSuperLikeAnimation] = useState(false);

  // Función para ordenar usuarios con IA
  const optimizeUsersWithAI = async (users: UserProfile[]): Promise<UserProfile[]> => {
    logger.match.debug('Optimizando usuarios con IA', { count: users.length });
    
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
            logger.match.error('Error calculando score para usuario', { userName: user.name, error });
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

      logger.match.success('Usuarios optimizados con IA', { 
        topUsers: sorted.slice(0, 3).map(u => ({ 
          name: u.name, 
          aiScore: u.aiCompatibility ? Math.round(u.aiCompatibility * 100) : 'N/A',
          priority: u.aiPriority || 'N/A',
          boost: u.visibilityBoost 
        }))
      });

      return sorted;
    } catch (error) {
      logger.match.error('Error optimizando con IA', error);
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
        logger.match.error('Error optimizando usuarios', error);
        setSortedUsers(availableUsers);
        // Mostrar mensaje al usuario solo si es un error crítico
        if (availableUsers.length === 0) {
          alert('Error al cargar perfiles. Por favor recarga la página.');
        }
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

  const handleAction = async (action: 'like' | 'pass' | 'superlike') => {
    if (!currentUser) return;
    
    const timeSpent = Date.now() - swipeStartTime;
    logger.match.debug('Acción de swipe', { action, userName: currentUser.name, timeSpent });
    
    try {
      // Si es super like, mostrar animación PRIMERO
      if (action === 'superlike') {
        logger.match.info('Super Like enviado', { userName: currentUser.name });
        
        // Mostrar animación especial
        setShowSuperLikeAnimation(true);
        
        // Mostrar toast de notificación
        showToast({
          type: 'info',
          title: '⭐ Super Like enviado!',
          message: `Le has enviado un Super Like a ${currentUser.name}. Serás priorizado en su lista.`,
          duration: 4000
        });
        
        // Esperar a que la animación termine antes de continuar
        await new Promise(resolve => setTimeout(resolve, 2000));
        setShowSuperLikeAnimation(false);
      }
      
      // Registrar swipe en el sistema de IA
      await recordSwipe(currentUserId, currentUser.id, action === 'superlike' ? 'like' : action, currentUser, timeSpent);
      logger.match.success('Swipe registrado en IA');
    } catch (error) {
      console.error('Error registrando swipe en IA:', error);
    }
    
    if ((action === 'like' || action === 'superlike') && onLike) {
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
        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center mb-6">
          <Heart className="text-white" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Sé de los primeros en Ta' Pa' Ti</h2>
        <p className="text-slate-600 mb-6">
          Estamos creciendo rápidamente. Vuelve pronto para descubrir nuevos perfiles en tu área.
        </p>
        <p className="text-sm text-slate-500">
          💡 Mientras tanto, completa tu perfil y activa las notificaciones para no perderte nuevos matches.
        </p>
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
    <div className="relative h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Toast Container */}
      <ToastContainer />

      {/* Stories Section - Responsive */}
      <div className="shrink-0 border-b border-gray-200 safe-area-top">
        {/* Componente StoriesRingWorking - versión funcional */}
        <StoriesRingWorking
          currentUserId={currentUserId}
          onStoryClick={handleStoryClick}
          onCreateStory={handleCreateStory}
        />
      </div>

      {/* Profile Cards Stack - Full width desktop layout */}
      <div className="flex-1 px-4 py-6 w-full space-y-6 flex flex-col items-center">
        {/* AI Insights Toggle - Responsive */}
        {predictions.length > 0 && (
          <div className="flex justify-between items-center w-full max-w-lg">
            <button
              onClick={() => setShowAIInsights(!showAIInsights)}
              className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium hover:bg-purple-200 transition-colors min-h-[44px]"
            >
              <Brain size={14} className="sm:w-4 sm:h-4" />
              IA Insights
              <Zap size={12} className="sm:w-3.5 sm:h-3.5" />
            </button>
            
            {showAIInsights && currentUser && (
              <div className="text-[10px] sm:text-xs text-gray-600 max-w-[60%] text-right">
                {predictions.find(p => p.targetUserId === currentUser.id)?.recommendationReason || 'Analizando...'}
              </div>
            )}
          </div>
        )}

        {/* Main Card Container with aspect ratio 4:5 - Centered for optimal UX */}
        <div className="relative group w-full max-w-lg">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
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
            showSuperLikeAnimation={showSuperLikeAnimation}
          />
        </div>
          
          {/* Action Buttons - Glassmorphic Floating */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30">
            <button
              onClick={() => handleAction('pass')}
              className="w-14 h-14 rounded-full bg-white/70 backdrop-blur-md shadow-xl flex items-center justify-center hover:scale-110 transition-transform border border-white/30 min-w-[48px] min-h-[48px]"
              title={t('passButton')}
            >
              <X className="text-red-500" size={28} />
            </button>
            
            <button
              onClick={() => handleAction('like')}
              className="w-18 h-18 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full shadow-lg shadow-rose-500/40 flex items-center justify-center hover:scale-110 transition-transform p-4 min-w-[56px] min-h-[56px]"
              title={t('likeButton')}
            >
              <Heart className="text-white fill-current" size={32} />
            </button>
            
            <button
              onClick={() => handleAction('superlike')}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 backdrop-blur-md shadow-xl shadow-blue-500/50 flex items-center justify-center hover:scale-110 transition-transform border border-blue-300 min-w-[48px] min-h-[48px]"
              title="Super Like"
            >
              <Star className="text-white fill-current" size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Match Modal - Responsive */}
      {showMatch && matchedUser && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 mx-4 sm:mx-6 text-center max-w-sm w-full">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎉</div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">{t('itsAMatch')}</h3>
            <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">{t('youAndUserLikedEachOther', { user: matchedUser.name })}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleMatchClose}
                className="flex-1 py-3 px-6 border border-slate-200 rounded-full text-slate-600 font-medium hover:bg-slate-50 transition-colors min-h-[48px] text-sm sm:text-base"
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
                className="flex-1 py-3 px-6 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-all min-h-[48px] text-sm sm:text-base"
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