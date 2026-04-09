'use client';

import { create } from 'zustand';
import { GinniContext } from '@/components/GinniChat';

interface GinniState {
  context: GinniContext | null;
  triggerOpen: boolean;
  isOpen: boolean;
  setContext: (context: GinniContext | null) => void;
  setTriggerOpen: (trigger: boolean) => void;
  setIsOpen: (open: boolean) => void;
  clearContext: () => void;
}

export const useGinniStore = create<GinniState>((set) => ({
  context: null,
  triggerOpen: false,
  isOpen: false,
  
  setContext: (context) => set({ context }),
  
  setTriggerOpen: (triggerOpen) => set({ triggerOpen }),
  
  setIsOpen: (isOpen) => set({ isOpen }),
  
  clearContext: () => set({ context: null, triggerOpen: false })
}));