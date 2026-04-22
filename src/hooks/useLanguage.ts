'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import type { Language } from '@/lib/i18n/config';
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n/config';
// Use unified loader that supports both nested and flat keys
import { getTranslationSync, refreshTranslations } from '@/lib/i18n/loader';
// Self-healing translation engine
import { resolveTranslation, createFailsafeTranslator, detectLanguageFromText } from '@/lib/i18n/engine';

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
    refreshTranslations();
  }, [storeSetLanguage, refreshTranslations]);

  // Self-healing translator - never shows raw keys
  const safeT = useMemo(() => createFailsafeTranslator(language), [language]);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let text = safeT(key);
    
    // Also try sync as fallback
    if (text === key) {
      text = getTranslationSync(key, language) || key;
    }
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
    }
    
    return text;
  }, [language, safeT]);

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

  // Auto-detect language from user input text
  const detectAndSetFromInput = useCallback((inputText: string) => {
    if (!inputText || inputText.length < 3) return;
    const detected = detectLanguageFromText(inputText);
    if (detected !== language) {
      storeSetLanguage(detected as Language);
    }
  }, [language, storeSetLanguage]);

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
    detectAndSetFromInput,
  };
}

export function useTranslation() {
  const { language } = useLanguageStore();
  
  // Use failsafe translator to prevent raw keys
  const safeT = useMemo(() => createFailsafeTranslator(language), [language]);
  
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let text = safeT(key);
    
    // Fallback to sync if failsafe returns key
    if (text === key) {
      text = getTranslationSync(key, language) || key;
    }
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
    }
    
    return text;
  }, [language, safeT]);
  
  return { t, language };
}