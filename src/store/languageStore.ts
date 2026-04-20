import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '@/lib/i18n/config';
import { DEFAULT_LANGUAGE } from '@/lib/i18n/config';
import { TRANSLATIONS } from '@/lib/i18n/translations';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

function getTranslation(key: string, lang: Language): string {
  const keys = key.split('.');
  let value: unknown = TRANSLATIONS[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: DEFAULT_LANGUAGE,
      
      setLanguage: (lang: Language) => {
        set({ language: lang });
      },
      
      t: (key: string) => {
        const lang = get().language;
        return getTranslation(key, lang);
      },
    }),
    {
      name: 'divine-tarot-language',
      skipHydration: true,
    }
  )
);