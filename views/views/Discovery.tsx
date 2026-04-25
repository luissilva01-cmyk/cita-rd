
import React, { useState, useEffect, useRef, memo } from 'react';
import { Heart, X, Star, Flag } from 'lucide-react';
import { UserProfile } from '../../types';
import SwipeCard from '../../components/SwipeCard';
import { calculateDistanceKm } from '../../services/geolocationService';
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

  // Rewind state
  const [lastSwipedUser, setLastSwipedUser] = useState<UserProfile | null>(null);
  const [canRewind, setCanRewind] = useState(false);

  // Daily swipe limit for free users
  const DAILY_SWIPE_LIMIT = 25;
  const [dailySwipes, setDailySwipes] = useState(0);
  const [showSwipeLimitModal, setShowSwipeLimitModal] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(`swipes_${currentUserId}_${today}`);
    setDailySwipes(stored ? parseInt(stored, 10) : 0);
  }, [currentUserId]);

  const incrementSwipeCount = () => {
    const today = new Date().toISOString().split('T')[0];
    const newCount = dailySwipes + 1;
    setDailySwipes(newCount);
    localStorage.setItem(`swipes_${currentUserId}_${today}`, String(newCount));
  };

  // Estados para Stories
  const [showStoriesViewer, setShowStoriesViewer] = useState(false);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState<StoryGroup | null>(null);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
  
  // Estados para Super Like
  const [showSuperLikeAnimation, setShowSuperLikeAnimation] = useState(false);
  
  // Estados para Reportar
  const [showReportModal, setShowReportModal] = useState(false);
  const [userToReport, setUserToReport] = useState<UserProfile | null>(null);

  // Filter chips state
  type FilterChip = 'todos' | 'mujeres' | 'hombres' | 'cerca' | 'jovenes' | 'verificados' | 'serios';
  const [activeFilters, setActiveFilters] = useState<Set<FilterChip>>(new Set(['todos']));

  const toggleFilter = (filter: FilterChip) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (filter === 'todos') {
        return new Set(['todos']);
      }
      next.delete('todos');
      if (next.has(filter)) {
        next.delete(filter);
        if (next.size === 0) next.add('todos');
      } else {
        next.add(filter);
      }
      return next;
    });
    setCurrentIndex(0); // Reset to first card when filter changes
  };

  // ⚡ ULTRA FAST: Mostrar perfiles inmediatamente, IA reordena en background
  const aiSortedRef = useRef(false);
  
  // Filtrar perfiles por preferencia de género
  const genderFilteredUsers = React.useMemo(() => {
    if (!currentUserProfile?.interestedIn) return availableUsers;
    
    return availableUsers.filter(u => {
      // Si el usuario no tiene género definido, mostrarlo (perfil antiguo)
      if (!u.gender) return true;
      
      if (currentUserProfile.interestedIn === 'ambos') return true;
      if (currentUserProfile.interestedIn === 'hombres' && u.gender === 'hombre') return true;
      if (currentUserProfile.interestedIn === 'mujeres' && u.gender === 'mujer') return true;
      return false;
    });
  }, [availableUsers, currentUserProfile?.interestedIn]);
  
  useEffect(() => {
    if (genderFilteredUsers.length > 0) {
      // Mostrar inmediatamente sin esperar IA
      setSortedUsers(genderFilteredUsers);
      
      // Lanzar IA en background para reordenar (no bloquea)
      if (!aiSortedRef.current && currentUserId && currentUserId !== 'demo-user') {
        aiSortedRef.current = true;
        setTimeout(() => {
          generatePredictions(currentUserId, genderFilteredUsers).catch(() => {});
        }, 500);
      }
    }
  }, [genderFilteredUsers.length]);
  
  // Cuando las predicciones de IA llegan, reordenar los perfiles que aún no se han visto
  useEffect(() => {
    if (predictions.length > 0 && genderFilteredUsers.length > 0 && currentIndex < 2) {
      const sorted = [...genderFilteredUsers].sort((a, b) => {
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

  // ⚡ OPTIMIZACIÓN: Usar useMemo para displayUsers with real distance calculation
  const displayUsers = React.useMemo(() => {
    const base = sortedUsers.length > 0 ? sortedUsers : genderFilteredUsers;
    
    // Calculate real distance if current user has coords
    const myLat = currentUserProfile?.latitude;
    const myLng = currentUserProfile?.longitude;
    const withDistance = base.map(u => {
      if (myLat && myLng && u.latitude && u.longitude) {
        const km = calculateDistanceKm(
          { latitude: myLat, longitude: myLng },
          { latitude: u.latitude, longitude: u.longitude }
        );
        return { ...u, distance: `${km.toFixed(1)} km` };
      }
      return u;
    });
    
    if (activeFilters.has('todos')) return withDistance;
    
    return withDistance.filter(u => {
      if (activeFilters.has('mujeres') && u.gender !== 'mujer') return false;
      if (activeFilters.has('hombres') && u.gender !== 'hombre') return false;
      if (activeFilters.has('jovenes') && (u.age < 18 || u.age > 30)) return false;
      if (activeFilters.has('verificados') && !u.isVerified) return false;
      if (activeFilters.has('serios') && u.relationshipGoal !== 'relacion_seria') return false;
      if (activeFilters.has('cerca')) {
        const dist = parseFloat(u.distance || '999');
        if (dist > 10) return false;
      }
      return true;
    });
  }, [sortedUsers.length, genderFilteredUsers.length, activeFilters, currentUserProfile?.latitude, currentUserProfile?.longitude]);

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

    // Check daily swipe limit for free users
    if (dailySwipes >= DAILY_SWIPE_LIMIT) {
      setShowSwipeLimitModal(true);
      return;
    }
    
    // Increment swipe counter
    incrementSwipeCount();
    
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
    setLastSwipedUser(currentUser);
    setCanRewind(true);
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

  const handleRewind = () => {
    if (!canRewind || currentIndex <= 0) return;
    setCurrentIndex(prev => prev - 1);
    setCanRewind(false);
    setLastSwipedUser(null);
    showToast({ type: 'info', title: '⏪ Rewind', message: 'Volviste al perfil anterior', duration: 2000 });
  };

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
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Sé de los primeros en Ta' Pa' Ti</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
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
    <div className="relative h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#121212] dark:to-[#1a1a1a] transition-colors">
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

      {/* Filter Chips */}
      <div className="shrink-0 px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
        {([
          { id: 'todos' as FilterChip, label: 'Todos', emoji: '🔥' },
          { id: 'mujeres' as FilterChip, label: 'Mujeres', emoji: '👩' },
          { id: 'hombres' as FilterChip, label: 'Hombres', emoji: '👨' },
          { id: 'cerca' as FilterChip, label: '<10km', emoji: '📍' },
          { id: 'jovenes' as FilterChip, label: '18-30', emoji: '🎯' },
          { id: 'verificados' as FilterChip, label: 'Verificados', emoji: '✓' },
          { id: 'serios' as FilterChip, label: 'Serios', emoji: '❤️' },
        ]).map(chip => {
          const isActive = activeFilters.has(chip.id);
          return (
            <button
              key={chip.id}
              onClick={() => toggleFilter(chip.id)}
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
              style={{
                background: isActive ? 'linear-gradient(135deg, #ff8052, #ffc107)' : 'white',
                color: isActive ? 'white' : '#64748b',
                border: isActive ? 'none' : '1px solid #e2e8f0',
                boxShadow: isActive ? '0 2px 8px rgba(255,128,82,0.3)' : 'none'
              }}
            >
              <span className="text-[11px]">{chip.emoji}</span>
              {chip.label}
            </button>
          );
        })}
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
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center gap-4 z-30">
            {/* Rewind Button */}
            <button
              onClick={handleRewind}
              disabled={!canRewind}
              className={`w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all min-w-[44px] min-h-[44px] ${
                canRewind 
                  ? 'bg-white/90 backdrop-blur-md border border-amber-200 hover:scale-110 text-amber-500' 
                  : 'bg-white/40 border border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              title="Rewind"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
            </button>

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

      {/* Swipe Limit Modal */}
      {showSwipeLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff8052, #ffc107)' }}>
              <Heart className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">¡Se acabaron los swipes!</h3>
            <p className="text-sm text-gray-500 mb-1">
              Usaste tus {DAILY_SWIPE_LIMIT} swipes gratis de hoy.
            </p>
            <p className="text-xs text-gray-400 mb-5">
              Vuelve mañana o hazte Premium para swipes ilimitados.
            </p>
            <button
              onClick={() => setShowSwipeLimitModal(false)}
              className="w-full py-3 rounded-xl font-bold text-white text-sm shadow-lg transition-transform active:scale-95"
              style={{ background: 'linear-gradient(135deg, #ff8052, #ffc107)' }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Remaining swipes indicator */}
      {dailySwipes > 0 && dailySwipes < DAILY_SWIPE_LIMIT && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-black/5 text-[10px] font-semibold text-slate-500">
            {DAILY_SWIPE_LIMIT - dailySwipes} swipes restantes
          </div>
        </div>
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