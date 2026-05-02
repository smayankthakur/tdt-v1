// src/lib/system/accessControl.ts
import { PAYWALL_START_DATE, TRIAL_DURATION_DAYS } from '@/config/paywall';
import { User } from '@/types';

export function canAccessReading(user: User) {
  const now = new Date();

  if (now < new Date(PAYWALL_START_DATE)) {
    return { access: true, reason: "free_period" };
  }

  if (user.subscription_active) {
    return { access: true, reason: "subscribed" };
  }

  if (user.trial_active && user.trial_start_date) {
    const trialEnd = new Date(user.trial_start_date);
    trialEnd.setDate(trialEnd.getDate() + TRIAL_DURATION_DAYS);

    if (now <= trialEnd) {
      return { access: true, reason: "trial_active" };
    }
  }

  return { access: false, reason: "paywall" };
}

export function startTrial(user: User) {
  user.trial_start_date = new Date().toISOString();
  user.trial_active = true;
  return user;
}