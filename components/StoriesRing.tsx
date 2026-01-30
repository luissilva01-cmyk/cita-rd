// cita-rd/components/StoriesRing.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import { StoryGroup, storiesService } from '../services/storiesService';
import AccountSettings from './AccountSettings';
import VerificationBadge from './VerificationBadge';
import { verificationService } from '../services/verificationService';
import { useTranslation } from '../hooks/useTranslation';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

interface StoriesRingProps {
  currentUserId: string;
  onStoryClick?: (storyGroup: StoryGroup) => void;
  onCreateStory?: () => void;
}

const StoriesRing: React.FC<StoriesRingProps> = ({ 
  currentUserId, 
  onStoryClick, 
  onCreateStory 
}) => {
  const { t } = useTranslation();
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Cargar stories al montar el componente
  useEffect(() => {
    loadStories();
    checkVerificationStatus();
  }, [currentUserId]);

  const checkVerificationStatus = async () => {
    try {
      const verification = await verificationService.getUserVerification(currentUserId);
      setIsVerified(verification.isVerified);
    } catch (error) {
      console.error('Error verificando estado:', error);
    }
  };

  const loadStories = async () => {
    try {
      setLoading(true);
      console.log('📱 Cargando stories para usuario:', currentUserId);
      
      const groups = await storiesService.getStoryGroups(currentUserId);
      setStoryGroups(groups);
      
      console.log('✅ Stories cargadas:', groups.length, 'grupos');
    } catch (error) {
      console.error('❌ Error cargando stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (storyGroup: StoryGroup) => {
    console.log('📱 Clicked story from:', storyGroup.user.name);
    
    if (onStoryClick) {
      onStoryClick(storyGroup);
    } else {
      // Fallback: mostrar alert con información
      alert(`🎬 Ver Stories de ${storyGroup.user.name}\n\n📱 ${storyGroup.stories.length} stories disponibles\n\n✨ ¡Sistema de Stories funcionando!`);
    }
  };

  const handleCreateStory = () => {
    console.log('📸 Crear nueva story');
    
    if (onCreateStory) {
      onCreateStory();
    } else {
      // Fallback: mostrar alert
      alert('📸 ¡Crear Story!\n\n🎨 Esta funcionalidad abrirá el modal para crear una nueva story.\n\n✅ Sistema implementado correctamente!');
    }
  };

  const handlePrivacyUpdated = () => {
    console.log('🔄 Configuración actualizada, recargando stories');
    loadStories(); // Recargar stories para aplicar nuevos filtros
    checkVerificationStatus(); // Actualizar estado de verificación
  };

  const handleAccountSettings = () => {
    console.log('⚙️ Abriendo configuración de cuenta');
    setShowAccountSettings(true);
  };

  if (loading) {
    return (
      <div className="flex gap-4 p-4 overflow-x-auto">
        {/* Skeleton loading */}
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
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      // Fallback si la imagen no carga
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
        onAccountDeleted={async () => {
          console.log('🗑️ Cuenta eliminada, cerrando sesión...');
          try {
            await signOut(auth);
            // El AuthProvider se encargará de limpiar el estado y redirigir
          } catch (error) {
            console.error('Error al cerrar sesión después de eliminar cuenta:', error);
          }
        }}
      />
    </div>
  );
};

export default StoriesRing;