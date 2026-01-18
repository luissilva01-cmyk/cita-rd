import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Clock, MapPin, Sparkles } from 'lucide-react';
import { UserProfile, Match } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface MatchesProps {
  matches?: Match[];
  onSelectMatch?: (match: Match) => void;
  onStartChat?: (userId: string) => void;
  currentUserId?: string;
}

// Mock matches data
const MOCK_MATCHES: Match[] = [
  {
    id: 'match-1',
    user: {
      id: '1',
      name: 'Carolina',
      age: 24,
      bio: 'Amo el mofongo y bailar bachata en la Zona Colonial. Busco a alguien para ir de aventura a Samaná.',
      location: 'Santo Domingo',
      distance: '3km',
      images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=95&w=1200&h=1600'],
      interests: ['Bachata', 'Playa', 'Gastronomía'],
      job: 'Arquitecta',
      isVerified: true
    },
    lastMessage: '¡Hola! Me gustó tu perfil 😊',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutos atrás
    unreadCount: 2
  },
  {
    id: 'match-2',
    user: {
      id: '3',
      name: 'Isabella',
      age: 26,
      bio: 'Doctora apasionada por ayudar a otros. Me encanta la salsa y los atardeceres en el Malecón.',
      location: 'Santo Domingo',
      distance: '5km',
      images: ['https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=95&w=1200&h=1600'],
      interests: ['Medicina', 'Salsa', 'Fotografía'],
      job: 'Doctora',
      isVerified: true
    },
    lastMessage: 'Gracias por el match! ¿Cómo estás?',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 horas atrás
    unreadCount: 0
  },
  {
    id: 'match-3',
    user: {
      id: '6',
      name: 'Diego',
      age: 30,
      bio: 'Ingeniero y surfista. Los fines de semana me encuentras en las playas de Cabarete.',
      location: 'Puerto Plata',
      distance: '25km',
      images: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=95&w=1200&h=1600'],
      interests: ['Surf', 'Ingeniería', 'Aventura'],
      job: 'Ingeniero',
      isVerified: true
    },
    lastMessage: 'Nuevo match',
    timestamp: Date.now() - 1000 * 60 * 60 * 6, // 6 horas atrás
    unreadCount: 0
  }
];

const Matches: React.FC<MatchesProps> = ({
  matches,
  onSelectMatch,
  onStartChat,
  currentUserId = 'demo-user'
}) => {
  const { t } = useLanguage();
  const [displayMatches, setDisplayMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de matches
    setTimeout(() => {
      setDisplayMatches(matches && matches.length > 0 ? matches : MOCK_MATCHES);
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
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 safe-area-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Matches</h1>
            <p className="text-sm text-slate-600">{displayMatches.length} conexiones</p>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="text-orange-500" size={20} />
            <span className="text-sm font-medium text-orange-600">
              {displayMatches.filter(m => m.unreadCount && m.unreadCount > 0).length} nuevos
            </span>
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {displayMatches.map((match) => (
            <div
              key={match.id}
              onClick={() => handleMatchClick(match)}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
            >
              <div className="flex items-center space-x-4">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={match.user.images[0]}
                      alt={match.user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face';
                      }}
                    />
                  </div>
                  
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  
                  {/* Unread badge */}
                  {match.unreadCount && match.unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {match.unreadCount}
                    </div>
                  )}
                </div>

                {/* Match Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800 truncate">
                      {match.user.name}, {match.user.age}
                    </h3>
                    {match.user.isVerified && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                    <MapPin size={12} />
                    <span>{match.user.location}</span>
                    {match.user.distance && (
                      <>
                        <span>•</span>
                        <span>{match.user.distance}</span>
                      </>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-600 truncate">
                    {match.lastMessage}
                  </p>
                </div>

                {/* Time and Action */}
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={12} />
                    <span>{formatTimeAgo(match.timestamp)}</span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMatchClick(match);
                    }}
                    className="p-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full hover:shadow-lg transition-all"
                  >
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>

              {/* Interests Preview */}
              <div className="mt-3 flex flex-wrap gap-1">
                {match.user.interests.slice(0, 3).map((interest, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium"
                  >
                    {interest}
                  </span>
                ))}
                {match.user.interests.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    +{match.user.interests.length - 3}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;