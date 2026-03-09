import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProfile, Match } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import LazyImage from '../../components/LazyImage';
import { logger } from '../../utils/logger';
import StoriesRing from '../../components/StoriesRing';
import StoriesViewer from '../../components/StoriesViewer';
import CreateStoryModal from '../../components/CreateStoryModal';
import { StoryGroup } from '../../services/storiesService';

interface MatchesProps {
  matches?: Match[];
  onSelectMatch?: (match: Match) => void;
  onStartChat?: (userId: string) => void;
  onSendMessage?: (userId: string, message: string, type?: 'text' | 'story_reaction') => Promise<void>;
  currentUserId?: string;
}

const Matches: React.FC<MatchesProps> = ({
  matches,
  onSelectMatch,
  onStartChat,
  onSendMessage,
  currentUserId = 'demo-user'
}) => {
  const { t } = useLanguage();
  const [displayMatches, setDisplayMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Stories
  const [showStoriesViewer, setShowStoriesViewer] = useState(false);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState<StoryGroup | null>(null);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);

  useEffect(() => {
    // Simular carga de matches
    setTimeout(() => {
      // SOLO mostrar matches reales, NO usar mock data
      setDisplayMatches(matches || []);
      setLoading(false);
    }, 500);
  }, [matches]);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return `${days}d`;
    }
  };

  const handleMatchClick = (match: Match) => {
    if (onSelectMatch) {
      onSelectMatch(match);
    } else if (onStartChat) {
      onStartChat(match.user.id);
    }
  };
  
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Cargando matches...</h2>
        <p className="text-slate-600">Buscando tus conexiones</p>
      </div>
    );
  }

  if (displayMatches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center mb-6">
          <Heart className="text-white" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">¡Aún no tienes matches!</h2>
        <p className="text-slate-600 mb-6">Sigue explorando perfiles para encontrar tu conexión perfecta</p>
        <button
          onClick={() => window.location.hash = '#discovery'}
          className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
        >
          Explorar Perfiles
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Stories Section */}
      <div className="shrink-0 border-b border-gray-200 safe-area-top">
        <StoriesRing
          currentUserId={currentUserId}
          onStoryClick={handleStoryClick}
          onCreateStory={handleCreateStory}
        />
      </div>
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Matches</h1>
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full">
            <Sparkles className="text-orange-500" size={16} />
            <span className="text-sm font-semibold text-orange-600">
              {displayMatches.length}
            </span>
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20">
        <div className="grid grid-cols-3 gap-3">
          {displayMatches.map((match) => (
            <div
              key={match.id}
              onClick={() => handleMatchClick(match)}
              className="group relative flex flex-col gap-2 cursor-pointer active:scale-95 transition-transform duration-200"
            >
              {/* Card Image */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-200 shadow-md">
                <LazyImage
                  src={match.user.images[0]}
                  alt={match.user.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  rootMargin="100px"
                  onError={(error) => {
                    logger.match.warn('Error cargando imagen de match', { 
                      userName: match.user.name,
                      error 
                    });
                  }}
                />
                
                {/* Online Status */}
                <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                
                {/* Unread Badge */}
                {match.unreadCount && match.unreadCount > 0 && (
                  <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center shadow-lg">
                    {match.unreadCount}
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Quick Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMatchClick(match);
                  }}
                  className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                >
                  <MessageCircle className="text-rose-500" size={14} />
                </button>
              </div>
              
              {/* Card Info */}
              <div className="px-0.5">
                <div className="flex items-center gap-1 mb-0.5">
                  <h3 className="text-slate-800 text-sm font-bold leading-none truncate">
                    {match.user.name}, {match.user.age}
                  </h3>
                  {match.user.isVerified && (
                    <CheckCircle2 className="text-blue-500 flex-shrink-0" size={12} />
                  )}
                </div>
                
                <div className="flex items-center gap-0.5 text-slate-500 text-xs font-medium mb-1.5">
                  <MapPin size={10} className="flex-shrink-0" />
                  <span className="truncate">{match.user.location}</span>
                </div>
                
                {/* Interests */}
                <div className="flex gap-1 flex-wrap">
                  {Array.isArray(match.user.interests) && match.user.interests.slice(0, 1).map((interest, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-0.5 rounded-md bg-slate-200 text-[9px] font-semibold text-slate-600 truncate max-w-full"
                    >
                      {interest}
                    </span>
                  ))}
                  {Array.isArray(match.user.interests) && match.user.interests.length > 1 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-200 text-[9px] font-semibold text-slate-600">
                      +{match.user.interests.length - 1}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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

export default Matches;