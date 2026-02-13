import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, X, Check } from 'lucide-react';
import { ReceivedLike, getReceivedLikes, listenToReceivedLikes } from '../../services/likesService';
import { logger } from '../../utils/logger';
import { UserProfile } from '../../types';

interface LikesReceivedProps {
  currentUserId: string;
  onLike: (user: UserProfile) => Promise<boolean>;
  onPass: (userId: string) => void;
  onBack: () => void;
}

const LikesReceived: React.FC<LikesReceivedProps> = ({
  currentUserId,
  onLike,
  onPass,
  onBack
}) => {
  const [likes, setLikes] = useState<ReceivedLike[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // Cargar likes iniciales
    const loadLikes = async () => {
      setLoading(true);
      const receivedLikes = await getReceivedLikes(currentUserId);
      setLikes(receivedLikes);
      setLoading(false);
    };

    loadLikes();

    // Listener en tiempo real
    const unsubscribe = listenToReceivedLikes(currentUserId, (updatedLikes) => {
      setLikes(updatedLikes);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUserId]);

  const handleLike = async () => {
    const currentLike = likes[selectedIndex];
    if (!currentLike?.fromUser) return;

    const isMatch = await onLike(currentLike.fromUser);
    
    if (isMatch) {
      // Mostrar animación de match
      logger.match.success('¡Match desde likes recibidos!', { 
        userId: currentLike.fromUserId 
      });
    }

    // Avanzar al siguiente
    if (selectedIndex < likes.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else {
      // No hay más likes, volver
      onBack();
    }
  };

  const handlePass = () => {
    const currentLike = likes[selectedIndex];
    if (!currentLike) return;

    onPass(currentLike.fromUserId);

    // Avanzar al siguiente
    if (selectedIndex < likes.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else {
      // No hay más likes, volver
      onBack();
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando likes...</p>
        </div>
      </div>
    );
  }

  if (likes.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50 p-6">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-400 to-orange-400 flex items-center justify-center mx-auto mb-6">
            <Heart className="text-white" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Todavía no tienes likes
          </h2>
          <p className="text-gray-600 mb-6">
            Sigue explorando y mejora tu perfil para recibir más atención
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Volver a explorar
          </button>
        </div>
      </div>
    );
  }

  const currentLike = likes[selectedIndex];
  const currentUser = currentLike?.fromUser;

  if (!currentUser) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-600">Error cargando perfil</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-pink-50 to-orange-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <Heart className="text-pink-500" size={20} />
          <h1 className="text-lg font-bold">Te Gustaron</h1>
        </div>
        <div className="text-sm font-semibold text-gray-600">
          {selectedIndex + 1} / {likes.length}
        </div>
      </div>

      {/* Profile Card */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="relative w-full max-w-md h-[600px] rounded-2xl overflow-hidden shadow-2xl">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${currentUser.images?.[0] || 'https://picsum.photos/seed/' + currentUser.id + '/600/800'}')`
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Super Like Badge */}
          {currentLike.isSuperLike && (
            <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Sparkles size={16} />
              <span className="text-sm font-bold">Super Like</span>
            </div>
          )}

          {/* User Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl font-bold">
                {currentUser.name}, {currentUser.age}
              </h2>
              {currentUser.isVerified && (
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              )}
            </div>

            {currentUser.location && (
              <div className="flex items-center gap-1 text-sm mb-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>{currentUser.location}</span>
              </div>
            )}

            {currentUser.bio && (
              <p className="text-sm opacity-90 line-clamp-3 mb-4">
                {currentUser.bio}
              </p>
            )}

            {currentUser.interests && currentUser.interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.slice(0, 3).map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 px-4 py-6 bg-white/80 backdrop-blur-md border-t border-gray-200">
        <button
          onClick={handlePass}
          className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        >
          <X className="text-red-500" size={32} />
        </button>

        <button
          onClick={handleLike}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        >
          <Heart className="text-white fill-white" size={36} />
        </button>
      </div>
    </div>
  );
};

export default LikesReceived;
