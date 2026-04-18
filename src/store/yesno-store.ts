'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type YesNoResult = 'YES' | 'NO' | 'MAYBE';

interface YesNoState {
  // Reading count tracking
  yesNoReadings: number;
  todayReadings: number;
  lastReadDate: string | null;
  
  // Referrals
  referredBy: string | null;
  referralCode: string;
  referralsUsed: number;
  
  // Current reading
  question: string;
  result: YesNoResult | null;
  card: string | null;
  isLoading: boolean;
  
  // Paywall state
  paywallShown: boolean;
  paywallDismissedCount: number;
  
  // Actions
  incrementReading: () => void;
  setQuestion: (q: string) => void;
  setResult: (result: YesNoResult, card: string) => void;
  setPaywallShown: (shown: boolean) => void;
  dismissPaywall: () => void;
  setReferralCode: (code: string) => void;
  setReferredBy: (code: string | null) => void;
  resetDaily: () => void;
  canRead: () => boolean;
  getRemainingReadings: () => number;
  shouldShowHint: () => boolean;
}

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export const useYesNoStore = create<YesNoState>()(
  persist(
    (set, get) => ({
      yesNoReadings: 0,
      todayReadings: 0,
      lastReadDate: null,
      referredBy: null,
      referralCode: generateReferralCode(),
      referralsUsed: 0,
      question: '',
      result: null,
      card: null,
      isLoading: false,
      paywallShown: false,
      paywallDismissedCount: 0,

      incrementReading: () => {
        const today = getTodayDate();
        const state = get();
        
        set({
          yesNoReadings: state.yesNoReadings + 1,
          lastReadDate: today,
          todayReadings: today === state.lastReadDate 
            ? state.todayReadings + 1 
            : 1,
        });
      },

      setQuestion: (question) => set({ question }),
      
      setResult: (result, card) => set({ 
        result, 
        card,
        isLoading: false 
      }),
      
      setPaywallShown: (paywallShown) => set({ paywallShown }),
      
      dismissPaywall: () => set((state) => ({ 
        paywallDismissedCount: state.paywallDismissedCount + 1 
      })),
      
      setReferralCode: (referralCode) => set({ referralCode }),
      
      setReferredBy: (referredBy) => set({ referredBy }),
      
      resetDaily: () => {
        const today = getTodayDate();
        const state = get();
        if (state.lastReadDate !== today) {
          set({ todayReadings: 0 });
        }
      },
      
      canRead: () => {
        // Unlimited readings
        return true;
      },
      
      getRemainingReadings: () => {
        // Unlimited readings
        return 999;
      },
      
      shouldShowHint: () => {
        const state = get();
        // Show hint after 2nd reading
        return state.yesNoReadings >= 1 && state.yesNoReadings < 3;
      },
    }),
    {
      name: 'yesno-storage',
    }
  )
);