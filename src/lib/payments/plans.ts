import { getRegionalPricing, type UserRegion } from '@/lib/regionDetector';

export type PlanType = 'free' | 'premium' | 'pro';
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due';

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  priceId?: string;
  features: string[];
  readingsPerDay: number;
  aiResponsesPriority: boolean;
  personalConsultation: boolean;
  whatsappExclusive: boolean;
}

export const SUBSCRIPTION_PLANS: Record<PlanType, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    type: 'free',
    price: 0,
    features: [
      '1 tarot reading per day',
      'Basic card interpretations',
      'Daily horoscope access',
    ],
    readingsPerDay: 1,
    aiResponsesPriority: false,
    personalConsultation: false,
    whatsappExclusive: false,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    type: 'premium',
    price: 199,
    priceId: 'premium_monthly',
    features: [
      'Unlimited tarot readings',
      'Deep AI insights',
      'Priority AI responses',
      'Personalized guidance',
      'Daily WhatsApp messages',
      'Exclusive content',
    ],
    readingsPerDay: -1,
    aiResponsesPriority: true,
    personalConsultation: false,
    whatsappExclusive: true,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    type: 'pro',
    price: 999,
    priceId: 'pro_monthly',
    features: [
      'Everything in Premium',
      'Monthly personal consultation',
      'Exclusive tarot sessions',
      'Priority WhatsApp access',
      'Custom birth chart reading',
      'Early access to new features',
    ],
    readingsPerDay: -1,
    aiResponsesPriority: true,
    personalConsultation: true,
    whatsappExclusive: true,
  },
};

export interface UserSubscription {
  userId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date | null;
  autoRenew: boolean;
  paymentId?: string;
  razorpaySubscriptionId?: string;
}

export function canAccessFeature(userPlan: PlanType, feature: string): boolean {
  const plan = SUBSCRIPTION_PLANS[userPlan];
  
  const featureAccess: Record<string, PlanType[]> = {
    unlimited_readings: ['premium', 'pro'],
    deep_insights: ['premium', 'pro'],
    priority_ai: ['premium', 'pro'],
    personal_consultation: ['pro'],
    whatsapp_exclusive: ['premium', 'pro'],
    daily_messages: ['premium', 'pro'],
    exclusive_content: ['premium', 'pro'],
  };
  
  const allowedPlans = featureAccess[feature] || [];
  return allowedPlans.includes(userPlan);
}

export function getPlanLimit(plan: PlanType): number {
  return SUBSCRIPTION_PLANS[plan].readingsPerDay;
}

export function hasUnlimitedReadings(plan: PlanType): boolean {
  return SUBSCRIPTION_PLANS[plan].readingsPerDay === -1;
}

export function getNextPlan(currentPlan: PlanType): PlanType | null {
  const upgrades: Record<PlanType, PlanType | null> = {
    free: 'premium',
    premium: 'pro',
    pro: null,
  };
  return upgrades[currentPlan];
}

export function getPlanDisplayPrice(plan: PlanType, region: UserRegion = 'india'): string {
  const pricing = getRegionalPricing(region);
  const price = plan === 'free' ? 0 : pricing.monthly;
  if (price === 0) return 'Free';
  return `${pricing.symbol}${price}/month`;
}

export function getYearlyDisplayPrice(plan: PlanType, region: UserRegion = 'india'): string {
  const pricing = getRegionalPricing(region);
  const price = plan === 'free' ? 0 : pricing.yearly;
  if (price === 0) return 'Free';
  return `${pricing.symbol}${price}/year`;
}