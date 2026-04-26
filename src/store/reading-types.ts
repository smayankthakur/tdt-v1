'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReadingType = 
  | 'love'
  | 'career'
  | 'finance'
  | 'marriage'
  | 'no_contact'
  | 'general';

interface ReadingLimitState {
  dailyReadings: number;
  lastResetDate: string | null;
  typeUsage: Record<ReadingType, number>;
  isSubscribed: boolean;
  paywallShown: boolean;
  remainingReadings: number; // -1 for unlimited
  
  incrementReading: (type: ReadingType) => void;
  canRead: () => boolean;
  getRemainingReadings: () => number;
  showPaywall: () => boolean;
  setSubscribed: (status: boolean) => void;
  dismissPaywall: () => void;
  resetDaily: () => void;
  checkFromServer: () => Promise<void>; //
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export const useReadingLimitStore = create<ReadingLimitState>()(
  persist(
    (set, get) => ({
      dailyReadings: 0,
      lastResetDate: null,
      typeUsage: {
        love: 0,
        career: 0,
        finance: 0,
        marriage: 0,
        no_contact: 0,
        general: 0,
      },
      isSubscribed: false,
      paywallShown: false,
      remainingReadings: -1, // -1 = unlimited (default for dev)

      incrementReading: (type: ReadingType) => {
        const today = getTodayDate();
        const state = get();
        
        set({
          dailyReadings: state.dailyReadings + 1,
          typeUsage: {
            ...state.typeUsage,
            [type]: state.typeUsage[type] + 1,
          },
          lastResetDate: today,
        });
      },

      canRead: () => {
        const state = get();
        if (state.remainingReadings === -1) return true; // unlimited
        return state.remainingReadings > 0;
      },

      getRemainingReadings: () => {
        const state = get();
        return state.remainingReadings;
      },

      showPaywall: () => {
        const state = get();
        return state.remainingReadings === 0 && !state.isSubscribed;
      },

      setSubscribed: (isSubscribed: boolean) => set({ isSubscribed: isSubscribed, remainingReadings: -1 }),

      dismissPaywall: () => set({ paywallShown: true }),

      resetDaily: () => {
        const today = getTodayDate();
        const state = get();
        if (state.lastResetDate !== today) {
          set({ dailyReadings: 0, lastResetDate: today });
        }
      },

      checkFromServer: async () => {
        // In development without Supabase, keep unlimited
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
          set({ remainingReadings: -1 });
          return;
        }

        try {
          const res = await fetch('/api/reading/limit');
          if (res.ok) {
            const data = await res.json();
            set({
              remainingReadings: data.remaining,
              isSubscribed: data.plan !== 'free',
              dailyReadings: data.used || 0,
            });
          }
        } catch (e) {
          console.error('[Limit check]', e);
        }
      },
    }),
    {
      name: 'reading-limit-storage',
      version: 2,
    }
  )
);

export const READING_TYPES: { id: ReadingType; label: string; emoji: string; icon?: string }[] = [
  { id: 'love', label: 'Love', emoji: '💕' },
  { id: 'career', label: 'Career', emoji: '💼' },
  { id: 'finance', label: 'Finance', emoji: '💰' },
  { id: 'marriage', label: 'Marriage', emoji: '💒' },
  { id: 'no_contact', label: 'No Contact', emoji: '🔇' },
  { id: 'general', label: 'General', emoji: '🔮' },
];