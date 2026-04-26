'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SelectedCard } from '@/lib/tarot/logic';
import type { ReadingType } from '@/store/reading-types';

export type ReadingStage =
  | 'idle'
  | 'starting'
  | 'processing'
  | 'streaming'
  | 'complete'
  | 'error';

interface ReadingSession {
  jobId: string | null;
  stage: ReadingStage;
  error: string | null;
  cards: SelectedCard[] | null;
  content: string;
  question: string;
  userName: string;
  language: string;
  readingType: ReadingType | null;
  isLocked: boolean;
  
  startSession: (params: {
    question: string;
    userName: string;
    language: string;
    readingType: ReadingType;
    cards: SelectedCard[];
  }) => Promise<void>;
  updateFromStream: (event: { type: string; data?: any }) => void;
  setError: (error: string | null) => void;
  complete: () => void;
  unlock: () => void;
  reset: () => void;
}

const getGlobalSSE = () => (window as any).__readingSSE;
const setGlobalSSE = (sse: EventSource | null) => {
  (window as any).__readingSSE = sse;
};

function connectToStream(jobId: string, updateFn: (event: { type: string; data?: any }) => void) {
  const existing = getGlobalSSE();
  if (existing) existing.close();

  const eventSource = new EventSource(`/api/reading/stream?jobId=${jobId}`);
  setGlobalSSE(eventSource);

  eventSource.onopen = () => console.log('[SSE] Connected for job:', jobId);

  eventSource.addEventListener('cards', (e: MessageEvent) => {
    try {
      const cards = JSON.parse(e.data);
      updateFn({ type: 'cards', data: cards });
    } catch (err) {
      console.error('[SSE] Cards parse error:', err);
    }
  });

  eventSource.addEventListener('content', (e: MessageEvent) => {
    updateFn({ type: 'content', data: e.data });
  });

  eventSource.addEventListener('done', () => {
    eventSource.close();
    setGlobalSSE(null);
    updateFn({ type: 'done' });
  });

  eventSource.addEventListener('error', (e: MessageEvent) => {
    let errorMsg = 'Reading failed';
    try {
      const data = JSON.parse(e.data);
      errorMsg = data.error || errorMsg;
    } catch {}
    updateFn({ type: 'error', data: { error: errorMsg } });
    eventSource.close();
    setGlobalSSE(null);
  });

  eventSource.onerror = () => {
    eventSource.close();
    setGlobalSSE(null);
  };
}

export const useReadingSession = create<ReadingSession>()(
  persist(
    (set, get) => ({
      jobId: null,
      stage: 'idle',
      error: null,
      cards: null,
      content: '',
      question: '',
      userName: '',
      language: 'en',
      readingType: null,
      isLocked: false,

      startSession: async (params) => {
        if (get().isLocked) {
          console.log('[ReadingSession] Already locked, ignoring duplicate start');
          return;
        }

        const { question, userName, language, readingType, cards } = params;

        set({ 
          isLocked: true, 
          question, 
          userName, 
          language, 
          readingType, 
          cards, 
          stage: 'starting', 
          error: null 
        });

        try {
          const response = await fetch('/api/reading/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              question,
              selectedCards: cards,
              language,
              name: userName,
              topic: readingType,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            const errorMsg = data.error || 'Failed to start reading';
            set({ error: errorMsg, stage: 'error', isLocked: false });
            return;
          }

          const jobId = data.jobId;
          if (!jobId) throw new Error('No jobId returned');

          set({ jobId, stage: 'processing' });
          connectToStream(jobId, get().updateFromStream);
        } catch (err: any) {
          console.error('[ReadingSession] Start error:', err);
          set({ error: err.message || 'Network error', stage: 'error', isLocked: false });
        }
      },

      updateFromStream: (event) => {
        const { type, data } = event;
        set((prev) => {
          switch (type) {
            case 'cards':
              return { ...prev, cards: data };
            case 'content':
              return { ...prev, content: prev.content + (data || '') };
            case 'done':
              return { stage: 'complete', isLocked: false };
            case 'error':
              return { error: data?.error || 'Reading failed', stage: 'error' };
            default:
              return prev;
          }
        });
      },

      setError: (error) => set({ error }),

      complete: () => set({ stage: 'complete' }),

      unlock: () => set({ isLocked: false }),

      reset: () => {
        const sse = getGlobalSSE();
        if (sse) {
          sse.close();
          setGlobalSSE(null);
        }
        set({
          jobId: null,
          stage: 'idle',
          error: null,
          cards: null,
          content: '',
          question: '',
          userName: '',
          language: 'en',
          readingType: null,
          isLocked: false,
        });
      },
    }),
    {
      name: 'reading-session-storage',
      partialize: () => ({}),
    }
  )
);
