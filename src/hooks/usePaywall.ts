// src/hooks/usePaywall.ts
import { useEffect, useState } from 'react';
import { canAccessReading, getReadingsRemaining } from '@/lib/system/accessControl';

export function usePaywallAccess(userId: string | null, plan: 'free' | 'premium' = 'free') {
  const [canAccess, setCanAccess] = useState(true);
  const [reason, setReason] = useState('loading');
  const [remainingToday, setRemainingToday] = useState(1);

  useEffect(() => {
    if (!userId) {
      setCanAccess(true);
      setRemainingToday(1);
      return;
    }

    canAccessReading(userId, plan).then(result => {
      setCanAccess(result.allowed);
      setReason(result.reason);
    });

    getReadingsRemaining(userId, plan).then(setRemainingToday);
  }, [userId, plan]);

  return {
    canAccess,
    reason,
    remainingToday,
    isPremium: plan === 'premium',
  };
}