'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/auth/useUser';
import { useSubscription } from '@/lib/subscription/useSubscription';
import { checkSubscriptionAccess } from '@/lib/subscription/checkAccess';

interface PaywallState {
  canAccess: boolean;
  reason: 'free' | 'limit_reached' | 'premium' | 'loading' | 'no_user';
  remainingMessages: number;
  isPremium: boolean;
  shouldShowPaywall: boolean;
}

/**
 * Hook to manage paywall access logic for the reading experience.
 * Determines if a user can access the reading iframe or should see the paywall.
 */
export function usePaywallAccess(userId: string | null, plan: 'free' | 'premium' = 'free') {
  const { plan: userPlan, isActive: premiumActive, isPremiumOverride } = useSubscription();
  const [state, setState] = useState<PaywallState>({
    canAccess: true,
    reason: 'loading',
    remainingMessages: 1,
    isPremium: false,
    shouldShowPaywall: false,
  });

  const isPremium = premiumActive || isPremiumOverride || plan === 'premium';

  useEffect(() => {
    if (!userId) {
      setState({
        canAccess: true,
        reason: 'no_user',
        remainingMessages: 1,
        isPremium: false,
        shouldShowPaywall: false,
      });
      return;
    }

    const checkAccess = async () => {
      // Premium users always have access
      if (isPremium) {
        setState({
          canAccess: true,
          reason: 'premium',
          remainingMessages: -1,
          isPremium: true,
          shouldShowPaywall: false,
        });
        return;
      }

      try {
        const result = await checkSubscriptionAccess(userId, 'free');

        setState({
          canAccess: result.canSendMessage,
          reason: result.canSendMessage ? 'free' : 'limit_reached',
          remainingMessages: result.remainingMessages,
          isPremium: result.isPremium,
          shouldShowPaywall: !result.canSendMessage,
        });
      } catch (error) {
        console.warn('[usePaywallAccess] Error checking access:', error);
        // Allow access on error to avoid blocking users
        setState({
          canAccess: true,
          reason: 'loading',
          remainingMessages: 1,
          isPremium: false,
          shouldShowPaywall: false,
        });
      }
    };

    checkAccess();
  }, [userId, isPremium]);

  // Check if should trigger paywall modal
  useEffect(() => {
    if (!state.canAccess && isPremium) {
      setState(prev => ({ ...prev, canAccess: true, shouldShowPaywall: false }));
    }
  }, [isPremium, state.canAccess]);

  const refreshAccess = async () => {
    if (!userId) return;

    if (isPremium) {
      setState(prev => ({ ...prev, canAccess: true, reason: 'premium', isPremium: true, shouldShowPaywall: false }));
      return;
    }

    try {
      const result = await checkSubscriptionAccess(userId, 'free');
      setState({
        canAccess: result.canSendMessage,
        reason: result.canSendMessage ? 'free' : 'limit_reached',
        remainingMessages: result.remainingMessages,
        isPremium: result.isPremium,
        shouldShowPaywall: !result.canSendMessage,
      });
    } catch (error) {
      console.warn('[usePaywallAccess] Refresh error:', error);
    }
  };

  return {
    ...state,
    refreshAccess,
  };
}

/**
 * Convenience hook to check if a specific feature requires upgrade.
 */
export function useFeatureAccess(feature: string) {
  const { isPremiumOverride, plan, isActive } = useSubscription();
  const isPremium = isPremiumOverride || (plan === 'premium' && isActive);

  const premiumFeatures = [
    'unlimited_readings',
    'unlimited_messages',
    'deep_insights',
    'priority_ai',
    'personal_consultation',
  ];

  return {
    canAccess: isPremium || !premiumFeatures.includes(feature),
    requiresUpgrade: !isPremium && premiumFeatures.includes(feature),
    isPremium,
  };
}