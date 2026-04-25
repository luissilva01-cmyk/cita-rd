import React, { useState, useEffect } from 'react';
import { MessageCircle, Clock } from 'lucide-react';
import { Match } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { listenToTypingStatus } from '../../services/chatService';
import LazyImage from '../../components/LazyImage';
import { logger } from '../../utils/logger';
import { useUnreadMessages } from '../../hooks/useUnreadMessages';
import StoriesRing from '../../components/StoriesRing';
import StoriesViewer from '../../components/StoriesViewer';
import CreateStoryModal from '../../components/CreateStoryModal';
import { StoryGroup } from '../../services/storiesService';

interface MessagesProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  onSendMessage?: (userId: string, message: string, type?: 'text' | 'story_reaction') => Promise<void>;
  currentUserId: string;
}

const Messages: React.FC<MessagesProps> = ({ matches, onSelectMatch, onSendMessage, currentUserId }) => {
  const { t } = useLanguage();
  
  // Track typing status for each chat
  const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});
  
  // Get unread counts for each chat
  const { unreadCounts } = useUnreadMessages(currentUserId);
  
  // Estados para Stories
  const [showStoriesViewer, setShowStoriesViewer] = useState(false);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState<StoryGroup | null>(null);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
  
  // Listen to typing status for all chats
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];
    
    matches.forEach((match) => {
      // Listen to the other user's typing status
      const unsubscribe = listenToTypingStatus(match.id, match.user.id, (isTyping) => {
        setTypingStatus(prev => ({
          ...prev,
          [match.id]: isTyping
        }));
      });
      
      unsubscribers.push(unsubscribe);
    });
    
    // Cleanup all listeners on unmount
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [matches]);
  
  // Funciones para Stories
  const handleStoryClick = (storyGroup: StoryGroup) => {
    setSelectedStoryGroup(storyGroup);
    setShowStoriesViewer(true);
  };

  const handleCreateStory = () => {
    setShowCreateStoryModal(true);
  };

  const handleStoryCreated = () => {
    // Stories se actualizan automáticamente via listener en tiempo real
  };

  const handleCloseStoriesViewer = () => {
    setShowStoriesViewer(false);
    setSelectedStoryGroup(null);
  };
  
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
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#121212] dark:to-[#1a1a1a] transition-colors">
      {/* Stories Section */}
      <div className="shrink-0 border-b border-gray-200 safe-area-top">
        <StoriesRing
          currentUserId={currentUserId}
          onStoryClick={handleStoryClick}
          onCreateStory={handleCreateStory}
        />
      </div>
      
      {/* Header - Responsive */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-1">Mensajes</h3>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">{t('matchesCount', { count: matches.length.toString() })}</p>
      </div>

      {/* Matches List - Responsive */}
      <div className="flex-1 overflow-y-auto safe-area-bottom">
        {matches.map((match) => (
          <button
            key={match.id}
            onClick={() => onSelectMatch(match)}
            className="w-full p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-50 dark:border-slate-800 min-h-[72px]"
          >
            {/* Avatar - Responsive with lazy loading */}
            <div className="relative flex-shrink-0">
              <LazyImage
                src={match.user.images[0]}
                alt={match.user.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full profile-image-smart"
                rootMargin="150px"
                onError={(error) => {
                  logger.chat.warn('Error cargando avatar en lista de mensajes', {
                    userName: match.user.name,
                    error
                  });
                }}
              />
              {/* Badge de mensajes no leídos - estilo WhatsApp/Telegram */}
              {unreadCounts[match.id] && unreadCounts[match.id] > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-[10px] sm:text-xs font-bold">
                    {unreadCounts[match.id] > 99 ? '99+' : unreadCounts[match.id]}
                  </span>
                </div>
              )}
            </div>

            {/* Message Info - Responsive */}
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base truncate">{match.user.name}</h3>
                <div className="flex items-center gap-1 text-slate-400 flex-shrink-0 ml-2">
                  <Clock size={10} className="sm:w-3 sm:h-3" />
                  <span className="text-[10px] sm:text-xs">{formatTime(match.timestamp)}</span>
                </div>
              </div>
              
              {/* Show typing indicator or last message */}
              {typingStatus[match.id] ? (
                <div className="flex items-center gap-1 text-emerald-500">
                  <span className="text-xs sm:text-sm font-medium">{t('typing')}</span>
                  <div className="flex gap-0.5">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                  {match.lastMessage || t('newMatch')}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
      
      {/* Stories Viewer */}
      <StoriesViewer
        isOpen={showStoriesViewer}
        storyGroup={selectedStoryGroup}
        currentUserId={currentUserId}
        onClose={handleCloseStoriesViewer}
        onSendMessage={onSendMessage}
      />
      
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

export default Messages;