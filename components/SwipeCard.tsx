import React, { useState, useEffect } from 'react';
import { MapPin, ShieldCheck, Heart, X, Brain } from 'lucide-react';
import { UserProfile } from '../types';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import VerificationBadge from './VerificationBadge';
import CompatibilityIndicator from './CompatibilityIndicator';
import { verificationService } from '../services/verificationService';
import { useLanguage } from '../contexts/LanguageContext';
import { useMatchingAI } from '../hooks/useMatchingAI';
import { CompatibilityScore } from '../services/matchingAI';

interface SwipeCardProps {
  user: UserProfile;
  currentUser: UserProfile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop?: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ 
  user, 
  currentUser,
  onSwipeLeft, 
  onSwipeRight, 
  isTop = false 
}) => {
  const { t } = useLanguage();
  const { calculateCompatibility } = useMatchingAI();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [compatibility, setCompatibility] = useState<CompatibilityScore | null>(null);
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [swipeStartTime, setSwipeStartTime] = useState<number>(Date.now());
  
  const { handlers, transform, opacity, swipeDirection, isDragging } = useSwipeGesture({
    onSwipeLeft: () => {
      const timeSpent = Date.now() - swipeStartTime;
      console.log('👈 Swipe left en', user.name, 'tiempo:', timeSpent + 'ms');
      onSwipeLeft();
    },
    onSwipeRight: () => {
      const timeSpent = Date.now() - swipeStartTime;
      console.log('👉 Swipe right en', user.name, 'tiempo:', timeSpent + 'ms');
      onSwipeRight();
    },
    threshold: 80 // Reducir threshold para mayor sensibilidad
  });

  // Calcular compatibilidad al cargar el componente
  useEffect(() => {
    const loadCompatibility = async () => {
      try {
        const score = await calculateCompatibility(currentUser, user);
        setCompatibility(score);
      } catch (error) {
        console.error('Error calculando compatibilidad:', error);
      }
    };

    loadCompatibility();
    setSwipeStartTime(Date.now()); // Resetear tiempo cuando se carga nueva card
  }, [user.id, currentUser.id, calculateCompatibility]);

  const handleImageError = () => {
    console.log('❌ Error cargando imagen para:', user.name);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log('✅ Imagen cargada para:', user.name);
    setImageLoading(false);
    setImageError(false);
  };

  // Generar avatar de fallback
  const getAvatarUrl = () => {
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', 'FFB347'];
    const colorIndex = user.name.length % colors.length;
    const bgColor = colors[colorIndex];
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=600&background=${bgColor}&color=ffffff&bold=true&format=png`;
  };

  return (
    <div
      onMouseDown={handlers.onMouseDown}
      onTouchStart={handlers.onTouchStart}
      onTouchMove={handlers.onTouchMove}
      onTouchEnd={handlers.onTouchEnd}
      className={`absolute inset-0 cursor-grab ${isDragging ? 'cursor-grabbing' : ''} ${
        isTop ? 'z-20' : 'z-10'
      }`}
      style={{
        transform,
        opacity,
        transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      <div className="relative h-full bg-white rounded-3xl shadow-xl overflow-hidden select-none">
          {/* Compatibility Indicator - Solo si hay compatibilidad calculada */}
          {compatibility && (
            <div className="absolute top-4 left-4 z-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCompatibility(!showCompatibility);
                }}
                className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
              >
                <Brain className="w-5 h-5 text-purple-600" />
              </button>
              
              {showCompatibility && (
                <div className="absolute top-12 left-0 bg-white rounded-xl shadow-xl p-4 w-80 z-40 border">
                  <CompatibilityIndicator 
                    compatibility={compatibility}
                    showDetails={true}
                    size="md"
                  />
                </div>
              )}
            </div>
          )}

          {/* Swipe Indicators */}
        {isDragging && swipeDirection && (
          <>
            {/* Like Indicator */}
            {swipeDirection === 'right' && (
              <div className="absolute top-8 right-8 z-30 bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg transform rotate-12">
                <Heart className="inline mr-2" size={20} />
                {t('likeButton').toUpperCase()}
              </div>
            )}
            
            {/* Pass Indicator */}
            {swipeDirection === 'left' && (
              <div className="absolute top-8 left-8 z-30 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg transform -rotate-12">
                <X className="inline mr-2" size={20} />
                {t('passButton').toUpperCase()}
              </div>
            )}
          </>
        )}

        {/* Image */}
        <div className="relative h-full">
          {/* Loading placeholder */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
          )}
          
          {/* Main image or avatar fallback */}
          <img 
            src={imageError ? getAvatarUrl() : user.images[0]} 
            alt={user.name}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
          
          {/* Error state with custom avatar */}
          {imageError && !imageLoading && (
            <div className="absolute inset-0 bg-linear-to-br from-rose-400 to-pink-500 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl font-bold mb-2">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="text-lg font-medium">{user.name}</div>
              </div>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/70" />
          
          {/* Profile Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl font-bold">{user.name}, {user.age}</h2>
              <VerificationBadge 
                isVerified={user.isVerified || false} 
                verificationLevel="basic"
                size="md"
              />
              {/* Compatibility Badge */}
              {compatibility && (
                <div className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                  compatibility.overall >= 0.8 ? 'bg-green-500 text-white' :
                  compatibility.overall >= 0.6 ? 'bg-yellow-500 text-white' :
                  compatibility.overall >= 0.4 ? 'bg-orange-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  <Heart className="w-3 h-3" />
                  {Math.round(compatibility.overall * 100)}%
                </div>
              )}
              {/* Profile Score Badge */}
              {(user as any).profileScore && (user as any).profileScore >= 80 && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  ⭐ TOP
                </div>
              )}
              {(user as any).visibilityBoost && (user as any).visibilityBoost > 1.5 && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  🔥 HOT
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1 mb-3 text-white/90">
              <MapPin size={16} />
              <span className="text-sm">{user.location} • {user.distance}</span>
            </div>
            
            <p className="text-sm text-white/90 mb-4 line-clamp-3">{user.bio}</p>
            
            {/* Interests */}
            <div className="flex flex-wrap gap-2">
              {user.interests.slice(0, 3).map((interest, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;