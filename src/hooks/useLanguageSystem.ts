import { useCallback, useEffect, useState } from 'react';
import type { Language } from '@/lib/i18n/config';
import { useLanguageStore } from '@/store/languageStore';
import { useAutoLanguage } from '@/hooks/useAutoLanguage';

export interface UseLanguageOptions {
  autoDetect?: boolean;
  persistKey?: string;
}

export function useLanguageSystem(options: UseLanguageOptions = {}) {
  const { autoDetect = true, persistKey = 'divine_tarot_language' } = options;
  
  const { 
    language: lang, 
    setLanguage: storeSetLanguage,
    isHydrated 
  } = useLanguageStore();
  
  const { detectedLanguage, detectFromText } = useAutoLanguage();
  const [manualOverride, setManualOverride] = useState(false);
  
  // Set language with persistence
  const setLanguage = useCallback((newLang: Language) => {
    storeSetLanguage(newLang);
    setManualOverride(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(persistKey, newLang);
    }
  }, [storeSetLanguage, persistKey]);
  
  // Auto-detect from text input when enabled and no manual override
  const detectLanguageFromText = useCallback((text: string) => {
    if (autoDetect && !manualOverride) {
      const detected = detectFromText(text);
      if (detected && detected !== lang) {
        storeSetLanguage(detected);
        if (typeof window !== 'undefined') {
          localStorage.setItem(persistKey, detected);
        }
      }
    }
  }, [autoDetect, manualOverride, detectFromText, lang, storeSetLanguage, persistKey]);
  
  // Reset manual override - allows auto-detection again
  const allowAutoDetect = useCallback(() => {
    setManualOverride(false);
  }, []);
  
  // Get current language code
  const currentLang = lang;
  
  // Get display name for current language
  const languageName = {
    en: 'English',
    hi: 'हिंदी',
    hinglish: 'Hinglish',
  }[lang] || 'English';
  
  return {
    lang,
    setLanguage,
    isHydrated,
    manualOverride,
    setManualOverride,
    detectLanguageFromText,
    allowAutoDetect,
    currentLang,
    languageName,
    languageOptions: [
      { code: 'en', name: 'English', label: 'English' },
      { code: 'hi', name: 'हिंदी', label: 'हिंदी' },
      { code: 'hinglish', name: 'Hinglish', label: 'Hinglish' },
    ],
  };
}

export default useLanguageSystem;