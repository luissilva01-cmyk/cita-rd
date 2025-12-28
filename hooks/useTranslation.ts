// cita-rd/hooks/useTranslation.ts
import { useState, useEffect } from 'react';
import { languageService, Language, Translations } from '../services/languageService';

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languageService.getCurrentLanguage()
  );
  const [translations, setTranslations] = useState<Translations>(
    languageService.getTranslations()
  );

  useEffect(() => {
    // Suscribirse a cambios de idioma
    const unsubscribe = languageService.subscribe((newLanguage) => {
      setCurrentLanguage(newLanguage);
      setTranslations(languageService.getTranslations());
    });

    return unsubscribe;
  }, []);

  // Función para obtener traducción con parámetros
  const t = (key: keyof Translations, params?: Record<string, string>): string => {
    return languageService.t(key, params);
  };

  // Función para cambiar idioma
  const changeLanguage = (language: Language) => {
    languageService.setLanguage(language);
  };

  return {
    currentLanguage,
    translations,
    t,
    changeLanguage,
    availableLanguages: languageService.getAvailableLanguages()
  };
};

export default useTranslation;