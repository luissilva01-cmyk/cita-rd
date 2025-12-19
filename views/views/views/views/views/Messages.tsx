
import React from 'react';
import { Search, ShieldCheck, Heart } from 'lucide-react';
import { Match } from '../../../../../types';

interface MessagesProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
}

const Messages: React.FC<MessagesProps> = ({ matches, onSelectMatch }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar matches..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-rose-500/20 outline-none text-sm"
          />
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-300 mb-4">
            <Heart size={32} />
          </div>
          <h3 className="font-bold text-slate-700">Aún no tienes matches</h3>
          <p className="text-sm text-slate-400 mt-2">¡Sigue deslizando en Descubrimiento para conectar con alguien!</p>
        </div>
      ) : (
        <>
          <div className="px-6 mb-6">
            <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-4">Nuevos Matches</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {matches.filter(m => !m.lastMessage || m.lastMessage.includes('¡Haz hecho un match')).map(match => (
                <div 
                  key={match.id} 
                  onClick={() => onSelectMatch(match)}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="relative">
                    <img 
                      src={match.user.images[0]} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-rose-500 p-0.5"
                      alt={match.user.name}
                    />
                    {match.user.isVerified && (
                      <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
                        <ShieldCheck size={14} className="text-blue-500 fill-blue-500/10" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{match.user.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6">
            <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-4">Mensajes</h3>
            <div className="flex flex-col">
              {matches.map(match => (
                <div 
                  key={match.id} 
                  onClick={() => onSelectMatch(match)}
                  className="flex items-center gap-4 py-3 border-b border-slate-50 active:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <img 
                    src={match.user.images[0]} 
                    className="w-14 h-14 rounded-full object-cover"
                    alt={match.user.name}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-900 flex items-center gap-1">
                        {match.user.name}
                        {match.user.isVerified && <ShieldCheck size={12} className="text-blue-500" />}
                      </h4>
                      <span className="text-[10px] text-slate-400">Ahora</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-slate-500 truncate pr-4 group-hover:text-slate-600 italic">
                        {match.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Messages;