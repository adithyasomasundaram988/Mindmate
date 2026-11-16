import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, getTranslation } from '../locales/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('mindmate_lang');
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
      return 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (langCode) => {
    if (SUPPORTED_LANGUAGES.some(l => l.code === langCode)) {
      setLanguageState(langCode);
      try {
        localStorage.setItem('mindmate_lang', langCode);
      } catch (e) {
        console.warn('Storage error', e);
      }
    }
  };

  const currentLangMeta = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = (key, fallback = '') => {
    return getTranslation(language, key, fallback);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      languages: SUPPORTED_LANGUAGES,
      currentLangMeta,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
