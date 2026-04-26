import { getRegionalPricing, type UserRegion } from '@/lib/regionDetector';

export type PlanType = 'free' | 'premium';
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
      '3 tarot readings per day',
      'Basic card interpretations',
      'Standard AI responses',
    ],
    readingsPerDay: 3,
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
      'Deep AI interpretation',
      'Priority AI responses',
      'Personalized guidance',
    ],
    readingsPerDay: -1,
    aiResponsesPriority: true,
    personalConsultation: false,
    whatsappExclusive: false,
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
    unlimited_readings: ['premium'],
    deep_insights: ['premium'],
    priority_ai: ['premium'],
    personal_consultation: ['premium'],
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
    premium: null,
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