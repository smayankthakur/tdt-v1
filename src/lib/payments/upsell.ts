import { PlanType } from './plans';

export type UpsellTrigger = 'post-reading' | 'partial-result' | 'multi-session' | 'high-engagement' | 'time-based';

export interface UpsellConfig {
  trigger: UpsellTrigger;
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  delay?: number;
  showOncePerSession?: boolean;
}

export const UPSELL_CONFIGS: Record<UpsellTrigger, UpsellConfig> = {
  'post-reading': {
    trigger: 'post-reading',
    title: "There's More to This...",
    message: "The cards have revealed the surface, but there's deeper insight waiting for you. Unlock the full reading to see everything.",
    ctaText: "Unlock Full Reading",
    ctaLink: "/upgrade?source=post-reading",
    showOncePerSession: true,
  },
  'partial-result': {
    trigger: 'partial-result',
    title: "This is Only Part of What's Coming Through...",
    message: "You've seen a glimpse of what the universe wants you to know. The full picture reveals everything.",
    ctaText: "See Full Interpretation",
    ctaLink: "/upgrade?source=partial",
  },
  'multi-session': {
    trigger: 'multi-session',
    title: "You've Been Exploring This Deeply...",
    message: "Your curiosity has brought you here multiple times. Get unlimited access to go as deep as you need.",
    ctaText: "Go Unlimited",
    ctaLink: "/upgrade?source=multi",
  },
  'high-engagement': {
    trigger: 'high-engagement',
    title: "Your Situation Calls for Deeper Guidance...",
    message: "Based on your journey here, a premium reading would give you the clarity you deserve.",
    ctaText: "Get Premium Insights",
    ctaLink: "/upgrade?source=engagement",
  },
  'time-based': {
    trigger: 'time-based',
    title: "Special Offer - Limited Time",
    message: "For the next 24 hours, get Premium at a special rate. Your deeper answers await.",
    ctaText: "Claim Offer",
    ctaLink: "/upgrade?source=limited",
    delay: 5000,
  },
};

export interface UpsellContext {
  userId: string;
  plan: PlanType;
  readingsCount: number;
  sessionCount: number;
  timeOnSite: number;
  lastReadingTime?: Date;
  showPaywall: boolean;
}

export function determineUpsellTrigger(context: UpsellContext): UpsellTrigger | null {
  const { plan, readingsCount, sessionCount, timeOnSite, showPaywall } = context;

  if (plan !== 'free') return null;

  if (showPaywall) {
    return 'partial-result';
  }

  if (readingsCount >= 2 && readingsCount <= 4) {
    return 'post-reading';
  }

  if (sessionCount >= 3) {
    return 'multi-session';
  }

  if (timeOnSite > 300 && readingsCount >= 1) {
    return 'high-engagement';
  }

  if (readingsCount === 1 && timeOnSite > 120) {
    return 'post-reading';
  }

  return null;
}

export function shouldShowUpsell(context: UpsellContext): boolean {
  if (context.plan !== 'free') return false;
  
  const trigger = determineUpsellTrigger(context);
  return trigger !== null;
}

export function getUpsellForPlan(plan: PlanType): UpsellConfig | undefined {
  const configs: Record<PlanType, UpsellConfig | undefined> = {
    free: UPSELL_CONFIGS['post-reading'],
    premium: undefined,
  };
  
  return configs[plan];
}

export function getPsychologicalTriggers(): string[] {
  return [
    "There's something more the cards want to show you...",
    "Your situation is more specific than a general reading can cover...",
    "You've been coming back for answers - here's the key...",
    "This message came through for a reason...",
    "The universe brought you here for clarity...",
    "Others with your situation have found their answer here...",
    "This is only the beginning of what the cards can reveal...",
  ];
}

export function getCuriosityGapMessage(readingsCount: number): string {
  const messages = [
    "There's more depth to this than what you've seen...",
    "Your cards are showing multiple layers - you've only seen one...",
    "The answer to your real question is in the next level of reading...",
    "This reading opened a door - step through for the full picture...",
    "You've touched on something significant - now go deeper...",
  ];
  
  return messages[Math.min(readingsCount, messages.length - 1)];
}

export function getTimingUrgencyMessage(): string {
  const messages = [
    "This insight is particularly relevant right now...",
    "The timing of your reading isn't random - the universe knows...",
    "What you're seeking has urgency - don't wait...",
    "Today brings a special energy to this question...",
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

export interface UpsellMetrics {
  trigger: UpsellTrigger;
  displayed: boolean;
  clicked: boolean;
  converted: boolean;
}

export function trackUpsellEvent(
  event: 'upsell_displayed' | 'upsell_clicked' | 'upsell_converted',
  context: UpsellContext,
  trigger: UpsellTrigger
): void {
  console.log('[Upsell Tracking]', {
    event,
    userId: context.userId,
    trigger,
    timestamp: new Date().toISOString(),
  });
}