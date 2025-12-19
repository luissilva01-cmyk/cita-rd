
import React, { useState } from 'react';
import { X, Heart, Star, RotateCcw, PartyPopper, Search } from 'lucide-react';
import ProfileCard from '../../../../components/components/ProfileCard';
import { UserProfile, Match } from '../../../../types';

interface DiscoveryProps {
  users: UserProfile[];
  onLike: (user: UserProfile) => boolean;
  onAction: (userId: string) => void;
  onOpenChat: (match: Match) => void;
}

const Discovery: React.FC<DiscoveryProps> = ({ users, onLike, onAction, onOpenChat }) => {
  const [showMatch, setShowMatch] = useState<Match | null>(null);

  const handleAction = (type: 'like' | 'nope') => {
    if (users.length === 0) return;
    const currentUser = users[0];
    
    if (type === 'like') {
      const isMatch = onLike(currentUser);
      if (isMatch) {
        setShowMatch({
          id: `match_${currentUser.id}`,
          user: currentUser,
          timestamp: Date.now()
        });
        return;
      }
    }
    onAction(currentUser.id);
  };

  if (users.length === 0 && !showMatch) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping scale-150"></div>
          <div className="absolute inset-0 bg-rose-500/10 rounded-full animate-ping scale-125 delay-75"></div>
          <div className="relative bg-gradient-to-tr from-orange-500 to-rose-600 w-24 h-24 rounded-full flex items-center justify-center shadow-xl">
            <Search className="text-white" size={40} />
          </div>
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-2">Buscando gente bacana...</h3>
        <p className="text-slate-500 text-sm max-w-[200px] mx-auto leading-relaxed">
          Estamos buscando nuevas personas cerca de ti en Santo Domingo.
        </p>
        <button className="mt-8 px-6 py-3 bg-slate-100 text-slate-600 rounded-full font-bold text-sm hover:bg-slate-200 transition-colors">
          Ampliar radio de búsqueda
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
      
      {/* Match Celebration Overlay */}
      {showMatch && (
        <div className="absolute inset-0 z-50 bg-rose-600/98 flex flex-col items-center justify-center p-8 text-white animate-in fade-in zoom-in duration-300">
          <div className="mb-6 bg-white/20 p-4 rounded-full backdrop-blur-md animate-bounce">
            <PartyPopper className="text-yellow-300" size={48} />
          </div>
          <h2 className="text-5xl font-black mb-2 text-center tracking-tighter">¡KLK! Match</h2>
          <p className="text-center opacity-90 mb-10 text-lg">A {showMatch.user.name} también le gustas.</p>
          
          <div className="flex gap-4 mb-12 relative">
            <div className="relative">
              <img src="https://picsum.photos/seed/me/200" className="w-24 h-24 rounded-full border-4 border-white shadow-2xl relative z-10" />
              <div className="absolute -inset-2 bg-rose-400/50 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 text-rose-600 shadow-xl z-20">
              <Heart size={24} fill="currentColor" />
            </div>
            <div className="relative">
              <img src={showMatch.user.images[0]} className="w-24 h-24 rounded-full border-4 border-white shadow-2xl relative z-10" />
              <div className="absolute -inset-2 bg-rose-400/50 rounded-full animate-pulse delay-75"></div>
            </div>
          </div>

          <button 
            onClick={() => {
              onOpenChat(showMatch);
              setShowMatch(null);
              onAction(showMatch.user.id);
            }}
            className="w-full py-4 bg-white text-rose-600 rounded-2xl font-black text-xl shadow-2xl active:scale-95 transition-transform"
          >
            Mandar un "Klk"
          </button>
          
          <button 
            onClick={() => {
              onAction(showMatch.user.id);
              setShowMatch(null);
            }}
            className="mt-6 text-white/70 font-bold uppercase tracking-widest text-xs"
          >
            Seguir buscando coro
          </button>
        </div>
      )}

      {/* Card Stack Area */}
      <div className="relative flex-1 mb-6 mt-2 z-10">
        {users.slice(0, 2).reverse().map((user, idx) => (
          <div key={user.id} className="absolute inset-0 transition-all duration-500" style={{ 
            transform: `scale(${1 - (idx * 0.04)}) translateY(${idx * 12}px)`,
            zIndex: 10 - idx,
            opacity: 1 - (idx * 0.5)
          }}>
            <ProfileCard user={user} />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center px-4 mb-4 z-10">
        <ActionButton 
          onClick={() => {}} 
          icon={<RotateCcw size={22} />} 
          color="text-yellow-500" 
          size="small"
        />
        <ActionButton 
          onClick={() => handleAction('nope')} 
          icon={<X size={32} />} 
          color="text-rose-500" 
          shadow="shadow-rose-100"
        />
        <ActionButton 
          onClick={() => {}} 
          icon={<Star size={22} />} 
          color="text-blue-500" 
          size="small"
        />
        <ActionButton 
          onClick={() => handleAction('like')} 
          icon={<Heart size={32} />} 
          color="text-emerald-500" 
          shadow="shadow-emerald-100"
        />
      </div>
    </div>
  );
};

const ActionButton = ({ icon, color, onClick, size = 'large', shadow = 'shadow-slate-100' }: any) => (
  <button 
    onClick={onClick}
    className={`
      ${size === 'large' ? 'w-16 h-16' : 'w-12 h-12'} 
      rounded-full bg-white flex items-center justify-center 
      ${color} shadow-xl ${shadow} border border-slate-50
      transition-all active:scale-90 hover:scale-105
    `}
  >
    {icon}
  </button>
);

export default Discovery;