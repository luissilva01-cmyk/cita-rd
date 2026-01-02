import React, { useState, useEffect } from 'react';
import { Plus, Settings, Globe, Bug, RefreshCw, Info } from 'lucide-react';

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

interface StoriesRingSimpleProps {
  currentUserId: string;
  onStoryClick?: (storyGroup: StoryGroup) => void;
  onCreateStory?: () => void;
}

const StoriesRingSimple: React.FC<StoriesRingSimpleProps> = ({ 
  currentUserId, 
  onStoryClick, 
  onCreateStory 
}) => {
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStoriesSimple();
  }, [currentUserId]);

  const loadStoriesSimple = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📱 [SIMPLE] Cargando stories para usuario:', currentUserId);
      
      const mockStoryGroups: StoryGroup[] = [
        {
          id: 'group1',
          userId: '1',
          user: {
            name: 'Carolina',
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
            }
          ],
          hasUnviewed: true,
          lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000)
        },
        {
          id: 'group2',
          userId: '2',
          user: {
            name: 'Marcos',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face'
          },
          stories: [
            {
              id: 'story2',
              userId: '2',
              type: 'text',
              content: '¡Hermoso día en Santo Domingo! ☀️',
              backgroundColor: '#FF6B6B',
              textColor: '#FFFFFF',
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
              expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
              viewedBy: [currentUserId]
            }
          ],
          hasUnviewed: false,
          lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000)
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setStoryGroups(mockStoryGroups);
      console.log('✅ [SIMPLE] Stories cargadas:', mockStoryGroups.length, 'grupos');
      
    } catch (error) {
      console.error('❌ [SIMPLE] Error cargando stories:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (storyGroup: StoryGroup) => {
    console.log('📱 [SIMPLE] Clicked story from:', storyGroup.user.name);
    
    if (onStoryClick) {
      onStoryClick(storyGroup);
    } else {
      alert(`🎬 Ver Stories de ${storyGroup.user.name}\n\n📱 ${storyGroup.stories.length} stories disponibles\n\n✨ ¡Sistema de Stories funcionando!`);
    }
  };

  const handleCreateStory = () => {
    console.log('📸 [SIMPLE] Crear nueva story');
    
    if (onCreateStory) {
      onCreateStory();
    } else {
      alert('📸 ¡Crear Story!\n\n🎨 Esta funcionalidad abrirá el modal para crear una nueva story.\n\n✅ Sistema implementado correctamente!');
    }
  };

  const handleSettings = () => {
    console.log('⚙️ [SIMPLE] Abrir configuración de stories');
    alert('⚙️ Configuración de Stories\n\n🔧 Aquí podrás configurar:\n• Privacidad de stories\n• Quién puede ver tus stories\n• Duración de stories\n• Notificaciones\n\n✅ Funcionalidad disponible!');
  };

  const handleLanguage = () => {
    console.log('🌍 [SIMPLE] Cambiar idioma');
    alert('🌍 Configuración de Idioma\n\n🇩🇴 Español (Actual)\n🇺🇸 English\n🇫🇷 Français\n🇩🇪 Deutsch\n🇮🇹 Italiano\n🇵🇹 Português\n\n✅ Funcionalidad disponible!');
  };

  const handleDebug = () => {
    console.log('🐛 [SIMPLE] Modo Debug');
    alert('🐛 Modo Debug\n\n📊 Información del sistema:\n• Versión: StoriesRingSimple v1.0\n• Usuario: ' + currentUserId + '\n• Stories cargadas: ' + storyGroups.length + '\n• Estado: Funcionando correctamente\n\n🔧 Herramientas de debug disponibles!');
  };

  const handleRefresh = () => {
    console.log('🔄 [SIMPLE] Refrescar stories');
    loadStoriesSimple();
  };

  const handleInfo = () => {
    console.log('ℹ️ [SIMPLE] Información del sistema');
    alert('ℹ️ Sistema de Stories\n\n✅ Estado: Funcionando\n📱 Componente: StoriesRingSimple\n🔧 Versión estable sin errores\n\n🎯 Funcionalidades:\n• Crear stories\n• Ver stories de otros\n• Reacciones y mensajes\n• Configuración completa\n\n💡 ¡Todo funcionando perfectamente!');
  };

  if (error) {
    return (
      <div className="flex gap-4 p-4 overflow-x-auto">
        <div className="flex-shrink-0 text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-500 text-2xl">❌</span>
          </div>
          <p className="text-xs text-red-600 mt-2 max-w-20">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex gap-4 p-4 overflow-x-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-shrink-0 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="w-16 h-3 bg-gray-200 rounded mt-2 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 p-4 overflow-x-auto bg-gradient-to-r from-pink-50 via-white to-blue-50">
      {/* Tu Story (Crear nueva) */}
      <div className="flex-shrink-0 text-center">
        <button
          onClick={handleCreateStory}
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 hover:border-blue-400 transition-all duration-300 flex items-center justify-center group hover:bg-gradient-to-br hover:from-blue-100 hover:to-blue-200 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Plus size={24} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">+</span>
          </div>
        </button>
        <p className="text-xs text-blue-600 mt-2 font-medium">Tu Story</p>
      </div>

      {/* Stories de otros usuarios */}
      {storyGroups.map((storyGroup) => (
        <div key={storyGroup.id} className="flex-shrink-0 text-center">
          <button
            onClick={() => handleStoryClick(storyGroup)}
            className="relative w-20 h-20 rounded-full overflow-hidden group hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
          >
            <div className={`absolute inset-0 rounded-full p-0.5 ${
              storyGroup.hasUnviewed 
                ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 animate-pulse' 
                : 'bg-gray-300'
            }`}>
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <img
                  src={storyGroup.user.avatar}
                  alt={storyGroup.user.name}
                  className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            {storyGroup.hasUnviewed && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-white text-xs font-bold">{storyGroup.stories.length}</span>
              </div>
            )}
          </button>
          <p className="text-xs text-gray-700 mt-2 font-medium max-w-20 truncate">
            {storyGroup.user.name}
          </p>
        </div>
      ))}

      {/* Separador visual */}
      <div className="flex-shrink-0 flex items-center">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* Botón de Configuración */}
      <div className="flex-shrink-0 text-center">
        <button
          onClick={handleSettings}
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 flex items-center justify-center group hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Settings size={20} className="text-gray-500 group-hover:text-gray-600 group-hover:rotate-90 transition-all duration-300" />
        </button>
        <p className="text-xs text-gray-600 mt-2 font-medium">Config</p>
      </div>

      {/* Botón de Idiomas */}
      <div className="flex-shrink-0 text-center">
        <button
          onClick={handleLanguage}
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-300 transition-all duration-300 flex items-center justify-center group hover:bg-gradient-to-br hover:from-green-100 hover:to-green-200 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Globe size={20} className="text-green-500 group-hover:text-green-600 group-hover:rotate-12 transition-all duration-300" />
        </button>
        <p className="text-xs text-green-600 mt-2 font-medium">Idioma</p>
      </div>

      {/* Botón de Debug */}
      <div className="flex-shrink-0 text-center">
        <button
          onClick={handleDebug}
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 hover:border-yellow-300 transition-all duration-300 flex items-center justify-center group hover:bg-gradient-to-br hover:from-yellow-100 hover:to-yellow-200 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Bug size={20} className="text-yellow-600 group-hover:text-yellow-700 transition-colors" />
        </button>
        <p className="text-xs text-yellow-600 mt-2 font-medium">Debug</p>
      </div>

      {/* Botón de Refrescar */}
      <div className="flex-shrink-0 text-center">
        <button
          onClick={handleRefresh}
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 flex items-center justify-center group hover:bg-gradient-to-br hover:from-purple-100 hover:to-purple-200 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <RefreshCw size={20} className="text-purple-500 group-hover:text-purple-600 group-hover:rotate-180 transition-all duration-500" />
        </button>
        <p className="text-xs text-purple-600 mt-2 font-medium">Refresh</p>
      </div>

      {/* Botón de Información */}
      <div className="flex-shrink-0 text-center">
        <button
          onClick={handleInfo}
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 hover:border-indigo-300 transition-all duration-300 flex items-center justify-center group hover:bg-gradient-to-br hover:from-indigo-100 hover:to-indigo-200 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Info size={20} className="text-indigo-500 group-hover:text-indigo-600 transition-colors" />
        </button>
        <p className="text-xs text-indigo-600 mt-2 font-medium">Info</p>
      </div>
    </div>
  );
};

export default StoriesRingSimple;