'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TRANSLATIONS } from '@/lib/i18n/translations';

export type Language = 'en' | 'hi' | 'hinglish';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, variables?: Record<string, string>) => string;
}

const getTranslation = (lang: Language, path: string, variables?: Record<string, string>): string => {
  const keys = path.split('.');
  let value: any = TRANSLATIONS[lang];

  for (const key of keys) {
    value = value?.[key];
  }

  if (value === undefined || value === null) {
    // Fallback to English
    value = TRANSLATIONS.en;
    for (const key of keys) {
      value = value?.[key];
    }
  }

  if (value === undefined || value === null) {
    return path;
  }

  let result = String(value);
  
  if (variables) {
    Object.keys(variables).forEach((k) => {
      result = result.replace(`{${k}}`, variables[k]);
    });
  }

  return result;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'hinglish',
      setLanguage: (lang: Language) => set({ language: lang }),
      t: (path: string, variables?: Record<string, string>) => {
        const state = get();
        return getTranslation(state.language, path, variables);
      },
    }),
    {
      name: 'tarot-language',
    }
  )
);