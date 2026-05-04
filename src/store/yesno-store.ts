'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type YesNoResult = 'YES' | 'NO' | 'MAYBE';

interface YesNoState {
  // Reading history
  yesNoReadings: number;
  history: Array<{
    question: string;
    result: YesNoResult;
    card: string;
    timestamp: string;
  }>;

  // Current reading
  question: string;
  result: YesNoResult | null;
  card: string | null;

  // Actions
  incrementReading: () => void;
  setQuestion: (q: string) => void;
  setResult: (result: YesNoResult, card: string) => void;
  addHistory: (question: string, result: YesNoResult, card: string) => void;
  clearHistory: () => void;
  reset: () => void;
}

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const useYesNoStore = create<YesNoState>()(
  persist(
    (set, get) => ({
      yesNoReadings: 0,
      history: [],
      question: '',
      result: null,
      card: null,

      incrementReading: () => {
        set((state) => ({
          yesNoReadings: state.yesNoReadings + 1,
        }));
      },

      setQuestion: (question) => set({ question }),

      setResult: (result, card) => set({ result, card }),

      addHistory: (question, result, card) => {
        set((state) => ({
          history: [
            { question, result, card, timestamp: new Date().toISOString() },
            ...state.history.slice(0, 49),
          ],
        }));
      },

      clearHistory: () => set({ history: [] }),

      reset: () => {
        set({
          yesNoReadings: 0,
          history: [],
          question: '',
          result: null,
          card: null,
        });
      },
    }),
    {
      name: 'yesno-storage-free',
    }
  )
);
