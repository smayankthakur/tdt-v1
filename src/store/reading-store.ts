'use client';

import { create } from 'zustand';
import { TarotCard, getRandomCards } from '@/data/tarot';

interface ReadingState {
  question: string;
  deck: TarotCard[];
  selectedCards: TarotCard[];
  readingResult: string;
  currentStep: number;
  isLoading: boolean;
  setQuestion: (question: string) => void;
  setDeck: (deck: TarotCard[]) => void;
  selectCard: (card: TarotCard) => void;
  setReadingResult: (result: string) => void;
  setCurrentStep: (step: number) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useReadingStore = create<ReadingState>((set) => ({
  question: '',
  deck: getRandomCards(7),
  selectedCards: [],
  readingResult: '',
  currentStep: 1,
  isLoading: false,

  setQuestion: (question) => set({ question }),

  setDeck: (deck) => set({ deck }),

  selectCard: (card) => set((state) => {
    if (state.selectedCards.length >= 3) return state;
    if (state.selectedCards.some((c) => c.id === card.id)) return state;
    return { selectedCards: [...state.selectedCards, card] };
  }),

  setReadingResult: (result) => set({ readingResult: result }),

  setCurrentStep: (step) => set({ currentStep: step }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  reset: () => set({
    question: '',
    deck: getRandomCards(7),
    selectedCards: [],
    readingResult: '',
    currentStep: 1,
    isLoading: false,
  }),
}));