'use client';

import { create } from 'zustand';
import { FunnelStage } from '@/lib/ginniTriggers';

interface FunnelState {
  currentStage: FunnelStage;
  question: string;
  selectedCards: string[];
  readingCount: number;
  setCurrentStage: (stage: FunnelStage) => void;
  setQuestion: (question: string) => void;
  setSelectedCards: (cards: string[]) => void;
  incrementReadingCount: () => void;
  reset: () => void;
}

export const useFunnelStore = create<FunnelState>((set) => ({
  currentStage: 'homepage',
  question: '',
  selectedCards: [],
  readingCount: 0,

  setCurrentStage: (stage) => set({ currentStage: stage }),
  
  setQuestion: (question) => set({ question }),
  
  setSelectedCards: (cards) => set({ selectedCards: cards }),
  
  incrementReadingCount: () => set((state) => ({ 
    readingCount: state.readingCount + 1 
  })),
  
  reset: () => set({
    currentStage: 'homepage',
    question: '',
    selectedCards: [],
  })
}));