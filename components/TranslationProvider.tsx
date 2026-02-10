'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '@/translations/en.json';
import es from '@/translations/es.json';

type Translations = Record<string, any>;

type TranslationContextType = {
  t: (key: string) => string;
  locale: string;
  setLocale: (locale: string) => void;
};

const TranslationContext = createContext<TranslationContextType>({
  t: (key: string) => key,
  locale: 'es',
  setLocale: () => {},
});

const translations: Record<string, Translations> = { en, es };

function getNestedValue(obj: any, path: string): string | undefined {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  return typeof current === 'string' ? current : undefined;
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState('es'); // Default to Spanish

  useEffect(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('mhf-locale');
    if (saved && translations[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: string) => {
    if (translations[newLocale]) {
      setLocaleState(newLocale);
      localStorage.setItem('mhf-locale', newLocale);
    }
  }, []);

  const t = useCallback((key: string): string => {
    // Try current locale first, fall back to Spanish, then English, then return key
    return (
      getNestedValue(translations[locale], key) ??
      getNestedValue(translations['es'], key) ??
      getNestedValue(translations['en'], key) ??
      key
    );
  }, [locale]);

  return (
    <TranslationContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  return useContext(TranslationContext);
}
