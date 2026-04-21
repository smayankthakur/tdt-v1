'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import type { Language } from '@/lib/i18n/config';
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n/config';
// Use unified loader that supports both nested and flat keys
import { getTranslationSync, refreshTranslations } from '@/lib/i18n/loader';

export function useLanguage() {
  const { 
    language, 
    setLanguage: storeSetLanguage,
    t: storeT,
  } = useLanguageStore();
  
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    // Preload translations after hydration
    refreshTranslations();
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    storeSetLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
    // Refresh translations when language changes
    refreshTranslations();
  }, [storeSetLanguage]);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let text = getTranslationSync(key, language);
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
    }
    
    return text;
  }, [language]);

  const getHeroHeadline = useCallback((intent: string = 'default'): string => {
    return getTranslationSync(`hero.headline.${intent}`, language);
  }, [language]);

  const getHeroSubheadline = useCallback((intent: string = 'default'): string => {
    return getTranslationSync(`hero.subheadline.${intent}`, language);
  }, [language]);

  const getCTAText = useCallback((type: string): string => {
    return getTranslationSync(`cta.${type}`, language);
  }, [language]);

  const getPaywallTitle = useCallback((tone: string): string => {
    return getTranslationSync(`paywall.title.${tone}`, language);
  }, [language]);

  const getPaywallDescription = useCallback((tone: string): string => {
    return getTranslationSync(`paywall.description.${tone}`, language);
  }, [language]);

  const getPaywallCTA = useCallback((tone: string): string => {
    return getTranslationSync(`paywall.cta.${tone}`, language);
  }, [language]);

  const getChatButtonText = useCallback((): string => {
    return getTranslationSync('chat.button', language);
  }, [language]);

  const getChatTooltip = useCallback((): string => {
    return getTranslationSync('chat.tooltip', language);
  }, [language]);

  const getReadingTopic = useCallback((topic: string): string => {
    return getTranslationSync(`reading.${topic}`, language);
  }, [language]);

  const getUrgencyBadge = useCallback((): string => {
    const badges = ['urgency.timeSensitive', 'urgency.limitedSpots', 'urgency.endsTonight', 'urgency.lastChance'];
    const randomBadge = badges[Math.floor(Math.random() * badges.length)];
    return getTranslationSync(randomBadge, language);
  }, [language]);

  const isRTL = useMemo(() => {
    return language === 'ar' || language === 'he';
  }, [language]);

  return {
    language,
    setLanguage,
    t,
    isHydrated,
    getHeroHeadline,
    getHeroSubheadline,
    getCTAText,
    getPaywallTitle,
    getPaywallDescription,
    getPaywallCTA,
    getChatButtonText,
    getChatTooltip,
    getReadingTopic,
    getUrgencyBadge,
    isRTL,
  };
}

export function useTranslation() {
  const { language } = useLanguageStore();
  
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let text = getTranslationSync(key, language);
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
    }
    
    return text;
  }, [language]);
  
  return { t, language };
}