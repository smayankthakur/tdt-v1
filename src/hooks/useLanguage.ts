'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import type { Language } from '@/lib/i18n/config';
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n/config';
import { getTranslationSync, refreshTranslations } from '@/lib/i18n/loader';
import { detectLanguageFromText } from '@/lib/languageDetector';

export function useLanguage() {
  const {
    language,
    setLanguage: storeSetLanguage,
    t: storeT,
  } = useLanguageStore();

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    refreshTranslations();
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    storeSetLanguage(lang);
    refreshTranslations();
  }, [storeSetLanguage]);

  // Direct t from store (self-healing)
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    return storeT(key, params);
  }, [storeT]);

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

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    return storeT(key, params);
  }, [storeT]);

  return { t, language };
}