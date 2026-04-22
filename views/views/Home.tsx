import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { countReceivedLikes, listenToReceivedLikes } from '../../services/likesService';

interface HomeProps {
  currentUser: UserProfile;
  recentMatches: UserProfile[];
  onNavigateToDiscovery: () => void;
  onNavigateToMessages: () => void;
  onNavigateToProfile: () => void;
  onNavigateToLikesReceived?: () => void;
  onNavigateToMatches?: () => void;
  availableProfilesCount?: number;
  matchesCount?: number;
  unreadMessagesCount?: number;
}

const Home: React.FC<HomeProps> = ({ 
  currentUser, 
  recentMatches, 
  onNavigateToDiscovery, 
  onNavigateToMessages,
  onNavigateToProfile,
  onNavigateToLikesReceived,
  onNavigateToMatches,
  availableProfilesCount = 0,
  matchesCount = 0,
  unreadMessagesCount = 0
}) => {
  const [likesCount, setLikesCount] = useState(0);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    const loadLikesCount = async () => {
      const count = await countReceivedLikes(currentUser.id);
      setLikesCount(count);
    };
    loadLikesCount();

    const unsubscribe = listenToReceivedLikes(currentUser.id, (likes) => {
      setLikesCount(likes.length);
    });

    // Trigger stat card animation after mount
    const timer = setTimeout(() => setAnimateStats(true), 100);

    return () => {
      if (unsubscribe) unsubscribe();
      clearTimeout(timer);
    };
  }, [currentUser.id]);

  const todayDate = new Date().toLocaleDateString('es-DO', { 
    weekday: 'long', 
    day: 'numeric',
    month: 'long'
  }).replace(/^./, (c) => c.toUpperCase());

  const location = currentUser.location || 'Santo Domingo';

  return (
    <div className="w-full h-full overflow-y-auto pb-24" style={{ background: 'linear-gradient(180deg, #fff8f5 0%, #ffffff 40%)' }}>

      {/* Header con saludo */}
      <div className="px-4 md:px-10 pt-5 pb-2 flex items-center gap-3">
        <div className="relative">
          <img 
            src={currentUser.images?.[0] || 'https://via.placeholder.com/80'} 
            alt={currentUser.name}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover shadow-lg"
            style={{ border: '3px solid #ff8052' }}
          />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg md:text-xl font-bold truncate text-slate-800">
            ¡Hola, {currentUser.name}! 👋
          </p>
          <p className="text-xs md:text-sm font-medium truncate" style={{ color: '#ff8052' }}>
            {todayDate} • {location}
          </p>
        </div>
      </div>

      {/* Banner Motivacional */}
      <div className="px-4 md:px-10 py-2">
        <div 
          className="rounded-2xl p-4 md:p-5 text-white relative overflow-hidden shadow-lg"
          style={{ background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)' }}
        >
          <div className="relative z-10">
            <p className="text-lg md:text-xl font-bold leading-tight mb-1.5">
              ¿Listo para encontrar quien ta' pa' ti?
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              <p className="text-sm font-medium opacity-90">
                {availableProfilesCount} personas nuevas hoy
              </p>
            </div>
            <button 
              onClick={onNavigateToDiscovery}
              className="bg-white text-orange-600 px-5 py-2 rounded-xl font-bold text-sm transition-transform active:scale-95 shadow-md"
            >
              Ver perfiles
            </button>
          </div>
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/15 rounded-full blur-2xl"></div>
          <div className="absolute right-4 top-3 text-4xl opacity-20">🔥</div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          DASHBOARD STATS - 3 tarjetas con métricas rápidas
          ═══════════════════════════════════════════════════ */}
      <div className="px-4 md:px-10 py-3">
        <div className="grid grid-cols-3 gap-3">
          {/* Stat: Matches */}
          <button
            onClick={onNavigateToMatches || onNavigateToMessages}
            className="relative overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-300 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)',
              opacity: animateStats ? 1 : 0,
              transform: animateStats ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: '0ms'
            }}
          >
            <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <p className="text-2xl font-extrabold text-white leading-none">{matchesCount}</p>
              <p className="text-[11px] font-semibold text-white/80 mt-0.5">Matches</p>
            </div>
          </button>

          {/* Stat: Likes Recibidos */}
          <button
            onClick={onNavigateToLikesReceived || onNavigateToDiscovery}
            className="relative overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-300 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
              opacity: animateStats ? 1 : 0,
              transform: animateStats ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: '80ms'
            }}
          >
            <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <p className="text-2xl font-extrabold text-white leading-none">{likesCount}</p>
              <p className="text-[11px] font-semibold text-white/80 mt-0.5">Likes</p>
            </div>
          </button>

          {/* Stat: Mensajes sin leer */}
          <button
            onClick={onNavigateToMessages}
            className="relative overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-300 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
              opacity: animateStats ? 1 : 0,
              transform: animateStats ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: '160ms'
            }}
          >
            <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5">
                <p className="text-2xl font-extrabold text-white leading-none">{unreadMessagesCount}</p>
                {unreadMessagesCount > 0 && (
                  <span className="flex h-2 w-2 rounded-full bg-yellow-300 animate-pulse"></span>
                )}
              </div>
              <p className="text-[11px] font-semibold text-white/80 mt-0.5">Sin leer</p>
            </div>
          </button>
        </div>
      </div>

      {/* Te Gustaron - CTA prominente */}
      {likesCount > 0 && onNavigateToLikesReceived && (
        <div className="px-4 md:px-10 py-2">
          <button
            onClick={onNavigateToLikesReceived}
            className="w-full p-4 rounded-2xl text-white shadow-lg transition-transform active:scale-[0.98] relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)' }}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-base">Te Gustaron</h3>
                  <p className="text-xs opacity-90">
                    {likesCount} {likesCount === 1 ? 'persona le gusta tu perfil' : 'personas les gusta tu perfil'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white text-pink-600 font-bold text-base px-3 py-1 rounded-full">
                  {likesCount}
                </div>
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          </button>
        </div>
      )}

      {/* Actividad Reciente */}
      <div className="px-4 md:px-10 py-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold tracking-tight text-slate-800">Actividad Reciente</h3>
          <button 
            onClick={onNavigateToMatches || onNavigateToMessages}
            className="text-xs font-bold" 
            style={{ color: '#ff8052' }}
          >
            Ver todo
          </button>
        </div>

        {recentMatches.length > 0 ? (
          <div className="space-y-2">
            {recentMatches.slice(0, 3).map((match) => (
              <div key={match.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                <div 
                  className="w-11 h-11 rounded-full shrink-0 bg-cover bg-center border-2 border-orange-100"
                  style={{ backgroundImage: `url('${match.images?.[0] || 'https://picsum.photos/seed/' + match.id + '/200/200'}')` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm truncate text-slate-800">{match.name}, {match.age}</span>
                    {match.isVerified && (
                      <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {match.location || 'Cerca de ti'}
                  </p>
                </div>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors"
                  style={{ backgroundColor: '#ff805212', color: '#ff8052' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-white rounded-2xl border border-black/5">
            <div 
              className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #ff805220, #ffc10720)' }}
            >
              <svg className="w-7 h-7" style={{ color: '#ff8052' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1 text-sm">¡Comienza a explorar!</h4>
            <p className="text-xs text-gray-500 mb-3 px-4">
              Descubre personas increíbles que ta' pa' ti
            </p>
            <button
              onClick={onNavigateToDiscovery}
              className="px-5 py-2 rounded-xl text-white font-semibold text-sm shadow-md transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #ff8052, #ffc107)' }}
            >
              Empezar a explorar
            </button>
          </div>
        )}
      </div>

      {/* Progreso del Perfil - Dinámico */}
      {(() => {
        // Calcular progreso real del perfil
        const checks = [
          { done: !!currentUser.name, label: 'Nombre' },
          { done: (currentUser.images?.length || 0) >= 1, label: 'Al menos 1 foto' },
          { done: (currentUser.images?.length || 0) >= 3, label: 'Agrega más fotos (3+) para destacar' },
          { done: !!currentUser.bio && currentUser.bio.length > 10, label: 'Escribe una bio que te represente' },
          { done: !!currentUser.location, label: 'Ubicación' },
          { done: (currentUser.interests?.length || 0) >= 2, label: 'Agrega al menos 2 intereses' },
          { done: !!currentUser.job, label: 'Agrega tu ocupación para más conexiones' },
          { done: !!currentUser.education, label: 'Agrega tu educación' },
          { done: !!currentUser.relationshipGoal, label: 'Define qué buscas en una relación' },
          { done: !!currentUser.gender, label: 'Género' },
        ];
        const completed = checks.filter(c => c.done).length;
        const percent = Math.round((completed / checks.length) * 100);
        const nextTip = checks.find(c => !c.done);
        const isComplete = percent === 100;

        return (
          <div className="px-4 md:px-10 py-2 pb-6">
            <div className="rounded-2xl p-4 md:p-5 bg-white border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-800">Perfil Completado</h3>
                  {isComplete && <span className="text-green-500 text-xs">✓</span>}
                </div>
                <span 
                  className="font-bold text-sm"
                  style={{ color: percent === 100 ? '#22c55e' : '#ff8052' }}
                >
                  {percent}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700 ease-out" 
                  style={{ 
                    background: percent === 100 
                      ? 'linear-gradient(90deg, #22c55e, #4ade80)' 
                      : 'linear-gradient(90deg, #ff8052, #ffc107)', 
                    width: animateStats ? `${percent}%` : '0%' 
                  }}
                />
              </div>
              {nextTip && (
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-amber-500 text-sm mt-0.5">💡</span>
                  <p className="text-xs text-gray-600">
                    {nextTip.label}
                  </p>
                </div>
              )}
              {isComplete && (
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-green-500 text-sm mt-0.5">🎉</span>
                  <p className="text-xs text-green-600 font-medium">
                    ¡Perfil completo! Tienes más visibilidad en Discovery.
                  </p>
                </div>
              )}
              <button
                onClick={onNavigateToProfile}
                className="w-full font-bold py-2.5 rounded-xl text-sm transition-all active:scale-[0.98]"
                style={{
                  border: '2px solid #ff8052',
                  color: '#ff8052',
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff8052';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#ff8052';
                }}
              >
                {isComplete ? 'Ver Perfil' : 'Completar Perfil'}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Home;
