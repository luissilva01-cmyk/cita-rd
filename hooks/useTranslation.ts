// cita-rd/hooks/useTranslation.ts
import { useLanguage } from '../contexts/LanguageContext';
import { languageService } from '../services/languageService';

// Re-exportar el hook del contexto para mantener compatibilidad
export const useTranslation = () => {
  const { t, currentLanguage, setLanguage } = useLanguage();
  
  return {
    t,
    currentLanguage,
    translations: languageService.getTranslations(),
    changeLanguage: setLanguage,
    availableLanguages: languageService.getAvailableLanguages()
  };
};

export default useTranslation;