'use client';

import { supabase } from '@/lib/supabase/client';
import {
  getRemainingMessages,
  incrementMessageCount,
  canSendMessage as checkMessageLimit,
} from '@/lib/payments/plans';

export interface AccessResult {
  allowed: boolean;
  remainingMessages: number;
  canSendMessage: boolean;
  isPremium: boolean;
  plan: 'free' | 'premium';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'past_due' | null;
}

export interface SubscriptionState {
  plan: 'free' | 'premium';
  isActive: boolean;
  messagesUsed: number;
  remainingToday: number;
  lastReset: string | null;
}

/**
 * Client-side: Check full subscription access with DB validation.
 */
export async function checkSubscriptionAccess(
  userId: string | null,
  plan: 'free' | 'premium' = 'free'
): Promise<AccessResult> {
  // Premium plan always allowed
  if (plan === 'premium') {
    return {
      allowed: true,
      remainingMessages: -1,
      canSendMessage: true,
      isPremium: true,
      plan: 'premium',
      subscriptionStatus: 'active',
    };
  }

  // No user - allow one free message (per session)
  if (!userId) {
    return {
      allowed: true,
      remainingMessages: 1,
      canSendMessage: true,
      isPremium: false,
      plan: 'free',
      subscriptionStatus: null,
    };
  }

  const supabaseClient = supabase;

  // Check Supabase for user subscription status
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('plan, subscription_status, subscription_end_date, readings_today, last_reading_date')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[checkSubscriptionAccess] DB error:', error);
      const remaining = await getRemainingMessages(userId);
      return {
        allowed: remaining > 0,
        remainingMessages: remaining,
        canSendMessage: remaining > 0,
        isPremium: false,
        plan: 'free',
        subscriptionStatus: null,
      };
    }

    // User exists in DB
    if (user) {
      const dbPlan = (user.plan || 'free') as 'free' | 'premium';
      const status = user.subscription_status as 'active' | 'inactive' | 'cancelled' | 'past_due' | null;
      const endDate = user.subscription_end_date
        ? new Date(user.subscription_end_date)
        : null;

      const isPremiumActive =
        dbPlan === 'premium' &&
        status === 'active' &&
        (!endDate || endDate > new Date());

      if (isPremiumActive) {
        return {
          allowed: true,
          remainingMessages: -1,
          canSendMessage: true,
          isPremium: true,
          plan: 'premium',
          subscriptionStatus: 'active',
        };
      }

      // Free tier
      const today = new Date().toDateString();
      const lastReadingDate = user.last_reading_date
        ? new Date(user.last_reading_date).toDateString()
        : null;

      let remaining = 1;
      if (lastReadingDate === today) {
        remaining = Math.max(0, 1 - (user.readings_today || 0));
      }

      return {
        allowed: remaining > 0,
        remainingMessages: remaining,
        canSendMessage: remaining > 0,
        isPremium: false,
        plan: 'free',
        subscriptionStatus: status,
      };
    }

    // No user record
    const remaining = await getRemainingMessages(userId);
    return {
      allowed: remaining > 0,
      remainingMessages: remaining,
      canSendMessage: remaining > 0,
      isPremium: false,
      plan: 'free',
      subscriptionStatus: null,
    };
  } catch (error) {
    console.error('[checkSubscriptionAccess] Error:', error);
    const remaining = await getRemainingMessages(userId);
    return {
      allowed: remaining > 0,
      remainingMessages: remaining,
      canSendMessage: remaining > 0,
      isPremium: false,
      plan: 'free',
      subscriptionStatus: null,
    };
  }
}

/**
 * Client-side: Record a message usage in both local storage and Supabase.
 */
export async function recordMessage(userId: string): Promise<void> {
  await incrementMessageCount(userId);

  const supabaseClient = supabase;
  try {
    const today = new Date();
    const todayStr = today.toDateString();

    const { data: user } = await supabase
      .from('users')
      .select('readings_today, last_reading_date')
      .eq('id', userId)
      .single();

    if (user) {
      const lastDate = user.last_reading_date
        ? new Date(user.last_reading_date).toDateString()
        : null;

      await supabase.from('users').upsert({
        id: userId,
        readings_today: lastDate === todayStr ? (user.readings_today || 0) + 1 : 1,
        last_reading_date: today.toISOString(),
        updated_at: today.toISOString(),
      });
    }

    await supabase.from('events').insert({
      user_id: userId,
      event_name: 'message_sent',
      metadata: { plan: 'free', timestamp: today.toISOString() },
    });
  } catch (error) {
    console.error('[recordMessage] Supabase update failed:', error);
  }
}

/**
 * Client-side: Check subscription status from DB.
 */
export async function checkSubscriptionStatus(
  userId: string
): Promise<{
  isActive: boolean;
  plan: 'free' | 'premium';
  endDate?: Date;
  status: string;
}> {
  if (!userId) {
    return { isActive: false, plan: 'free', status: 'inactive' };
  }

  const supabaseClient = supabase;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('plan, subscription_status, subscription_end_date')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return { isActive: false, plan: 'free', status: 'inactive' };
    }

    const plan = (user.plan || 'free') as 'free' | 'premium';
    const status = (user.subscription_status || 'inactive') as string;
    const endDate = user.subscription_end_date
      ? new Date(user.subscription_end_date)
      : undefined;

    const isActive =
      status === 'active' && (!endDate || endDate > new Date());

    return { isActive, plan, endDate, status };
  } catch (error) {
    console.error('[checkSubscriptionStatus] Error:', error);
    return { isActive: false, plan: 'free', status: 'inactive' };
  }
}

/**
 * Client-side: Create a premium order via API route.
 */
export async function createPremiumOrder(
  userId: string
): Promise<{ orderId: string; amount: number; key: string } | null> {
  try {
    const response = await fetch('/api/premium-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.alreadyPremium) {
      return { orderId: '', amount: 0, key: '' };
    }

    return data;
  } catch (error) {
    console.error('[createPremiumOrder] Error:', error);
    return null;
  }
}

/**
 * Client-side: Activate premium subscription after payment.
 */
export async function activatePremiumSubscription(
  userId: string,
  paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/premium-order/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        ...paymentData,
      }),
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to verify payment' };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('[activatePremiumSubscription] Error:', error);
    return { success: false, error: error.message || 'Activation failed' };
  }
}

/**
 * Force reset daily limit for testing.
 */
export async function resetDailyCounter(userId: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const today = new Date();
  today.setDate(today.getDate() - 1); // Set to yesterday
  localStorage.setItem(`subscription_daily_date_${userId}`, today.toDateString());
  localStorage.setItem(`subscription_daily_count_${userId}`, '0');
}