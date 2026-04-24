'use client';

import { create } from 'zustand';
import { TarotCard, SelectedCard, getAllCards } from '@/lib/tarot/logic';

interface ReadingState {
  question: string;
  deck: TarotCard[];
  selectedCards: TarotCard[];
  selectedCardsWithDetails: SelectedCard[];
  readingResult: string;
  currentStep: number;
  isLoading: boolean;
  analysis: { theme: string; emotion: string; hiddenInsight: string } | null;
  userName: string;
  setQuestion: (question: string) => void;
  setDeck: (deck: TarotCard[]) => void;
  selectCard: (card: TarotCard) => void;
  setReadingResult: (result: string) => void;
  setCurrentStep: (step: number) => void;
  setIsLoading: (loading: boolean) => void;
  setAnalysis: (analysis: { theme: string; emotion: string; hiddenInsight: string }) => void;
  setSelectedCardsWithDetails: (cards: SelectedCard[]) => void;
  setUserName: (name: string) => void;
  reset: () => void;
}

function getRandomDeck(): TarotCard[] {
  const allCards = getAllCards();
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 7);
}

export const useReadingStore = create<ReadingState>((set) => ({
  question: '',
  deck: getRandomDeck(),
  selectedCards: [],
  selectedCardsWithDetails: [],
  readingResult: '',
  currentStep: 1,
  isLoading: false,
  analysis: null,
  userName: '',

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

  setAnalysis: (analysis) => set({ analysis }),

  setSelectedCardsWithDetails: (cards) => set({ selectedCardsWithDetails: cards }),

  setUserName: (name) => set({ userName: name }),

  reset: () => set({
    question: '',
    deck: getRandomDeck(),
    selectedCards: [],
    selectedCardsWithDetails: [],
    readingResult: '',
    currentStep: 1,
    isLoading: false,
    analysis: null,
    userName: '',
  }),
}));