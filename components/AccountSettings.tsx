// cita-rd/components/AccountSettings.tsx
import React, { useState, useEffect } from 'react';
import { X, Shield, Globe, Lock, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import IdentityVerification from './IdentityVerification';
import LanguageSettings from './LanguageSettings';
import StoriesPrivacySettings from './StoriesPrivacySettings';
import VerificationBadge from './VerificationBadge';
import { verificationService } from '../services/verificationService';
import { languageService } from '../services/languageService';
import { useTranslation } from '../hooks/useTranslation';

interface AccountSettingsProps {
  isOpen: boolean;
  currentUserId: string;
  onClose: () => void;
  onSettingsUpdated?: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  isOpen,
  currentUserId,
  onClose,
  onSettingsUpdated
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'verification' | 'privacy' | 'language'>('verification');
  const [isVerified, setIsVerified] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white w-full max-w-md mx-4 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">{t('accountSettings')}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            
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
              
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="w-full py-3 px-4 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-all shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <Settings size={16} />
                  {t('configurePrivacy')}
                </div>
              </button>
            </div>

            {/* Idioma */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500 rounded-full">
                  <Globe size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('language')}</h3>
                  <p className="text-sm text-gray-600">
                    {t('currentLanguage')}: {languageService.getLanguageName(currentLanguage as any)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowLanguageModal(true)}
                className="w-full py-3 px-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <Globe size={16} />
                  {t('changeLanguage')}
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
    </>
  );
};

export default AccountSettings;