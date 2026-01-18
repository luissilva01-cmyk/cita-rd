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
    console.log('🌍 LanguageSettings - Cambiando idioma de', currentLanguage, 'a', language);
    changeLanguage(language);
    // Cerrar modal después de un breve delay para mostrar el cambio
    setTimeout(() => {
      onClose();
    }, 300);
  };

  console.log('🌍 LanguageSettings - Idioma actual:', currentLanguage);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <Globe className="text-blue-500" size={20} />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('language')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <p className="text-gray-600 mb-4 sm:mb-6 text-center text-sm sm:text-base">
            {t('selectLanguage')}
          </p>
          
          <div className="space-y-2 sm:space-y-3">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-between p-3 sm:p-4 border-2 rounded-xl transition-all hover:bg-gray-50 min-h-[56px] sm:min-h-[60px] ${
                  currentLanguage === lang.code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-xl sm:text-2xl">
                    {lang.code === 'es' && '🇪🇸'}
                    {lang.code === 'en' && '🇺🇸'}
                    {lang.code === 'pt' && '🇧🇷'}
                    {lang.code === 'fr' && '🇫🇷'}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{lang.nativeName}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{lang.name}</p>
                  </div>
                </div>
                
                {currentLanguage === lang.code && (
                  <Check className="text-blue-500" size={18} />
                )}
              </button>
            ))}
          </div>

          {/* Info */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-2 sm:gap-3">
              <Globe className="text-blue-500 mt-0.5" size={18} />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">
                  {t('instantChange')}
                </h4>
                <p className="text-xs sm:text-sm text-blue-700">
                  {t('languageChangesImmediately')}
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