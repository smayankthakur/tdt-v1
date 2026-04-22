'use client';

import { ReactNode, useEffect } from 'react';

interface ContentGuardProps {
  children: ReactNode;
  enabled?: boolean;
}

export default function ContentGuard({ children, enabled = process.env.NODE_ENV !== 'production' }: ContentGuardProps) {
  useEffect(() => {
    if (!enabled) return;

    const checkForRawKeys = () => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        null,
        false
      );

      const rawKeyPattern = /\b([a-z]+\.[a-z]+\.[a-z]+|home\.|nav\.|common\.|hero\.|reading\.|ritualHub\.|chat\.|footer\.)/g;
      const violations: string[] = [];

      let node: Text | null;
      while ((node = walker.nextNode() as Text)) {
        const text = node.textContent?.trim() || '';
        const matches = text.match(rawKeyPattern);
        if (matches) {
          violations.push(...matches);
        }
      }

      if (violations.length > 0) {
        console.error('❌ [ContentGuard] Raw translation keys detected:', violations);
        console.warn('These keys are rendering raw instead of translated. Fix the translation or use the correct key.');
      }
    };

    // Run check after render
    const timer = setTimeout(checkForRawKeys, 1000);
    return () => clearTimeout(timer);
  }, [enabled]);

  return <>{children}</>;
}

export function validateTranslationKey(key: string): boolean {
  const validPrefixes = [
    'common.',
    'nav.',
    'hero.',
    'reading.',
    'ritualHub.',
    'chat.',
    'testimonials.',
    'whySection.',
    'footer.',
    'premium.',
    'urgency.',
    'paywall.',
  ];

  return validPrefixes.some(prefix => key.startsWith(prefix));
}

export function useSafeKey(key: string, fallback?: string): string {
  if (process.env.NODE_ENV !== 'production') {
    if (!validateTranslationKey(key)) {
      console.error(`❌ [ContentGuard] Invalid key format: "${key}". Keys must start with a valid prefix.`);
    }
  }
  return key || fallback || key;
}