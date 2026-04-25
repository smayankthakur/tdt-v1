'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  detectLanguageFromText, 
  detectLanguageWithConfidence,
  shouldAutoSwitch,
  lockLanguage,
  isLanguageLocked,
  type DetectedLanguage 
} from '@/lib/languageDetector';
import { 
  detectRegion, 
  getStoredRegion, 
  type UserRegion 
} from '@/lib/regionDetector';
import { Language } from '@/store/languageStore';

const DETECTED_TO_LANGUAGE: Record<DetectedLanguage, Language> = {
  hi: 'hi',
  en: 'en',
  hinglish: 'hinglish',
};

export function useAutoLanguage() {
  const { language, setLanguage, t, isHydrated } = useLanguage();
  const [region, setRegion] = useState<UserRegion>('india');
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);
  
  useEffect(() => {
    if (!isHydrated) return;
    
    const initRegion = async () => {
      try {
        const detectedRegion = await detectRegion();
        setRegion(detectedRegion);
        
        if (!isLanguageLocked() && detectedRegion === 'india') {
          setLanguage('hinglish');
        } else if (!isLanguageLocked()) {
          setLanguage('en');
        }
      } catch (e) {
        console.log('[AutoLanguage] Region init failed:', e);
      }
    };
    
    initRegion();
  }, [isHydrated, setLanguage]);
  
  const handleUserInput = useCallback((text: string) => {
    if (!isHydrated || !text || text.trim().length < 3) {
      return;
    }
    
    if (isLanguageLocked()) {
      return;
    }
    
    const lockedLang = isLanguageLocked();
    if (lockedLang) {
      return;
    }
    
    setIsAutoDetecting(true);
    setDetectionCount(prev => prev + 1);
    
    if (detectionCount < 3) {
      const { language: detectedLang, confidence } = detectLanguageWithConfidence(text);
      
      if (shouldAutoSwitch(language, detectedLang, confidence)) {
        setLanguage(DETECTED_TO_LANGUAGE[detectedLang]);
      }
    }
    
    setIsAutoDetecting(false);
  }, [language, setLanguage, isHydrated, detectionCount]);
  
  const manuallySetLanguage = useCallback((lang: DetectedLanguage) => {
    lockLanguage(lang);
    setLanguage(DETECTED_TO_LANGUAGE[lang]);
  }, [setLanguage]);
  
  const resetLanguageDetection = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('divine_tarot_language_lock');
  }, []);
  
  return {
    language,
    region,
    setLanguage: manuallySetLanguage,
    handleUserInput,
    detectFromText: detectLanguageFromText,
    resetDetection: resetLanguageDetection,
    isAutoDetecting,
    isLocked: !!isLanguageLocked(),
    isHydrated,
    
    pricing: {
      getMonthlyPrice: () => region === 'india' ? 199 : 4.99,
      getYearlyPrice: () => region === 'india' ? 1999 : 49.99,
      getCurrencySymbol: () => region === 'india' ? '₹' : '$',
      getCurrencyCode: () => region === 'india' ? 'INR' : 'USD',
    },
  };
}