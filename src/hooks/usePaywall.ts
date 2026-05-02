// src/hooks/usePaywall.ts
import { useEffect, useState } from 'react';
import { canAccessReading, startTrial } from '@/lib/system/accessControl';
import { User } from '@/types'; // Assuming we have a User type

export function usePaywallAccess(user: User | null) {
  const [access, setAccess] = useState<{ access: boolean; reason: string }>({ access: false, reason: 'loading' });
  const [trialActive, setTrialActive] = useState(false);
  const [trialStartDate, setTrialStartDate] = useState<string | null>(null);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    if (!user) {
      setAccess({ access: false, reason: 'no_user' });
      return;
    }

    const accessResult = canAccessReading(user);
    setAccess(accessResult);

    // Update trial state
    if (user.trial_active && user.trial_start_date) {
      setTrialActive(true);
      setTrialStartDate(user.trial_start_date);
      
      const start = new Date(user.trial_start_date);
      const end = new Date(start);
      end.setDate(end.getDate() + 3); // TRIAL_DURATION_DAYS from config
      const now = new Date();
      const diffTime = end.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(Math.max(0, diffDays));
    } else {
      setTrialActive(false);
      setTrialStartDate(null);
      setDaysLeft(0);
    }
  }, [user]);

  const handleStartTrial = () => {
    if (user) {
      const updatedUser = startTrial(user);
      // In a real app, you would update the user in state/context
      // For now, we'll just trigger a refetch by setting state
      setAccess(canAccessReading(updatedUser));
    }
  };

  return {
    canAccess: access.access,
    reason: access.reason,
    trialActive,
    trialStartDate,
    daysLeft,
    startTrial: handleStartTrial,
  };
}