'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useReadingSession } from '@/store/reading-session';
import { useReadingStore } from '@/store/reading-store';
import { useReadingLimitStore } from '@/store/reading-types';
import type { SelectedCard } from '@/lib/tarot/logic';

export function useTarotReading() {
  const sessionStore = useReadingSession();
  const readingStore = useReadingStore();
  const limitStore = useReadingLimitStore();
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup polling/timeout on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startReading = useCallback(async (params: {
    question: string;
    userName: string;
    language: string;
    readingType: string;
    cards: SelectedCard[];
  }) => {
    if (!limitStore.canRead()) {
      sessionStore.setError('Daily limit exceeded');
      return;
    }

    readingStore.setDeck(params.cards.map(c => c.card));
    readingStore.setSelectedCardsWithDetails(params.cards);
    readingStore.setQuestion(params.question);
    readingStore.setUserName(params.userName);

    await sessionStore.startSession({
      ...params,
      readingType: params.readingType as any,
    });

    // Fallback polling if SSE doesn't establish within 3s
    timeoutRef.current = setTimeout(() => {
      if (sessionStore.jobId && sessionStore.stage === 'processing') {
        startPolling(sessionStore.jobId);
      }
    }, 3000);
  }, [sessionStore, readingStore, limitStore]);

  const startPolling = useCallback((jobId: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/reading/status?jobId=${jobId}`);
        const data = await res.json();

        if (data.status === 'completed' && data.result) {
          clearInterval(pollingRef.current!);
          sessionStore.complete();
          readingStore.setReadingResult(data.result.reading || data.result.interpretation || '');
          limitStore.incrementReading(sessionStore.readingType as any);
        } else if (data.status === 'failed') {
          clearInterval(pollingRef.current!);
          sessionStore.setError(data.error || 'Reading failed');
        }
      } catch (e) {
        // ignore
      }
    }, 1000);
  }, [sessionStore, readingStore, limitStore]);

  const reset = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    sessionStore.reset();
    readingStore.reset();
  }, [sessionStore, readingStore]);

  return {
    startReading,
    reset,
    isActive: sessionStore.isLocked || ['processing', 'streaming'].includes(sessionStore.stage),
    isLoading: sessionStore.stage === 'processing' || sessionStore.stage === 'starting',
    stage: sessionStore.stage,
    content: sessionStore.content,
    error: sessionStore.error,
    hasError: sessionStore.stage === 'error' && !!sessionStore.error,
  };
}
