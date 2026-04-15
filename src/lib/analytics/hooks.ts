'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  initGA4, 
  trackPageView, 
  trackConversionEvent, 
  trackUserInteraction,
  trackScrollDepth,
  trackTimeOnPage 
} from './ga4';
import { initClarity, initClarityForPage } from './clarity';

let initialized = false;

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollTracked = useRef<Set<number>>(new Set());
  const timeTracker = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    if (!initialized) {
      initGA4();
      initClarity();
      initialized = true;
    }
  }, []);

  useEffect(() => {
    const pagePath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(pagePath);
    initClarityForPage(pathname);
    startTime.current = Date.now();
    scrollTracked.current.clear();
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      const thresholds = [25, 50, 75, 100];
      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !scrollTracked.current.has(threshold)) {
          scrollTracked.current.add(threshold);
          trackScrollDepth(threshold, pathname);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    timeTracker.current = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime.current) / 1000);
      if (seconds % 30 === 0) {
        trackTimeOnPage(seconds, pathname);
      }
    }, 1000);

    return () => {
      if (timeTracker.current) {
        clearInterval(timeTracker.current);
      }
    };
  }, [pathname]);

  const trackClick = useCallback((element: string, section: string, metadata?: Record<string, any>) => {
    trackUserInteraction(element, section, 'click', metadata);
  }, []);

  const trackConversion = useCallback((eventName: string, metadata?: Record<string, any>) => {
    trackConversionEvent(eventName, metadata);
  }, []);

  const trackCustom = useCallback((category: string, action: string, label?: string, metadata?: Record<string, any>) => {
    trackUserInteraction(action, category, 'custom', { label, ...metadata });
  }, []);

  return {
    trackClick,
    trackConversion,
    trackCustom,
  };
}

export function useTrackButton() {
  const { trackClick, trackConversion } = useAnalytics();

  return useCallback((buttonName: string, section: string, conversionEvent?: string, metadata?: Record<string, any>) => {
    trackClick(buttonName, section, metadata);
    if (conversionEvent) {
      trackConversion(conversionEvent, metadata);
    }
  }, [trackClick, trackConversion]);
}

export function useScrollTracker() {
  const { trackClick } = useAnalytics();

  return useCallback((depth: number, section: string) => {
    trackClick(`${depth}% scroll`, section);
  }, [trackClick]);
}