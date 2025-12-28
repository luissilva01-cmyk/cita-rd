// cita-rd/components/StoriesPrivacySettings.tsx
import React, { useState, useEffect } from 'react';
import { X, Lock, Globe, Users, Eye, MessageCircle, Shield } from 'lucide-react';
import { PrivacySettings, privacyService } from '../services/privacyService';
import { useTranslation } from '../hooks/useTranslation';

interface StoriesPrivacySettingsProps {
  isOpen: boolean;
  currentUserId: string;
  onClose: () => void;
  onSettingsUpdated?: () => void;
}

const StoriesPrivacySettings: React.FC<StoriesPrivacySettingsProps> = ({
  isOpen,
  currentUserId,
  onClose,
  onSettingsUpdated
}) => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar configuración actual
  useEffect(() => {
    if (isOpen && currentUserId) {
      loadSettings();
    }
  }, [isOpen, currentUserId]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const userSettings = await privacyService.getPrivacySettings(currentUserId);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key: keyof PrivacySettings, value: any) => {
    if (!settings) return;

    try {
      setSaving(true);
      
      const updatedSettings = await privacyService.updatePrivacySettings(currentUserId, {
        [key]: value
      });
      
      setSettings(updatedSettings);
      
      if (onSettingsUpdated) {
        onSettingsUpdated();
      }
      
      console.log('✅ Configuración actualizada:', key, '=', value);
      
    } catch (error) {
      console.error('Error actualizando configuración:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
            <span className="ml-3 text-gray-600">{t('loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 text-center">
          <p className="text-red-600">Error cargando configuración</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Shield className="text-rose-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900">{t('storiesPrivacyTitle')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - SCROLLABLE */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
          
          {/* Stories Visibility */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Eye size={20} className="text-gray-600" />
              {t('whoCanSeeStories')}
            </h3>
            
            <div className="space-y-3">
              {/* Everyone - MEJORADA VISIBILIDAD */}
              <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors ${
                settings.storiesVisibility === 'everyone' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-300'
              }`}>
                <input
                  type="radio"
                  name="storiesVisibility"
                  value="everyone"
                  checked={settings.storiesVisibility === 'everyone'}
                  onChange={(e) => handleSettingChange('storiesVisibility', e.target.value)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  settings.storiesVisibility === 'everyone' 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {settings.storiesVisibility === 'everyone' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe size={18} className="text-blue-600" />
                    <span className={`font-semibold ${
                      settings.storiesVisibility === 'everyone' 
                        ? 'text-blue-900' 
                        : 'text-gray-900'
                    }`}>{t('everyone')}</span>
                    {settings.storiesVisibility === 'everyone' && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium">
                        Seleccionado
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    settings.storiesVisibility === 'everyone' 
                      ? 'text-blue-700' 
                      : 'text-gray-600'
                  }`}>
                    {t('everyoneDesc')}
                  </p>
                </div>
              </label>

              {/* Matches Only - MEJORADA VISIBILIDAD */}
              <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-orange-50 transition-colors ${
                settings.storiesVisibility === 'matches_only' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-300 hover:border-orange-300'
              }`}>
                <input
                  type="radio"
                  name="storiesVisibility"
                  value="matches_only"
                  checked={settings.storiesVisibility === 'matches_only'}
                  onChange={(e) => handleSettingChange('storiesVisibility', e.target.value)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  settings.storiesVisibility === 'matches_only' 
                    ? 'border-orange-500 bg-orange-500' 
                    : 'border-gray-300'
                }`}>
                  {settings.storiesVisibility === 'matches_only' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock size={18} className="text-orange-600" />
                    <span className={`font-semibold ${
                      settings.storiesVisibility === 'matches_only' 
                        ? 'text-orange-900' 
                        : 'text-gray-900'
                    }`}>{t('matchesOnly')}</span>
                    {settings.storiesVisibility === 'matches_only' && (
                      <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-medium">
                        Seleccionado
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    settings.storiesVisibility === 'matches_only' 
                      ? 'text-orange-700' 
                      : 'text-gray-600'
                  }`}>
                    {t('matchesOnlyDesc')}
                  </p>
                </div>
              </label>

              {/* Close Friends - MEJORADA VISIBILIDAD */}
              <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors opacity-75 ${
                settings.storiesVisibility === 'close_friends' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:bg-green-50 hover:border-green-300'
              }`}>
                <input
                  type="radio"
                  name="storiesVisibility"
                  value="close_friends"
                  checked={settings.storiesVisibility === 'close_friends'}
                  onChange={(e) => handleSettingChange('storiesVisibility', e.target.value)}
                  className="sr-only"
                  disabled
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  settings.storiesVisibility === 'close_friends' 
                    ? 'border-green-500 bg-green-500' 
                    : 'border-gray-300'
                }`}>
                  {settings.storiesVisibility === 'close_friends' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={18} className="text-green-600" />
                    <span className={`font-semibold ${
                      settings.storiesVisibility === 'close_friends' 
                        ? 'text-green-900' 
                        : 'text-gray-900'
                    }`}>{t('closeFriends')}</span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{t('comingSoon')}</span>
                  </div>
                  <p className={`text-sm ${
                    settings.storiesVisibility === 'close_friends' 
                      ? 'text-green-700' 
                      : 'text-gray-600'
                  }`}>
                    {t('closeFriendsDesc')}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Story Replies */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MessageCircle size={20} className="text-gray-600" />
              Respuestas a Stories
            </h3>
            
            <label className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <span className="font-semibold text-gray-900">Permitir respuestas</span>
                <p className="text-sm text-gray-600 mt-1">
                  Los usuarios pueden responder a tus Stories con mensajes
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.allowStoryReplies}
                  onChange={(e) => handleSettingChange('allowStoryReplies', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  settings.allowStoryReplies ? 'bg-rose-500' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    settings.allowStoryReplies ? 'translate-x-6' : 'translate-x-0.5'
                  } mt-0.5`}></div>
                </div>
              </div>
            </label>
          </div>

          {/* Online Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Estado en línea</h3>
            
            <label className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <span className="font-semibold text-gray-900">Mostrar cuando estoy en línea</span>
                <p className="text-sm text-gray-600 mt-1">
                  Otros usuarios pueden ver si estás activo
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.showOnlineStatus}
                  onChange={(e) => handleSettingChange('showOnlineStatus', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  settings.showOnlineStatus ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    settings.showOnlineStatus ? 'translate-x-6' : 'translate-x-0.5'
                  } mt-0.5`}></div>
                </div>
              </div>
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="text-blue-500 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Tu privacidad es importante</h4>
                <p className="text-sm text-blue-700">
                  Puedes cambiar estas configuraciones en cualquier momento. 
                  Los cambios se aplican inmediatamente a todas tus Stories futuras.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - SIEMPRE VISIBLE */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={saving}
            className="w-full py-4 px-4 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg text-lg"
          >
            {saving ? t('saving') : t('ready')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoriesPrivacySettings;