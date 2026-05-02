// src/lib/system/accessControl.js
import { PAYWALL_START_DATE, TRIAL_DURATION_DAYS } from '@/config/paywall';

export function canAccessReading(user) {
  const now = new Date();

  if (now < new Date(PAYWALL_START_DATE)) {
    return { access: true, reason: "free_period" };
  }

  if (user.subscription_active) {
    return { access: true, reason: "subscribed" };
  }

  if (user.trial_active) {
    const trialEnd = new Date(user.trial_start_date);
    trialEnd.setDate(trialEnd.getDate() + TRIAL_DURATION_DAYS);

    if (now <= trialEnd) {
      return { access: true, reason: "trial_active" };
    }
  }

  return { access: false, reason: "paywall" };
}

export function startTrial(user) {
  user.trial_start_date = new Date().toISOString();
  user.trial_active = true;
  return user;
}