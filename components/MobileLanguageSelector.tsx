// cita-rd/components/MobileLanguageSelector.tsx
import React, { useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../services/languageService';

interface MobileLanguageSelectorProps {
  compact?: boolean;
  showLabel?: boolean;
}

const MobileLanguageSelector: React.FC<MobileLanguageSelectorProps> = ({
  compact = false,
  showLabel = true
}) => {
  const { currentLanguage, t, changeLanguage, availableLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (language: Language) => {
    console.log('🌍 MobileLanguageSelector - Cambiando idioma a:', language);
    changeLanguage(language);
    setIsOpen(false);
  };

  const getCurrentLanguageInfo = () => {
    return availableLanguages.find(lang => lang.code === currentLanguage) || availableLanguages[0];
  };

  const currentLang = getCurrentLanguageInfo();

  if (compact) {
    // Versión compacta para espacios reducidos
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px]"
        >
          <div className="text-lg">
            {currentLang.code === 'es' && '🇪🇸'}
            {currentLang.code === 'en' && '🇺🇸'}
            {currentLang.code === 'pt' && '🇧🇷'}
            {currentLang.code === 'fr' && '🇫🇷'}
          </div>
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            {/* Overlay para cerrar */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    currentLanguage === lang.code ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="text-lg">
                    {lang.code === 'es' && '🇪🇸'}
                    {lang.code === 'en' && '🇺🇸'}
                    {lang.code === 'pt' && '🇧🇷'}
                    {lang.code === 'fr' && '🇫🇷'}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-gray-900 text-sm">{lang.nativeName}</p>
                    <p className="text-xs text-gray-500">{lang.name}</p>
                  </div>
                  {currentLanguage === lang.code && (
                    <Check className="text-blue-500" size={16} />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Versión completa para uso en configuraciones
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 sm:p-4 border border-green-100">
      {showLabel && (
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <div className="p-1.5 sm:p-2 bg-green-500 rounded-full">
            <Globe size={16} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{t('language')}</h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              {t('currentLanguage')}: {currentLang.nativeName}
            </p>
          </div>
        </div>
      )}
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 sm:p-4 bg-white border border-green-200 rounded-xl hover:bg-green-50 transition-all min-h-[44px]"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-lg sm:text-xl">
              {currentLang.code === 'es' && '🇪🇸'}
              {currentLang.code === 'en' && '🇺🇸'}
              {currentLang.code === 'pt' && '🇧🇷'}
              {currentLang.code === 'fr' && '🇫🇷'}
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm sm:text-base">{currentLang.nativeName}</p>
              <p className="text-xs sm:text-sm text-gray-500">{currentLang.name}</p>
            </div>
          </div>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            {/* Overlay para cerrar */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[300px] overflow-y-auto">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl min-h-[56px] ${
                    currentLanguage === lang.code ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="text-lg sm:text-xl">
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
                    <Check className="text-blue-500" size={16} />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Información adicional */}
      <div className="mt-3 p-2 sm:p-3 bg-green-100 rounded-lg">
        <p className="text-xs sm:text-sm text-green-700 text-center">
          {t('languageChangesImmediately')}
        </p>
      </div>
    </div>
  );
};

export default MobileLanguageSelector;