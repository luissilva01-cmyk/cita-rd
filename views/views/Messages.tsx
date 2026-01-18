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
      <div className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-4 sm:mb-6">
          <MessageCircle className="text-white" size={32} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">{t('noMatchesYet')}</h2>
        <p className="text-slate-600 text-sm sm:text-base">{t('whenYouMatch')}</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header - Responsive */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 safe-area-top">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t('messages')}</h2>
        <p className="text-slate-600 text-xs sm:text-sm">{t('matchesCount', { count: matches.length.toString() })}</p>
      </div>

      {/* Matches List - Responsive */}
      <div className="flex-1 overflow-y-auto safe-area-bottom">
        {matches.map((match) => (
          <button
            key={match.id}
            onClick={() => onSelectMatch(match)}
            className="w-full p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-slate-50 transition-colors border-b border-slate-50 min-h-[72px]"
          >
            {/* Avatar - Responsive */}
            <div className="relative flex-shrink-0">
              <img
                src={match.user.images[0]}
                alt={match.user.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full profile-image-smart"
              />
              {match.unreadCount && match.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-rose-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] sm:text-xs font-bold">{match.unreadCount}</span>
                </div>
              )}
            </div>

            {/* Message Info - Responsive */}
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-slate-800 text-sm sm:text-base truncate">{match.user.name}</h3>
                <div className="flex items-center gap-1 text-slate-400 flex-shrink-0 ml-2">
                  <Clock size={10} className="sm:w-3 sm:h-3" />
                  <span className="text-[10px] sm:text-xs">{formatTime(match.timestamp)}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 truncate">
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