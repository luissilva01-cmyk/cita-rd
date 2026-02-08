import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import { useLanguage } from '../contexts/LanguageContext';
import { storiesService, StoryGroup } from '../services/storiesService';

interface Story {
  id: string;
  userId: string;
  type: 'image' | 'text';
  content: string;
  backgroundColor?: string;
  textColor?: string;
  createdAt: Date;
  expiresAt: Date;
  viewedBy: string[];
}

interface StoriesRingWorkingProps {
  currentUserId: string;
  onStoryClick?: (storyGroup: StoryGroup) => void;
  onCreateStory?: () => void;
  compact?: boolean;
}

const StoriesRingWorking: React.FC<StoriesRingWorkingProps> = ({ 
  currentUserId, 
  onStoryClick, 
  onCreateStory,
  compact = false
}) => {
  const { t } = useLanguage();
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [storiesKey, setStoriesKey] = useState(0);

  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      
      try {
        // Cargar stories reales desde el servicio
        const groups = await storiesService.getStoryGroups(currentUserId);
        
        setStoryGroups(groups);
        
        // Verificar si el usuario actual tiene stories
        const hasOwnStories = groups.some(g => g.userId === currentUserId);
        
        setIsVerified(Math.random() > 0.5); // Simulamos verificación aleatoria
        
      } catch (error) {
        setStoryGroups([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadStories();
  }, [currentUserId, storiesKey]);

  const handleStoryClick = (storyGroup: StoryGroup) => {
    if (onStoryClick) {
      onStoryClick(storyGroup);
    } else {
      alert(`🎬 Ver Stories de ${storyGroup.user.name}\n\n📱 ${storyGroup.stories.length} stories disponibles\n⏰ Última actualización: ${storyGroup.lastUpdated.toLocaleTimeString()}\n\n✨ ¡Sistema de Stories funcionando!`);
    }
  };

  const handleCreateStory = () => {
    if (onCreateStory) {
      onCreateStory();
    } else {
      alert('📸 ¡Crear Story!\n\n🎨 Opciones disponibles:\n• Foto desde cámara\n• Foto desde galería\n• Story de texto\n• Story con música\n\n✅ Modal de creación listo!');
    }
  };

  const handlePrivacyUpdated = () => {
    // Recargar stories para aplicar nuevos filtros
    setStoriesKey(prev => prev + 1);
  };
  
  // Función pública para recargar stories (puede ser llamada desde el padre)
  const reloadStories = () => {
    setStoriesKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="bg-white">
        <div className="flex gap-3 p-4 justify-start overflow-x-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-16 h-3 bg-gray-200 rounded mt-1 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Layout optimizado con Stories + Configuración */}
      <div className={`flex gap-3 ${compact ? 'p-2' : 'p-4'} justify-start overflow-x-auto`}>
        
        {/* Mi story / Crear story - Solo mostrar si no es compacto */}
        {!compact && (
          <div className="flex-shrink-0 text-center">
            <button
              onClick={handleCreateStory}
              className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-rose-500 hover:scale-105 transition-transform shadow-lg"
            >
              <div className="w-full h-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                <Plus size={20} className="text-white" />
              </div>
              
              {/* Badge de verificación si está verificado */}
              {isVerified && (
                <div className="absolute -top-1 -right-1">
                  <VerificationBadge isVerified={true} size="sm" />
                </div>
              )}
            </button>
            <p className="text-xs font-semibold text-rose-600 mt-1 truncate w-16">
              {t('yourStory')}
            </p>
          </div>
        )}

        {/* Stories de otros usuarios */}
        {storyGroups.slice(0, compact ? 3 : storyGroups.length).map((storyGroup) => (
          <div key={storyGroup.id} className="flex-shrink-0 text-center">
            <button
              onClick={() => handleStoryClick(storyGroup)}
              className={`relative ${compact ? 'w-12 h-12' : 'w-16 h-16'} rounded-full overflow-hidden hover:scale-105 transition-transform shadow-lg`}
            >
              {/* Ring de color según si hay stories no vistas */}
              <div className={`absolute inset-0 rounded-full p-1 ${
                storyGroup.hasUnviewed 
                  ? 'bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-500' 
                  : 'bg-gray-400'
              }`}>
                <div className="w-full h-full rounded-full overflow-hidden bg-white p-1">
                  <img
                    src={storyGroup.user.avatar}
                    alt={storyGroup.user.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face';
                    }}
                  />
                </div>
              </div>
              
              {/* Indicador de cantidad de stories */}
              {storyGroup.stories.length > 1 && (
                <div className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full ${compact ? 'w-3 h-3' : 'w-4 h-4'} flex items-center justify-center font-bold border-2 border-white shadow-lg`}>
                  {storyGroup.stories.length}
                </div>
              )}
            </button>
            {!compact && (
              <p className="text-xs font-semibold text-gray-700 mt-1 truncate w-16">
                {storyGroup.user.name.split(' ')[0]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesRingWorking;