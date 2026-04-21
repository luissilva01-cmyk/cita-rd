import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, X, Lock, Crown, ArrowLeft, Clock } from 'lucide-react';
import { ReceivedLike, getReceivedLikes, listenToReceivedLikes } from '../../services/likesService';
import { logger } from '../../utils/logger';
import { UserProfile } from '../../types';

const FREE_LIKES_VISIBLE = 2; // Likes visibles sin Premium

interface LikesReceivedProps {
  currentUserId: string;
  onLike: (user: UserProfile) => Promise<boolean>;
  onPass: (userId: string) => void;
  onBack: () => void;
  isPremium?: boolean;
}

const LikesReceived: React.FC<LikesReceivedProps> = ({
  currentUserId,
  onLike,
  onPass,
  onBack,
  isPremium = false
}) => {
  const [likes, setLikes] = useState<ReceivedLike[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLike, setSelectedLike] = useState<ReceivedLike | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    const loadLikes = async () => {
      setLoading(true);
      const receivedLikes = await getReceivedLikes(currentUserId);
      setLikes(receivedLikes);
      setLoading(false);
    };

    loadLikes();

    const unsubscribe = listenToReceivedLikes(currentUserId, (updatedLikes) => {
      setLikes(updatedLikes);
      setLoading(false);
    });

    return () => { if (unsubscribe) unsubscribe(); };
  }, [currentUserId]);

  const handleLike = async (like: ReceivedLike) => {
    if (!like.fromUser) return;
    const isMatch = await onLike(like.fromUser);
    if (isMatch) {
      logger.match.success('¡Match desde likes recibidos!', { userId: like.fromUserId });
    }
    setLikes(prev => prev.filter(l => l.id !== like.id));
    setSelectedLike(null);
  };

  const handlePass = (like: ReceivedLike) => {
    onPass(like.fromUserId);
    setLikes(prev => prev.filter(l => l.id !== like.id));
    setSelectedLike(null);
  };

  const canViewLike = (index: number) => isPremium || index < FREE_LIKES_VISIBLE;

  const handleCardClick = (like: ReceivedLike, index: number) => {
    if (canViewLike(index)) {
      setSelectedLike(like);
    } else {
      setShowPremiumModal(true);
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `hace ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `hace ${days}d`;
    return `hace ${Math.floor(days / 7)}sem`;
  };

  // ─── LOADING ───
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fff5f0 0%, #fff0e6 100%)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando likes...</p>
        </div>
      </div>
    );
  }

  // ─── EMPTY STATE ───
  if (likes.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #fff5f0 0%, #fff0e6 100%)' }}>
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #ff8052, #ffc107)' }}>
            <Heart className="text-white" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Todavía no tienes likes</h2>
          <p className="text-gray-600 mb-6">Sigue explorando y mejora tu perfil para recibir más atención</p>
          <button onClick={onBack} className="px-6 py-3 text-white rounded-full font-semibold shadow-lg" style={{ background: 'linear-gradient(135deg, #ff8052, #ffc107)' }}>
            Volver a explorar
          </button>
        </div>
      </div>
    );
  }

  // ─── DETAIL VIEW (selected like) ───
  if (selectedLike && selectedLike.fromUser) {
    const user = selectedLike.fromUser;
    return (
      <div className="w-full h-full flex flex-col" style={{ background: 'linear-gradient(135deg, #fff5f0 0%, #fff0e6 100%)' }}>
        <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <button onClick={() => setSelectedLike(null)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Heart className="text-pink-500" size={20} />
            <h1 className="text-lg font-bold">Te dio like</h1>
          </div>
          <div className="w-10" />
        </div>

        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <div className="relative w-full max-w-md h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${user.images?.[0] || ''}')`, backgroundColor: '#e5e7eb' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {selectedLike.isSuperLike && (
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <Sparkles size={16} /><span className="text-sm font-bold">Super Like</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-3xl font-bold">{user.name}, {user.age}</h2>
                {user.isVerified && <span className="text-blue-400">✓</span>}
              </div>
              {user.location && <p className="text-sm mb-3 opacity-80">📍 {user.location}</p>}
              {user.bio && <p className="text-sm opacity-90 line-clamp-3 mb-4">{user.bio}</p>}
              {user.interests && user.interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {user.interests.slice(0, 4).map((interest, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">{interest}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 px-4 py-6 bg-white/80 backdrop-blur-md border-t border-gray-200">
          <button onClick={() => handlePass(selectedLike)} className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
            <X className="text-red-500" size={32} />
          </button>
          <button onClick={() => handleLike(selectedLike)} className="w-20 h-20 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95" style={{ background: 'linear-gradient(135deg, #f43f5e, #ff8052)' }}>
            <Heart className="text-white fill-white" size={36} />
          </button>
        </div>
      </div>
    );
  }

  // ─── GRID VIEW (main) ───
  const lockedCount = Math.max(0, likes.length - FREE_LIKES_VISIBLE);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'linear-gradient(135deg, #fff5f0 0%, #fff0e6 100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Heart className="text-pink-500" size={20} />
          <h1 className="text-lg font-bold">Te dieron Like</h1>
        </div>
        <div className="text-sm font-semibold text-gray-500">{likes.length}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Stats Banner */}
        <div className="rounded-2xl p-5 mb-4 text-center" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.1), rgba(255,128,82,0.08))', border: '1px solid rgba(244,63,94,0.15)' }}>
          <div className="text-4xl font-bold mb-1" style={{ background: 'linear-gradient(90deg, #f43f5e, #ffc107)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {likes.length}
          </div>
          <p className="text-gray-600 text-sm">
            {likes.length === 1 ? 'persona quiere conocerte' : 'personas quieren conocerte'}
          </p>
          {!isPremium && lockedCount > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              🔒 {lockedCount} {lockedCount === 1 ? 'perfil bloqueado' : 'perfiles bloqueados'}
            </p>
          )}
        </div>

        {/* Likes Grid */}
        <div className="grid grid-cols-2 gap-3">
          {likes.map((like, index) => {
            const isLocked = !canViewLike(index);
            const user = like.fromUser;
            if (!user) return null;

            return (
              <div
                key={like.id}
                onClick={() => handleCardClick(like, index)}
                className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  aspectRatio: '3/4',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                }}
              >
                {/* Photo */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${user.images?.[0] || ''}')`,
                    backgroundColor: '#e5e7eb',
                    filter: isLocked ? 'blur(16px) brightness(0.7)' : 'none'
                  }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Time badge */}
                <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-medium" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
                  <Clock size={10} />
                  {getTimeAgo(like.timestamp)}
                </div>

                {/* Super Like badge */}
                {like.isSuperLike && !isLocked && (
                  <div className="absolute top-2 left-2 z-10 bg-blue-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles size={10} />
                    <span className="text-[10px] font-bold">Super</span>
                  </div>
                )}

                {/* Lock overlay for premium */}
                {isLocked && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                      <Lock size={22} className="text-white" />
                    </div>
                    <span className="text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'linear-gradient(135deg, #ff8052, #ffc107)' }}>
                      Premium
                    </span>
                  </div>
                )}

                {/* User info at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                  <p className="text-white font-bold text-sm truncate">
                    {isLocked ? '???' : `${user.name?.split(' ')[0]}, ${user.age}`}
                  </p>
                  <p className="text-white/60 text-xs truncate">
                    {isLocked ? 'Desbloquear con Premium' : (user.location || '')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium CTA (only if there are locked likes) */}
        {!isPremium && lockedCount > 0 && (
          <div className="mt-5 mb-8">
            <button
              onClick={() => setShowPremiumModal(true)}
              className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #ff8052, #ffc107)' }}
            >
              <Crown size={20} />
              Ver todos con Ta' Pa' Ti Plus
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">
              Descubre quién te dio like y haz match al instante
            </p>
          </div>
        )}
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowPremiumModal(false)}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-5">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff8052, #ffc107)' }}>
                <Crown size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Ta' Pa' Ti Plus</h3>
              <p className="text-gray-500 text-sm mt-1">Desbloquea todo el potencial</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-lg">❤️</span>
                <span className="text-gray-700">Ver quién te dio like</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-lg">⭐</span>
                <span className="text-gray-700">Super likes ilimitados</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-lg">🔥</span>
                <span className="text-gray-700">Swipes ilimitados por día</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-lg">🚀</span>
                <span className="text-gray-700">Boost de perfil semanal</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-lg">↩️</span>
                <span className="text-gray-700">Rewind — deshacer último swipe</span>
              </div>
            </div>

            <button
              className="w-full py-3.5 rounded-full text-white font-bold text-base shadow-lg"
              style={{ background: 'linear-gradient(135deg, #ff8052, #ffc107)' }}
              onClick={() => {
                setShowPremiumModal(false);
                // TODO: Integrar Stripe / pasarela de pago
                alert('Próximamente: Integración de pagos con Stripe');
              }}
            >
              Obtener Plus — RD$299/mes
            </button>
            <button
              onClick={() => setShowPremiumModal(false)}
              className="w-full py-2.5 mt-2 text-gray-400 text-sm font-medium"
            >
              Ahora no
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LikesReceived;
