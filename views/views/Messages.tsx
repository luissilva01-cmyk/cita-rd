import React from 'react';
import { MessageCircle, Clock } from 'lucide-react';
import { Match } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface MessagesProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
}

const Messages: React.FC<MessagesProps> = ({ matches, onSelectMatch }) => {
  const { t } = useLanguage();
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
  };

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-6">
          <MessageCircle className="text-white" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('noMatchesYet')}</h2>
        <p className="text-slate-600">{t('whenYouMatch')}</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">{t('messages')}</h2>
        <p className="text-slate-600 text-sm">{t('matchesCount', { count: matches.length.toString() })}</p>
      </div>

      {/* Matches List */}
      <div className="flex-1 overflow-y-auto">
        {matches.map((match) => (
          <button
            key={match.id}
            onClick={() => onSelectMatch(match)}
            className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors border-b border-slate-50"
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={match.user.images[0]}
                alt={match.user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              {match.unreadCount && match.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{match.unreadCount}</span>
                </div>
              )}
            </div>

            {/* Message Info */}
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-slate-800">{match.user.name}</h3>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock size={12} />
                  <span className="text-xs">{formatTime(match.timestamp)}</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 truncate">
                {match.lastMessage || t('newMatch')}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Messages;