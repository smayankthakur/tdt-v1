'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReadingType = 
  | 'detailed'
  | 'yesno'
  | 'daily'
  | 'union'
  | 'thirdparty'
  | 'shaadi'
  | 'soulmate'
  | 'baby'
  | 'partner'
  | 'spiritual'
  | 'month'
  | 'universe'
  | 'action'
  | 'relationship';

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
        detailed: 0,
        yesno: 0,
        daily: 0,
        union: 0,
        thirdparty: 0,
        shaadi: 0,
        soulmate: 0,
        baby: 0,
        partner: 0,
        spiritual: 0,
        month: 0,
        universe: 0,
        action: 0,
        relationship: 0,
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
  { id: 'detailed', label: 'Detailed Reading', emoji: '🔮' },
  { id: 'yesno', label: 'Yes / No', emoji: '⚡' },
  { id: 'daily', label: 'Aaj ka din', emoji: '☀️' },
  { id: 'union', label: 'Union Kab', emoji: '💕' },
  { id: 'thirdparty', label: 'Third Party End', emoji: '🚫' },
  { id: 'shaadi', label: 'Shaadi Kab', emoji: '💒' },
  { id: 'soulmate', label: 'Soulmate Kab', emoji: '✨' },
  { id: 'baby', label: 'Baby Kab', emoji: '👶' },
  { id: 'partner', label: 'Partner Feelings', emoji: '💭' },
  { id: 'spiritual', label: 'Spiritual Journey', emoji: '🧘' },
  { id: 'month', label: 'This Month', emoji: '📅' },
  { id: 'universe', label: 'Universe Guidance', emoji: '🌟' },
  { id: 'action', label: 'Partner Next Action', emoji: '👁️' },
  { id: 'relationship', label: 'Relationship (Past-Present-Future)', emoji: '📈' },
];