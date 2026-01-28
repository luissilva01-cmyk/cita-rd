// cita-rd/contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { languageService, Language, Translations } from '../services/languageService';

interface LanguageContextType {
  currentLanguage: Language;
  translations: Translations;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languageService.getCurrentLanguage());
  const [translations, setTranslations] = useState<Translations>(languageService.getTranslations());

  useEffect(() => {
    // Suscribirse a cambios de idioma
    const unsubscribe = languageService.subscribe((newLanguage) => {
      console.log('🌍 LanguageProvider - Idioma cambiado a:', newLanguage);
      setCurrentLanguage(newLanguage);
      setTranslations(languageService.getTranslations());
    });

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleSetLanguage = (language: Language) => {
    console.log('🌍 LanguageProvider - Cambiando idioma a:', language);
    languageService.setLanguage(language);
  };

  const t = (key: keyof Translations, params?: Record<string, string>): string => {
    return languageService.t(key, params);
  };

  const value: LanguageContextType = {
    currentLanguage,
    translations,
    setLanguage: handleSetLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para usar el contexto de idioma
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage debe ser usado dentro de un LanguageProvider');
  }
  return context;
};

export default LanguageContext;