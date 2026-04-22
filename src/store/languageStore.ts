import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '@/lib/i18n/config';
import { DEFAULT_LANGUAGE } from '@/lib/i18n/config';
// Use new self-healing translation system
import { t as translate, SupportedLanguage } from '@/i18n';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: DEFAULT_LANGUAGE,

      setLanguage: (lang: Language) => {
        set({ language: lang });
        if (typeof window !== 'undefined') {
          localStorage.setItem('divine_tarot_language', lang);
        }
      },

      t: (key: string, params?: Record<string, string | number>) => {
        const lang = get().language as SupportedLanguage;
        return translate(key, lang, params);
      },
    }),
    {
      name: 'divine_tarot_language',
      skipHydration: true,
    }
  )
);