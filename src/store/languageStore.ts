import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '@/lib/i18n/config';
import { DEFAULT_LANGUAGE, langMap } from '@/lib/i18n/config';
// Import the unified translation system
import { getTranslationSync, refreshTranslations } from '@/lib/i18n/loader';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  refresh: () => void;
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
      
      t: (key: string) => {
        const lang = get().language;
        return getTranslationSync(key, lang);
      },
      
      refresh: () => {
        refreshTranslations();
      },
    }),
    {
      name: 'divine_tarot_language',
      skipHydration: true,
    }
  )
);