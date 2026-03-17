
import React, { useState, useEffect, useRef, memo } from 'react';
import { Heart, X, Star, Flag } from 'lucide-react';
import { UserProfile } from '../../types';
import SwipeCard from '../../components/SwipeCard';
import StoriesRing from '../../components/StoriesRing';
import StoriesViewer from '../../components/StoriesViewer';
import CreateStoryModal from '../../components/CreateStoryModal';
import ReportProfileModal from '../../components/ReportProfileModal';
import ErrorBoundary from '../../components/ErrorBoundary';
import { StoryGroup } from '../../services/storiesService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../components/Toast';
import { logger } from '../../utils/logger';
import { useMatchingAI } from '../../hooks/useMatchingAI';

// ⚡ PERFORMANCE MODE v2: IA reactivada en background
// Los perfiles se muestran INMEDIATAMENTE, la IA reordena en background sin bloquear

interface DiscoveryProps {
  users?: UserProfile[];
  onLike?: (user: UserProfile) => Promise<boolean> | boolean;
  onAction?: (userId: string) => void;
  onOpenChat?: (userId: string) => void;
  onSendMessage?: (userId: string, message: string, type?: 'text' | 'story_reaction') => Promise<void>;
  currentUserId?: string;
  currentUserProfile?: UserProfile;
}

const Discovery: React.FC<DiscoveryProps> = ({ 
  users, 
  onLike, 
  onAction,
  onOpenChat,
  onSendMessage,
  currentUserId = 'demo-user',
  currentUserProfile
}) => {
  // ⚡ LOG CRÍTICO: Verificar que currentUserId llega correctamente
  logger.profile.info('🎯 [DISCOVERY] Component mounted/updated', { 
    currentUserId,
    hasUsers: !!users,
    usersCount: users?.length || 0
  });
  
  const { t } = useLanguage();
  const { showToast, ToastContainer } = useToast();
  
  // ⚡ IA reactivada: corre en background sin bloquear la UI
  const { predictions, generatePredictions, recordSwipe } = useMatchingAI();
  
  // Usar solo los usuarios pasados como prop (usuarios reales de Firebase)
  const availableUsers = users || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const [sortedUsers, setSortedUsers] = useState<UserProfile[]>([]);
  const [swipeStartTime, setSwipeStartTime] = useState<number>(Date.now());

  // Estados para Stories
  const [showStoriesViewer, setShowStoriesViewer] = useState(false);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState<StoryGroup | null>(null);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
  
  // Estados para Super Like
  const [showSuperLikeAnimation, setShowSuperLikeAnimation] = useState(false);
  
  // Estados para Reportar
  const [showReportModal, setShowReportModal] = useState(false);
  const [userToReport, setUserToReport] = useState<UserProfile | null>(null);

  // ⚡ ULTRA FAST: Mostrar perfiles inmediatamente, IA reordena en background
  const aiSortedRef = useRef(false);
  
  useEffect(() => {
    if (availableUsers.length > 0) {
      // Mostrar inmediatamente sin esperar IA
      setSortedUsers(availableUsers);
      
      // Lanzar IA en background para reordenar (no bloquea)
      if (!aiSortedRef.current && currentUserId && currentUserId !== 'demo-user') {
        aiSortedRef.current = true;
        // setTimeout para no bloquear el primer render
        setTimeout(() => {
          generatePredictions(currentUserId, availableUsers).catch(() => {});
        }, 500);
      }
    }
  }, [availableUsers.length]);
  
  // Cuando las predicciones de IA llegan, reordenar los perfiles que aún no se han visto
  useEffect(() => {
    if (predictions.length > 0 && availableUsers.length > 0 && currentIndex < 2) {
      // Solo reordenar si el usuario aún está en los primeros perfiles
      const sorted = [...availableUsers].sort((a, b) => {
        const predA = predictions.find(p => p.targetUserId === a.id);
        const predB = predictions.find(p => p.targetUserId === b.id);
        const scoreA = predA ? predA.compatibilityScore.overall * predA.likelihoodOfMatch : 0.5;
        const scoreB = predB ? predB.compatibilityScore.overall * predB.likelihoodOfMatch : 0.5;
        return scoreB - scoreA;
      });
      setSortedUsers(sorted);
      logger.match.info('Perfiles reordenados por IA', { count: sorted.length });
    }
  }, [predictions.length]);

  // ⚡ OPTIMIZACIÓN: Usar useMemo para displayUsers
  const displayUsers = React.useMemo(() => {
    return sortedUsers.length > 0 ? sortedUsers : availableUsers;
  }, [sortedUsers.length, availableUsers.length]); // Solo depende de lengths

  console.log('🔍 Discovery render:', { 
    usersLength: displayUsers?.length, 
    currentIndex, 
    currentUserName: displayUsers?.[currentIndex]?.name
  });

  // Asegurar que siempre tengamos un usuario válido
  const currentUser = displayUsers && displayUsers.length > 0 ? displayUsers[currentIndex % displayUsers.length] : null;
  const nextUser = displayUsers && displayUsers.length > 1 ? displayUsers[(currentIndex + 1) % displayUsers.length] : null;

  const handleAction = async (action: 'like' | 'pass' | 'superlike') => {
    if (!currentUser) return;
    
    const timeSpent = Date.now() - swipeStartTime;
    logger.match.debug('Acción de swipe', { action, userName: currentUser.name, timeSpent });
    
    // Registrar swipe en el sistema de IA (background, no bloquea)
    if (currentUserId && currentUserId !== 'demo-user') {
      recordSwipe(currentUserId, currentUser.id, action, currentUser, timeSpent).catch(() => {});
    }
    
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
    // Stories se actualizan automáticamente via listener en tiempo real
  };

  const handleCloseStoriesViewer = () => {
    setShowStoriesViewer(false);
    setSelectedStoryGroup(null);
  };

  const handleReportUser = (user: UserProfile) => {
    console.log('🚩 Botón de reportar clickeado', { userName: user.name });
    logger.ui.info('Abriendo modal de reporte', { userName: user.name });
    setUserToReport(user);
    setShowReportModal(true);
    console.log('🚩 Estados actualizados', { showReportModal: true, userToReport: user.name });
  };

  const handleCloseReportModal = () => {
    console.log('🚩 Cerrando modal de reporte');
    setShowReportModal(false);
    setUserToReport(null);
  };

  // Debug: mostrar información básica
  console.log('🔍 Estado actual:', {
    usersCount: displayUsers?.length,
    currentIndex,
    hasCurrentUser: !!currentUser
  });

  // NO bloquear la UI mientras se calculan scores - mostrar perfiles inmediatamente
  // El indicador de carga se muestra como overlay sutil

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
        {/* Componente StoriesRing - versión funcional */}
        <StoriesRing
          currentUserId={currentUserId}
          onStoryClick={handleStoryClick}
          onCreateStory={handleCreateStory}
        />
      </div>

      {/* Profile Cards Stack - Full width desktop layout */}
      <div className="flex-1 px-4 py-6 w-full space-y-6 flex flex-col items-center">

        {/* Main Card Container with aspect ratio 4:5 - Centered for optimal UX */}
        <div className="relative group w-full max-w-lg mb-12">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
          {/* Next Card (Background) */}
          {nextUser && (
            <div className="absolute inset-0 z-10 opacity-50 scale-95 pointer-events-none">
              <SwipeCard
                user={nextUser}
                currentUser={currentUserProfile || { id: currentUserId, name: '', age: 25, bio: '', location: '', distance: '', images: [], interests: [], isVerified: false }}
                onSwipeLeft={() => {}}
                onSwipeRight={() => {}}
                isTop={false}
              />
            </div>
          )}
          
          {/* Current Card (Interactive) */}
          <SwipeCard
            user={currentUser}
            currentUser={currentUserProfile || { id: currentUserId, name: '', age: 25, bio: '', location: '', distance: '', images: [], interests: [], isVerified: false }}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            isTop={true}
            showSuperLikeAnimation={showSuperLikeAnimation}
          />
        </div>
          
          {/* Report Button - Top Right (FUERA del SwipeCard para evitar conflictos) */}
          {currentUser && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log('🚩 Click en botón de reportar');
                handleReportUser(currentUser);
              }}
              className="absolute top-4 right-4 z-50 p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center pointer-events-auto"
              title="Reportar perfil"
            >
              <Flag className="text-slate-700 hover:text-red-600 transition-colors" size={20} />
            </button>
          )}
          
          {/* Action Buttons - Positioned on bottom border */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center gap-6 z-30">
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
      
      {/* Report Profile Modal */}
      {userToReport && (
        <ReportProfileModal
          isOpen={showReportModal}
          reportedUserId={userToReport.id}
          reportedUserName={userToReport.name}
          currentUserId={currentUserId}
          onClose={handleCloseReportModal}
        />
      )}
    </div>
  );
};

// ⚡ OPTIMIZACIÓN: Usar React.memo para evitar re-renders innecesarios
export default memo(Discovery, (prevProps, nextProps) => {
  // Solo re-renderizar si cambian los usuarios o el currentUserId
  return (
    prevProps.users?.length === nextProps.users?.length &&
    prevProps.currentUserId === nextProps.currentUserId &&
    prevProps.currentUserProfile?.id === nextProps.currentUserProfile?.id
  );
});