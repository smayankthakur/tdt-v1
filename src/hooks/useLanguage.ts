'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import type { Language } from '@/store/languageStore';
import { detectLanguageFromText } from '@/lib/languageDetector';

export function useLanguage() {
  const { language, setLanguage, t: baseT } = useLanguageStore();

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Wrap base t to provide same interface
  const t = useCallback((key: string, variables?: Record<string, string>) => {
    return baseT(key, variables);
  }, [baseT]);

  const setLanguageSafe = useCallback((lang: Language) => {
    setLanguage(lang);
  }, [setLanguage]);

  const getHeroHeadline = useCallback((type: string): string => {
    return t(`hero.headline.${type}`);
  }, [t]);

  const getHeroSubheadline = useCallback((type: string): string => {
    return t(`hero.subheadline.${type}`);
  }, [t]);

  const getCTAText = useCallback((key: string): string => {
    return t(`cta.${key}`);
  }, [t]);

  const getPaywallTitle = useCallback((tone: string): string => {
    return t(`paywall.title.${tone}`);
  }, [t]);
  
  const getPaywallDescription = useCallback((tone: string): string => {
    return t(`paywall.description.${tone}`);
  }, [t]);

  const getPaywallCTA = useCallback((tone: string): string => {
    return t(`paywall.cta.${tone}`);
  }, [t]);

  const getChatButtonText = useCallback((): string => {
    return t('chat.button');
  }, [t]);

  const getChatTooltip = useCallback((): string => {
    return t('chat.tooltip');
  }, [t]);

  const getReadingTopic = useCallback((topic: string): string => {
    return t(`reading.${topic}`);
  }, [t]);

  const getUrgencyBadge = useCallback((): string => {
    const badges = ['urgency.timeSensitive', 'urgency.limitedSpots', 'urgency.endsTonight', 'urgency.lastChance'];
    const randomBadge = badges[Math.floor(Math.random() * badges.length)];
    return t(randomBadge);
  }, [t]);

   const isRTL = useMemo(() => {
     return false; // Only en/hi/hinglish supported; none are RTL
   }, [language]);

  const detectAndSetFromInput = useCallback((inputText: string) => {
    if (!inputText || inputText.length < 3) return;
    const detected = detectLanguageFromText(inputText);
    if (detected !== language) {
      setLanguage(detected as Language);
    }
  }, [language, setLanguage]);

  return {
    language,
    setLanguage: setLanguageSafe,
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
