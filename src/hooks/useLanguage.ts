'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import type { Language } from '@/lib/i18n/config';
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n/config';
import { getTranslation } from '@/lib/i18n/translations';

export function useLanguage() {
  const { 
    language, 
    setLanguage: storeSetLanguage,
    t: storeT,
  } = useLanguageStore();
  
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    storeSetLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  }, [storeSetLanguage]);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let text = getTranslation(key, language);
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
    }
    
    return text;
  }, [language]);

  const getHeroHeadline = useCallback((intent: string = 'default'): string => {
    return getTranslation(`hero.headline.${intent}`, language);
  }, [language]);

  const getHeroSubheadline = useCallback((intent: string = 'default'): string => {
    return getTranslation(`hero.subheadline.${intent}`, language);
  }, [language]);

  const getCTAText = useCallback((type: string): string => {
    return getTranslation(`cta.${type}`, language);
  }, [language]);

  const getPaywallTitle = useCallback((tone: string): string => {
    return getTranslation(`paywall.title.${tone}`, language);
  }, [language]);

  const getPaywallDescription = useCallback((tone: string): string => {
    return getTranslation(`paywall.description.${tone}`, language);
  }, [language]);

  const getPaywallCTA = useCallback((tone: string): string => {
    return getTranslation(`paywall.cta.${tone}`, language);
  }, [language]);

  const getChatButtonText = useCallback((): string => {
    return getTranslation('chat.button', language);
  }, [language]);

  const getChatTooltip = useCallback((): string => {
    return getTranslation('chat.tooltip', language);
  }, [language]);

  const getReadingTopic = useCallback((topic: string): string => {
    return getTranslation(`reading.${topic}`, language);
  }, [language]);

  const getUrgencyBadge = useCallback((): string => {
    const badges = ['urgency.timeSensitive', 'urgency.limitedSpots', 'urgency.endsTonight', 'urgency.lastChance'];
    const randomBadge = badges[Math.floor(Math.random() * badges.length)];
    return getTranslation(randomBadge, language);
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
  const { language, t: storeT } = useLanguageStore();
  
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let text = getTranslation(key, language);
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
    }
    
    return text;
  }, [language]);
  
  return { t, language };
}