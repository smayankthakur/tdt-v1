'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/lib/auth/useUser';
import { getRemainingMessages, incrementMessageCount } from '@/lib/payments/plans';
import { logEvent } from '@/lib/utils/tracking';

export interface SubscriptionState {
  plan: 'free' | 'premium';
  isActive: boolean;
  messagesUsed: number;
  remainingToday: number;
  lastReset: string | null;
  paymentStatus: 'idle' | 'processing' | 'success' | 'failed';
  isPremiumOverride: boolean;
}

interface UseSubscriptionOptions {
  enableAutoReset?: boolean;
  resetHours?: number;
}

const MESSAGE_COUNT_KEY = 'subscription_daily_count';
const MESSAGE_DATE_KEY = 'subscription_daily_date';
const PREMIUM_OVERRIDE_KEY = 'premium_override';

export function useSubscription(options: UseSubscriptionOptions = {}) {
  const { enableAutoReset = true, resetHours = 24 } = options;
  const { user, isLoading: userLoading } = useUser();
  const [state, setState] = useState<SubscriptionState>({
    plan: 'free',
    isActive: false,
    messagesUsed: 0,
    remainingToday: 1,
    lastReset: null,
    paymentStatus: 'idle',
    isPremiumOverride: false,
  });

  const userId = user?.id || null;

  // Check for premium override from localStorage (payment success redirect)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const override = localStorage.getItem(PREMIUM_OVERRIDE_KEY);
    if (override === 'true') {
      setState(prev => ({ ...prev, isPremiumOverride: true, plan: 'premium', isActive: true }));
    }
  }, []);

  // Reset daily counter logic
  useEffect(() => {
    if (!enableAutoReset || !userId) return;

    const checkAndReset = () => {
      const now = new Date();
      const storedDate = localStorage.getItem(`${MESSAGE_DATE_KEY}_${userId}`);
      const today = now.toDateString();

      if (storedDate && storedDate !== today) {
        localStorage.setItem(`${MESSAGE_DATE_KEY}_${userId}`, today);
        localStorage.setItem(`${MESSAGE_COUNT_KEY}_${userId}`, '0');
        setState(prev => ({
          ...prev,
          messagesUsed: 0,
          remainingToday: 1,
          lastReset: now.toISOString(),
        }));
      }
    };

    checkAndReset();
    const interval = setInterval(checkAndReset, 60000);
    return () => clearInterval(interval);
  }, [userId, enableAutoReset]);

  // Check subscription status from DB
  useEffect(() => {
    if (userLoading || !userId) return;

    let cancelled = false;

    const checkAccess = async () => {
      try {
        const { checkSubscriptionAccess } = await import('@/lib/subscription/checkAccess');
        const result = await checkSubscriptionAccess(userId, 'free');

        if (!cancelled) {
          const isPremiumActive = result.isPremium || (result.subscriptionStatus === 'active' && result.plan === 'premium');

          setState(prev => ({
            ...prev,
            plan: isPremiumActive ? 'premium' : 'free',
            isActive: isPremiumActive,
            isPremiumOverride: isPremiumActive ? true : prev.isPremiumOverride,
          }));
        }
      } catch (err) {
        console.warn('[useSubscription] Status check failed:', err);
      }
    };

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [userId, userLoading]);

  // Check can send message
  const canSendMessage = useCallback(async (): Promise<boolean> => {
    if (!userId) return true;

    if (state.isPremiumOverride) return true;
    if (state.plan === 'premium' && state.isActive) return true;

    const remaining = await getRemainingMessages(userId);
    return remaining > 0;
  }, [userId, state.plan, state.isActive, state.isPremiumOverride]);

  // Record a message
  const recordMessage = useCallback(async (): Promise<void> => {
    if (!userId) return;

    const mod = await import('@/lib/subscription/checkAccess');
    await mod.recordMessage(userId);

    const today = new Date().toDateString();
    const storedDate = localStorage.getItem(`${MESSAGE_DATE_KEY}_${userId}`);

    if (storedDate === today) {
      const count = parseInt(localStorage.getItem(`${MESSAGE_COUNT_KEY}_${userId}`) || '0', 10);
      localStorage.setItem(`${MESSAGE_COUNT_KEY}_${userId}`, String(count + 1));
    } else {
      localStorage.setItem(`${MESSAGE_DATE_KEY}_${userId}`, today);
      localStorage.setItem(`${MESSAGE_COUNT_KEY}_${userId}`, '1');
    }

    const remaining = await getRemainingMessages(userId);
    setState(prev => ({
      ...prev,
      messagesUsed: prev.messagesUsed + 1,
      remainingToday: remaining,
    }));
  }, [userId]);

// Refresh subscription state
   const refresh = useCallback(async () => {
    if (!userId) return;

    try {
      const mod = await import('@/lib/subscription/checkAccess');
      const result = await mod.checkSubscriptionAccess(userId, 'free');
      const isPremiumActive = result.isPremium || (result.subscriptionStatus === 'active' && result.plan === 'premium');
      const remaining = isPremiumActive ? -1 : await getRemainingMessages(userId);

      setState(prev => ({
        ...prev,
        plan: isPremiumActive ? 'premium' : 'free',
        isActive: isPremiumActive,
        isPremiumOverride: isPremiumActive ? true : prev.isPremiumOverride,
        remainingToday: remaining,
      }));
    } catch (err) {
      console.warn('[useSubscription] Refresh failed:', err);
    }
  }, [userId]);

  // Set payment status
  const setPaymentStatus = useCallback((status: SubscriptionState['paymentStatus']) => {
    setState(prev => ({ ...prev, paymentStatus: status }));
  }, []);

  return {
    ...state,
    canSendMessage,
    recordMessage,
    refresh,
    setPaymentStatus,
    userId,
    isLoading: userLoading,
  };
}

// Keep the standalone utility exported for backwards compatibility
export async function getRemainingMessagesUtil(userId: string, plan: 'free' | 'premium' = 'free'): Promise<number> {
  if (plan === 'premium') return -1;
  if (!userId) return 1;
  return getRemainingMessages(userId);
}