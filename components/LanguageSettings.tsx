// cita-rd/components/LanguageSettings.tsx
import React from 'react';
import { X, Globe, Check } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../services/languageService';

interface LanguageSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  isOpen,
  onClose
}) => {
  const { currentLanguage, t, changeLanguage, availableLanguages } = useTranslation();

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language);
    // Cerrar modal después de un breve delay para mostrar el cambio
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Globe className="text-blue-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900">{t('language')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6 text-center">
            {t('selectLanguage')}
          </p>
          
          <div className="space-y-3">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all hover:bg-gray-50 ${
                  currentLanguage === lang.code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {lang.code === 'es' && '🇪🇸'}
                    {lang.code === 'en' && '🇺🇸'}
                    {lang.code === 'pt' && '🇧🇷'}
                    {lang.code === 'fr' && '🇫🇷'}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{lang.nativeName}</p>
                    <p className="text-sm text-gray-500">{lang.name}</p>
                  </div>
                </div>
                
                {currentLanguage === lang.code && (
                  <Check className="text-blue-500" size={20} />
                )}
              </button>
            ))}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Globe className="text-blue-500 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  {currentLanguage === 'es' ? 'Cambio instantáneo' : 
                   currentLanguage === 'en' ? 'Instant change' :
                   currentLanguage === 'pt' ? 'Mudança instantânea' :
                   'Changement instantané'}
                </h4>
                <p className="text-sm text-blue-700">
                  {currentLanguage === 'es' ? 'El idioma se cambia inmediatamente en toda la aplicación.' :
                   currentLanguage === 'en' ? 'The language changes immediately throughout the app.' :
                   currentLanguage === 'pt' ? 'O idioma muda imediatamente em todo o aplicativo.' :
                   'La langue change immédiatement dans toute l\'application.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;