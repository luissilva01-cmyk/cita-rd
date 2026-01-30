// cita-rd/components/AccountSettings.tsx
import React, { useState, useEffect } from 'react';
import { X, Shield, Globe, Lock, CheckCircle, AlertCircle, Settings, Trash2, AlertTriangle } from 'lucide-react';
import IdentityVerification from './IdentityVerification';
import LanguageSettings from './LanguageSettings';
import StoriesPrivacySettings from './StoriesPrivacySettings';
import PrivacyDashboard from './PrivacyDashboard';
import VerificationBadge from './VerificationBadge';
import { verificationService } from '../services/verificationService';
import { languageService } from '../services/languageService';
import { useTranslation } from '../hooks/useTranslation';
import { deleteUserAccount, reauthenticateUser } from '../services/accountDeletionService';

interface AccountSettingsProps {
  isOpen: boolean;
  currentUserId: string;
  onClose: () => void;
  onSettingsUpdated?: () => void;
  onAccountDeleted?: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  isOpen,
  currentUserId,
  onClose,
  onSettingsUpdated,
  onAccountDeleted
}) => {
  const { t } = useTranslation();
  const [isVerified, setIsVerified] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showPrivacyDashboard, setShowPrivacyDashboard] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'confirm' | 'password'>('confirm');

  useEffect(() => {
    if (isOpen) {
      checkVerificationStatus();
      setCurrentLanguage(languageService.getCurrentLanguage());
    }
  }, [isOpen, currentUserId]);

  const checkVerificationStatus = async () => {
    try {
      const verification = await verificationService.getUserVerification(currentUserId);
      setIsVerified(verification.isVerified);
    } catch (error) {
      console.error('Error verificando estado:', error);
    }
  };

  const handleVerificationComplete = (success: boolean) => {
    if (success) {
      setIsVerified(true);
      if (onSettingsUpdated) onSettingsUpdated();
    }
  };

  const handleLanguageChange = () => {
    setCurrentLanguage(languageService.getCurrentLanguage());
    if (onSettingsUpdated) onSettingsUpdated();
  };

  const handlePrivacyUpdate = () => {
    if (onSettingsUpdated) onSettingsUpdated();
  };

  const handleDeleteAccount = async () => {
    // Paso 1: Confirmar escribiendo "ELIMINAR"
    if (deleteStep === 'confirm') {
      if (deleteConfirmText !== 'ELIMINAR') {
        alert(t('deleteConfirmError') || 'Debes escribir ELIMINAR para confirmar');
        return;
      }

      if (!confirm(t('deleteAccountFinalWarning') || '⚠️ ÚLTIMA ADVERTENCIA: Esta acción es IRREVERSIBLE. ¿Estás completamente seguro?')) {
        return;
      }

      // Pasar al paso de contraseña
      setDeleteStep('password');
      return;
    }

    // Paso 2: Verificar contraseña y eliminar
    if (deleteStep === 'password') {
      if (!deletePassword) {
        alert('Por favor, ingresa tu contraseña para confirmar');
        return;
      }

      setIsDeleting(true);

      try {
        console.log('🔐 Reautenticando usuario...');
        
        // Reautenticar usuario
        await reauthenticateUser(deletePassword);
        
        console.log('🗑️ Iniciando eliminación de cuenta:', currentUserId);
        
        // Eliminar cuenta
        await deleteUserAccount(currentUserId);
        
        console.log('✅ Cuenta eliminada exitosamente');
        
        // Cerrar modal
        setShowDeleteModal(false);
        setDeleteConfirmText('');
        setDeletePassword('');
        setDeleteStep('confirm');
        
        // Notificar al componente padre
        if (onAccountDeleted) {
          onAccountDeleted();
        }
        
        // Cerrar el modal de configuración
        onClose();
        
      } catch (error: any) {
        console.error('❌ Error eliminando cuenta:', error);
        
        // Mostrar mensaje de error específico
        let errorMessage = t('deleteAccountError') || 'Error al eliminar la cuenta. Por favor, intenta de nuevo o contacta a soporte.';
        
        if (error.message) {
          errorMessage = error.message;
        } else if (error.code === 'permission-denied') {
          errorMessage = 'No tienes permisos para eliminar esta cuenta. Por favor, contacta a soporte.';
        } else if (error.code === 'auth/requires-recent-login') {
          errorMessage = 'Por seguridad, debes iniciar sesión nuevamente antes de eliminar tu cuenta. Por favor, cierra sesión e inicia sesión de nuevo.';
        }
        
        alert(errorMessage);
        setIsDeleting(false);
        setDeletePassword('');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white w-full max-w-md mx-2 sm:mx-4 rounded-t-3xl sm:rounded-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('accountSettings')}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-6 space-y-3 sm:space-y-4 max-h-[75vh] sm:max-h-[70vh] overflow-y-auto">
            
            {/* Verificación de Identidad */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isVerified ? 'bg-blue-500' : 'bg-orange-500'}`}>
                    <Shield size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('identityVerification')}</h3>
                    <p className="text-sm text-gray-600">
                      {isVerified ? t('yourAccountVerified') : t('verifyForTrust')}
                    </p>
                  </div>
                </div>
                {isVerified && <VerificationBadge isVerified={true} size="sm" />}
              </div>
              
              <button
                onClick={() => setShowVerificationModal(true)}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all mb-2 ${
                  isVerified
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg'
                }`}
              >
                {isVerified ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle size={16} />
                    {t('seeVerification')}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle size={16} />
                    {t('verifyNow')}
                  </div>
                )}
              </button>
              
              {/* 🧪 BOTÓN TEMPORAL DE DESARROLLO - Limpiar verificación */}
              {isVerified && (
                <button
                  onClick={() => {
                    if (confirm(t('clearTestConfirm'))) {
                      verificationService.resetUserVerification(currentUserId);
                      setIsVerified(false);
                      alert(t('testVerificationCleared'));
                    }
                  }}
                  className="w-full py-2 px-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition-all border border-red-200"
                >
                  🧪 {t('clearTestVerification')}
                </button>
              )}
            </div>

            {/* Privacidad y Seguridad */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500 rounded-full">
                  <Lock size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('privacyAndSecurity')}</h3>
                  <p className="text-sm text-gray-600">{t('controlWhoSees')}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => setShowPrivacyDashboard(true)}
                  className="w-full py-3 px-4 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-all shadow-lg"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Shield size={16} />
                    Dashboard de Privacidad
                  </div>
                </button>
                
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="w-full py-2 px-4 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200 transition-all border border-purple-200"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Settings size={14} />
                    {t('configurePrivacy')} (Stories)
                  </div>
                </button>
                
                {/* Botón Eliminar Cuenta */}
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all border border-red-200 mt-3"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Trash2 size={14} />
                    {t('deleteAccount') || 'Eliminar Cuenta'}
                  </div>
                </button>
              </div>
            </div>

            {/* Idioma */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 sm:p-4 border border-green-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div className="p-1.5 sm:p-2 bg-green-500 rounded-full">
                  <Globe size={16} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{t('language')}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {t('currentLanguage')}: {languageService.getLanguageName(currentLanguage as any)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowLanguageModal(true)}
                className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all shadow-lg min-h-[44px]"
              >
                <div className="flex items-center justify-center gap-2">
                  <Globe size={14} />
                  <span className="text-sm sm:text-base">{t('changeLanguage')}</span>
                </div>
              </button>
            </div>

            {/* Información adicional */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">{t('whyImportant')}</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t('verificationIncreases')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t('privacyControls')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t('languagePersonalizes')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <IdentityVerification
        isOpen={showVerificationModal}
        currentUserId={currentUserId}
        profilePhotos={[]}
        onClose={() => setShowVerificationModal(false)}
        onVerificationComplete={handleVerificationComplete}
      />

      <LanguageSettings
        isOpen={showLanguageModal}
        onClose={() => {
          setShowLanguageModal(false);
          handleLanguageChange();
        }}
      />

      <StoriesPrivacySettings
        isOpen={showPrivacyModal}
        currentUserId={currentUserId}
        onClose={() => setShowPrivacyModal(false)}
        onSettingsUpdated={handlePrivacyUpdate}
      />

      <PrivacyDashboard
        isOpen={showPrivacyDashboard}
        userId={currentUserId}
        onClose={() => setShowPrivacyDashboard(false)}
      />

      {/* Modal de Confirmación de Eliminación de Cuenta */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            {/* Header con advertencia */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t('deleteAccountTitle') || 'Eliminar Cuenta'}
                </h3>
                <p className="text-sm text-red-600 font-medium">
                  {deleteStep === 'confirm' 
                    ? (t('irreversibleAction') || 'Esta acción es irreversible')
                    : 'Paso 2: Verifica tu identidad'}
                </p>
              </div>
            </div>

            {deleteStep === 'confirm' ? (
              <>
                {/* Advertencias */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-red-900">
                    {t('deleteAccountWarning') || 'Al eliminar tu cuenta:'}
                  </p>
                  <ul className="space-y-1 text-sm text-red-800">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>{t('deleteWarning1') || 'Se eliminarán todos tus datos personales'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>{t('deleteWarning2') || 'Perderás todos tus matches y conversaciones'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>{t('deleteWarning3') || 'Se eliminarán todas tus fotos y stories'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>{t('deleteWarning4') || 'No podrás recuperar tu cuenta'}</span>
                    </li>
                  </ul>
                </div>

                {/* Campo de confirmación */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('deleteConfirmLabel') || 'Para confirmar, escribe'} <span className="font-bold text-red-600">ELIMINAR</span>
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="ELIMINAR"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none text-center font-semibold"
                    disabled={isDeleting}
                  />
                </div>
              </>
            ) : (
              <>
                {/* Campo de contraseña */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-900">
                    🔐 Por seguridad, ingresa tu contraseña para confirmar que eres tú.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none"
                    disabled={isDeleting}
                    autoFocus
                  />
                </div>
              </>
            )}

            {/* Botones */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                  setDeletePassword('');
                  setDeleteStep('confirm');
                }}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                disabled={isDeleting}
              >
                {t('cancel') || 'Cancelar'}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={
                  (deleteStep === 'confirm' && deleteConfirmText !== 'ELIMINAR') ||
                  (deleteStep === 'password' && !deletePassword) ||
                  isDeleting
                }
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  ((deleteStep === 'confirm' && deleteConfirmText === 'ELIMINAR') ||
                   (deleteStep === 'password' && deletePassword)) && !isDeleting
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('deleting') || 'Eliminando...'}
                  </div>
                ) : deleteStep === 'confirm' ? (
                  <div className="flex items-center justify-center gap-2">
                    {t('continue') || 'Continuar'}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Trash2 size={16} />
                    {t('deleteAccountPermanently') || 'Eliminar Permanentemente'}
                  </div>
                )}
              </button>
            </div>

            {/* Nota de soporte */}
            <p className="text-xs text-center text-gray-500">
              {t('deleteAccountSupport') || '¿Necesitas ayuda? Contacta a'} <a href="mailto:tapapatisoporte@gmail.com" className="text-purple-600 hover:underline">tapapatisoporte@gmail.com</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountSettings;