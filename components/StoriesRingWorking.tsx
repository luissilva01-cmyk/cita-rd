import React, { useState, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import AccountSettings from './AccountSettings';
import VerificationBadge from './VerificationBadge';
import { useLanguage } from '../contexts/LanguageContext';

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

interface StoryGroup {
  id: string;
  userId: string;
  user: {
    name: string;
    avatar: string;
  };
  stories: Story[];
  hasUnviewed: boolean;
  lastUpdated: Date;
}

interface StoriesRingWorkingProps {
  currentUserId: string;
  onStoryClick?: (storyGroup: StoryGroup) => void;
  onCreateStory?: () => void;
}

const StoriesRingWorking: React.FC<StoriesRingWorkingProps> = ({ 
  currentUserId, 
  onStoryClick, 
  onCreateStory 
}) => {
  const { t } = useLanguage();
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [storiesKey, setStoriesKey] = useState(0);

  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      
      // Datos de ejemplo más realistas
      const mockData: StoryGroup[] = [
        {
          id: 'group1',
          userId: '1',
          user: {
            name: 'Carolina Méndez',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face'
          },
          stories: [
            {
              id: 'story1',
              userId: '1',
              type: 'image',
              content: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
              expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
              viewedBy: []
            },
            {
              id: 'story1b',
              userId: '1',
              type: 'text',
              content: '¡Hermoso día en la Zona Colonial! 🏛️',
              backgroundColor: '#FF6B6B',
              textColor: '#FFFFFF',
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
              expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
              viewedBy: []
            }
          ],
          hasUnviewed: true,
          lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000)
        },
        {
          id: 'group2',
          userId: '2',
          user: {
            name: 'Marcos Rivera',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face'
          },
          stories: [{
            id: 'story2',
            userId: '2',
            type: 'text',
            content: '¡Hermoso día en Santo Domingo! ☀️',
            backgroundColor: '#4ECDC4',
            textColor: '#FFFFFF',
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
            expiresAt: new Date(Date.now() + 21 * 60 * 60 * 1000),
            viewedBy: [currentUserId]
          }],
          hasUnviewed: false,
          lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000)
        },
        {
          id: 'group3',
          userId: '3',
          user: {
            name: 'Isabella Santos',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face'
          },
          stories: [{
            id: 'story3',
            userId: '3',
            type: 'image',
            content: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop',
            createdAt: new Date(Date.now() - 30 * 60 * 1000),
            expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000),
            viewedBy: []
          }],
          hasUnviewed: true,
          lastUpdated: new Date(Date.now() - 30 * 60 * 1000)
        }
      ];
      
      setTimeout(() => {
        setStoryGroups(mockData);
        setIsVerified(Math.random() > 0.5); // Simulamos verificación aleatoria
        setLoading(false);
      }, 500);
    };
    
    loadStories();
  }, [currentUserId]);

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

  const handleAccountSettings = () => {
    console.log('⚙️ Abriendo configuración de cuenta');
    setShowAccountSettings(true);
  };

  const handlePrivacyUpdated = () => {
    console.log('🔄 Configuración actualizada, recargando stories');
    // Recargar stories para aplicar nuevos filtros
    setStoriesKey(prev => prev + 1);
    setIsVerified(Math.random() > 0.5); // Simular actualización de verificación
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
      <div className="flex gap-3 p-4 justify-start overflow-x-auto">
        
        {/* Mi story / Crear story */}
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

        {/* Stories de otros usuarios */}
        {storyGroups.map((storyGroup) => (
          <div key={storyGroup.id} className="flex-shrink-0 text-center">
            <button
              onClick={() => handleStoryClick(storyGroup)}
              className="relative w-16 h-16 rounded-full overflow-hidden hover:scale-105 transition-transform shadow-lg"
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
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face';
                    }}
                  />
                </div>
              </div>
              
              {/* Indicador de cantidad de stories */}
              {storyGroup.stories.length > 1 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold border-2 border-white shadow-lg">
                  {storyGroup.stories.length}
                </div>
              )}
            </button>
            <p className="text-xs font-semibold text-gray-700 mt-1 truncate w-16">
              {storyGroup.user.name.split(' ')[0]}
            </p>
          </div>
        ))}

        {/* Configuración de Cuenta - UNIFICADA Y PROFESIONAL */}
        <div className="flex-shrink-0 text-center ml-auto">
          <button
            onClick={handleAccountSettings}
            className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-gray-300 hover:border-blue-500 hover:scale-105 transition-all shadow-lg group"
          >
            <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 group-hover:from-blue-500 group-hover:to-indigo-600 flex items-center justify-center transition-all">
              <Settings size={20} className="text-white" />
            </div>
            
            {/* Indicador de verificación pendiente */}
            {!isVerified && (
              <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white animate-pulse">
                !
              </div>
            )}
            
            {/* Badge de verificación si está verificado */}
            {isVerified && (
              <div className="absolute -top-1 -right-1">
                <VerificationBadge isVerified={true} size="sm" />
              </div>
            )}
          </button>
          <p className="text-xs font-semibold text-slate-700 mt-1 truncate w-16">
            {t('account')}
          </p>
        </div>
      </div>

      {/* Modal de configuración de cuenta unificado */}
      <AccountSettings
        isOpen={showAccountSettings}
        currentUserId={currentUserId}
        onClose={() => setShowAccountSettings(false)}
        onSettingsUpdated={handlePrivacyUpdated}
      />
    </div>
  );
};

export default StoriesRingWorking;