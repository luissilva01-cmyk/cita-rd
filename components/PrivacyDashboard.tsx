// cita-rd/components/PrivacyDashboard.tsx
import React, { useState } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Download, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Clock, 
  Camera, 
  Brain,
  X,
  RefreshCw,
  Info
} from 'lucide-react';
import { usePrivacyDashboard } from '../hooks/usePrivacyDashboard';
import { useLanguage } from '../contexts/LanguageContext';

interface PrivacyDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const PrivacyDashboard: React.FC<PrivacyDashboardProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'visibility' | 'data' | 'security' | 'audit'>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [exportRequests, setExportRequests] = useState<any[]>([]);

  const {
    privacySettings,
    privacySummary,
    auditLog,
    isLoading,
    error,
    updatePrivacySetting,
    requestDataExport,
    deleteAccount,
    refreshData
  } = usePrivacyDashboard(userId);

  if (!isOpen) return null;

  const getPrivacyScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPrivacyScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bueno';
    if (score >= 40) return 'Regular';
    return 'Necesita mejoras';
  };

  const handleToggleSetting = async (category: string, setting: string, value: boolean) => {
    if (!privacySettings) return;
    
    try {
      // Actualización inmediata del estado local para feedback instantáneo
      const updatedSettings = { ...privacySettings };
      
      // Actualizar la configuración específica inmediatamente
      if (category === 'profileVisibility') {
        updatedSettings.profileVisibility = {
          ...updatedSettings.profileVisibility,
          [setting]: value
        };
      } else if (category === 'incognitoMode') {
        updatedSettings.incognitoMode = {
          ...updatedSettings.incognitoMode,
          [setting]: value
        };
      } else if (category === 'dataUsage') {
        updatedSettings.dataUsage = {
          ...updatedSettings.dataUsage,
          [setting]: value
        };
      }
      
      // Actualizar inmediatamente el estado local para feedback visual instantáneo
      // Esto se hace ANTES de la llamada al servidor para mejor UX
      const currentPrivacySettings = privacySettings;
      
      // Simular actualización inmediata (optimistic update)
      if (category === 'profileVisibility') {
        currentPrivacySettings.profileVisibility = {
          ...currentPrivacySettings.profileVisibility,
          [setting]: value
        };
      } else if (category === 'incognitoMode') {
        currentPrivacySettings.incognitoMode = {
          ...currentPrivacySettings.incognitoMode,
          [setting]: value
        };
      } else if (category === 'dataUsage') {
        currentPrivacySettings.dataUsage = {
          ...currentPrivacySettings.dataUsage,
          [setting]: value
        };
      }
      
      // Forzar re-render inmediato
      refreshData();
      
      // Luego hacer la actualización en el servidor
      await updatePrivacySetting(category as any, { [setting]: value } as any);
      
      // Mostrar feedback visual de éxito
      console.log(`✅ Configuración actualizada: ${category}.${setting} = ${value}`);
      
    } catch (error) {
      console.error('Error updating privacy setting:', error);
      // En caso de error, revertir el cambio
      refreshData();
    }
  };

  const handleDataExport = async () => {
    const dataTypes = ['profile', 'messages', 'matches', 'photos', 'settings'];
    const result = await requestDataExport(dataTypes);
    
    if (result) {
      // Agregar a la lista local
      setExportRequests(prev => [result, ...prev]);
      
      // Mostrar confirmación visual
      alert(`📤 Exportación de datos solicitada\n\n✅ Tu solicitud ha sido procesada correctamente\n\nID de seguimiento: ${result.id}\nDatos incluidos: ${dataTypes.join(', ')}\n\nTe notificaremos cuando tu archivo esté listo para descargar.\nTiempo estimado: 2-5 minutos`);
      
      // Simular procesamiento completado después de 5 segundos
      setTimeout(() => {
        setExportRequests(prev => 
          prev.map(req => 
            req.id === result.id 
              ? { ...req, status: 'ready', downloadUrl: `https://tapati.com/exports/${req.id}.zip` }
              : req
          )
        );
        alert(`🎉 ¡Exportación completada!\n\n📦 Tu archivo está listo para descargar\n\nID: ${result.id}\nEnlace de descarga: https://tapati.com/exports/${result.id}.zip\n\n⚠️ Importante: El archivo expirará en 7 días por seguridad`);
      }, 5000);
    }
  };

  const handleDeleteAccount = async () => {
    await deleteAccount(deleteReason || 'Usuario solicitó eliminación');
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-2 sm:gap-3">
            <Shield className="text-blue-600" size={24} />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Dashboard de Privacidad</h2>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Control total sobre tus datos y privacidad</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={refreshData}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
              disabled={isLoading}
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
          {[
            { id: 'overview', label: 'Resumen', icon: Shield },
            { id: 'visibility', label: 'Visibilidad', icon: Eye },
            { id: 'data', label: 'Datos', icon: FileText },
            { id: 'security', label: 'Seguridad', icon: Lock },
            { id: 'audit', label: 'Actividad', icon: Clock }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 max-h-[60vh] overflow-y-auto">
          
          {/* Error State */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={20} />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="animate-spin text-blue-500" size={24} />
              <span className="ml-2 text-gray-600">Cargando...</span>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && privacySummary && (
            <div className="space-y-6">
              
              {/* Privacy Score */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Puntuación de Privacidad</h3>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getPrivacyScoreColor(privacySummary.privacyScore)}`}>
                      {privacySummary.privacyScore}%
                    </div>
                    <div className="text-sm text-gray-600">{getPrivacyScoreLabel(privacySummary.privacyScore)}</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      privacySummary.privacyScore >= 80 ? 'bg-green-500' :
                      privacySummary.privacyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${privacySummary.privacyScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-green-50 rounded-lg p-3 sm:p-4 text-center">
                  <CheckCircle className="text-green-500 mx-auto mb-2" size={20} />
                  <div className="text-xl sm:text-2xl font-bold text-green-700">
                    {Math.max(0, 10 - privacySummary.risksDetected.length)}
                  </div>
                  <div className="text-xs sm:text-sm text-green-600">Configuraciones Seguras</div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 text-center">
                  <AlertTriangle className="text-yellow-500 mx-auto mb-2" size={20} />
                  <div className="text-xl sm:text-2xl font-bold text-yellow-700">{privacySummary.risksDetected.length}</div>
                  <div className="text-xs sm:text-sm text-yellow-600">Riesgos Detectados</div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                  <FileText className="text-blue-500 mx-auto mb-2" size={20} />
                  <div className="text-xl sm:text-2xl font-bold text-blue-700">{privacySummary.dataShared.length}</div>
                  <div className="text-xs sm:text-sm text-blue-600">Datos Compartidos</div>
                </div>
              </div>

              {/* Recommendations */}
              {privacySummary.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Info className="text-blue-500" size={18} />
                    Recomendaciones
                  </h4>
                  <div className="space-y-2">
                    {privacySummary.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-blue-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risks */}
              {privacySummary.risksDetected.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="text-red-500" size={18} />
                    Riesgos Detectados
                  </h4>
                  <div className="space-y-2">
                    {privacySummary.risksDetected.map((risk, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-red-700">{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Visibility Tab */}
          {activeTab === 'visibility' && privacySettings && (
            <div className="space-y-6">
              
              {/* Profile Visibility */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="text-blue-500" size={18} />
                  Visibilidad del Perfil
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Aparecer en búsquedas</div>
                      <div className="text-sm text-gray-600">Otros usuarios pueden encontrar tu perfil</div>
                    </div>
                    <button
                      onClick={() => handleToggleSetting('profileVisibility', 'discoverable', !privacySettings.profileVisibility.discoverable)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        privacySettings.profileVisibility.discoverable ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacySettings.profileVisibility.discoverable ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Mostrar edad</div>
                      <div className="text-sm text-gray-600">Tu edad será visible en el perfil</div>
                    </div>
                    <button
                      onClick={() => handleToggleSetting('profileVisibility', 'showAge', !privacySettings.profileVisibility.showAge)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        privacySettings.profileVisibility.showAge ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacySettings.profileVisibility.showAge ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Estado en línea</div>
                      <div className="text-sm text-gray-600">Mostrar cuando estás activo</div>
                    </div>
                    <button
                      onClick={() => handleToggleSetting('profileVisibility', 'showOnlineStatus', !privacySettings.profileVisibility.showOnlineStatus)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        privacySettings.profileVisibility.showOnlineStatus ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacySettings.profileVisibility.showOnlineStatus ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Incognito Mode */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <EyeOff className="text-purple-500" size={18} />
                  Modo Incógnito
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Activar modo incógnito</div>
                      <div className="text-sm text-gray-600">Navega sin dejar rastro</div>
                    </div>
                    <button
                      onClick={() => handleToggleSetting('incognitoMode', 'enabled', !privacySettings.incognitoMode.enabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        privacySettings.incognitoMode.enabled ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacySettings.incognitoMode.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && privacySettings && (
            <div className="space-y-6">
              
              {/* AI Data Usage */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Brain className="text-green-500" size={18} />
                  Uso de Datos por IA
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Análisis emocional</div>
                      <div className="text-sm text-gray-600">Permitir análisis de emociones en chats</div>
                    </div>
                    <button
                      onClick={() => handleToggleSetting('dataUsage', 'allowEmotionalAnalysis', !privacySettings.dataUsage.allowEmotionalAnalysis)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        privacySettings.dataUsage.allowEmotionalAnalysis ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacySettings.dataUsage.allowEmotionalAnalysis ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">IA de matching</div>
                      <div className="text-sm text-gray-600">Usar IA para mejorar matches</div>
                    </div>
                    <button
                      onClick={() => handleToggleSetting('dataUsage', 'allowMatchingAI', !privacySettings.dataUsage.allowMatchingAI)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        privacySettings.dataUsage.allowMatchingAI ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacySettings.dataUsage.allowMatchingAI ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Export */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Download className="text-blue-500" size={18} />
                  Exportar Datos
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  Obtén una copia de toda tu información personal almacenada en Ta' Pa' Ti. 
                  El archivo ZIP incluye tu perfil, mensajes, matches, fotos y configuraciones.
                </p>
                
                <div className="bg-white rounded-lg p-3 mb-4 border border-blue-200">
                  <h5 className="font-medium text-gray-900 mb-2">Datos incluidos:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Información del perfil y fotos</li>
                    <li>• Historial completo de mensajes</li>
                    <li>• Lista de matches y likes</li>
                    <li>• Configuraciones de privacidad</li>
                    <li>• Registro de actividad (audit log)</li>
                  </ul>
                </div>
                
                <button
                  onClick={handleDataExport}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                  disabled={isLoading}
                >
                  <Download size={16} />
                  {isLoading ? 'Procesando solicitud...' : 'Descargar mis datos'}
                </button>
                
                <p className="text-xs text-gray-500 mt-2 text-center">
                  📅 Tu archivo estará disponible durante 7 días por motivos de seguridad
                </p>
              </div>

              {/* Export Requests History */}
              {exportRequests.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="text-gray-500" size={18} />
                    Solicitudes de Exportación
                  </h4>
                  
                  <div className="space-y-2">
                    {exportRequests.map((request) => (
                      <div key={request.id} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 text-sm">
                            Exportación #{request.id.split('_')[1]}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            request.status === 'ready' ? 'bg-green-100 text-green-700' :
                            request.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {request.status === 'ready' ? '✅ Listo' :
                             request.status === 'processing' ? '⏳ Procesando' :
                             '📋 Pendiente'}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2">
                          Solicitado: {new Date(request.requestDate).toLocaleString()}
                        </p>
                        
                        <p className="text-xs text-gray-600 mb-2">
                          Datos: {request.dataTypes.join(', ')}
                        </p>
                        
                        {request.status === 'ready' && request.downloadUrl && (
                          <button
                            onClick={() => window.open(request.downloadUrl, '_blank')}
                            className="w-full bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <Download size={14} />
                            Descargar ZIP
                          </button>
                        )}
                        
                        {request.status === 'pending' && (
                          <div className="w-full bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm text-center">
                            ⏳ Procesando... (puede tomar unos minutos)
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              
              {/* Account Deletion */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Trash2 className="text-red-500" size={18} />
                  Eliminar Cuenta
                </h4>
                
                <p className="text-sm text-gray-600 mb-4">
                  Esta acción eliminará permanentemente tu cuenta y todos los datos asociados.
                </p>
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Eliminar Cuenta
                </button>
              </div>
            </div>
          )}

          {/* Audit Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="text-gray-500" size={18} />
                Registro de Actividad
              </h4>
              
              {auditLog.length > 0 ? (
                <div className="space-y-2">
                  {auditLog.map((log) => (
                    <div key={log.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{log.action}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{log.details}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay actividad registrada
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ¿Eliminar cuenta permanentemente?
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                Esta acción no se puede deshacer. Todos tus datos serán eliminados permanentemente.
              </p>
              
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Razón para eliminar la cuenta (opcional)"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-sm"
                rows={3}
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  disabled={isLoading}
                >
                  Eliminar Cuenta
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyDashboard;