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

export interface ReadingLimitState {
  dailyReadings: number;
  lastResetDate: string | null;
  typeUsage: Record<ReadingType, number>;
  isSubscribed: boolean;
  paywallShown: boolean;
  
  incrementReading: (type: ReadingType) => void;
  canRead: () => boolean;
  getRemainingReadings: () => number;
  showPaywall: () => boolean;
  setSubscribed: (status: boolean) => void;
  dismissPaywall: () => void;
  resetDaily: () => void;
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
        // Unlimited readings - no limits
        return true;
      },
      
      getRemainingReadings: () => {
        // Unlimited readings
        return 999;
      },
      
      showPaywall: () => {
        // No paywall - unlimited readings
        return false;
      },
      
      setSubscribed: (isSubscribed: boolean) => set({ isSubscribed }),
      
      dismissPaywall: () => set({ paywallShown: true }),
      
      resetDaily: () => {
        const today = getTodayDate();
        const state = get();
        if (state.lastResetDate !== today) {
          set({ dailyReadings: 0, lastResetDate: today });
        }
      },
    }),
    {
      name: 'reading-limit-storage',
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