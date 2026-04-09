import { trackUserActivity, getUserProfile } from './user-tracking';
import { getMessagesForDay, thirtyDayPlan } from './30-day-messages';
import { shouldSendReactivation, shouldSendConversionMessage, isHighIntentUser } from './funnel-tracking';

export interface UserState {
  userId: string;
  dayInJourney: number;
  segment: string;
  events: any[];
}

export interface MessageDecision {
  shouldSend: boolean;
  message?: string;
  cta?: string;
  messageType: string;
  reason: string;
}

export function determineMessageForUser(userState: UserState): MessageDecision {
  const { userId, dayInJourney, segment, events } = userState;
  
  if (shouldSendConversionMessage(events)) {
    const conversionMsg = thirtyDayPlan
      .find(d => d.messages.conversion);
    
    if (conversionMsg?.messages.conversion) {
      return {
        shouldSend: true,
        message: conversionMsg.messages.conversion.message,
        cta: conversionMsg.messages.conversion.cta,
        messageType: 'conversion',
        reason: 'User shows high intent (3+ readings or booking page visit)'
      };
    }
  }

  if (shouldSendReactivation(events)) {
    if (segment === 'cold') {
      const coldMsg = thirtyDayPlan
        .find(d => d.messages.reactivation)?.messages.reactivation;
      
      if (coldMsg) {
        return {
          shouldSend: true,
          message: coldMsg.message,
          cta: coldMsg.cta,
          messageType: 'cold-reactivation',
          reason: 'User inactive for 7+ days'
        };
      }
    }
    
    const reactMsg = thirtyDayPlan
      .find(d => d.messages.reactivation)?.messages.reactivation;
    
    if (reactMsg) {
      return {
        shouldSend: true,
        message: reactMsg.message,
        cta: reactMsg.cta,
        messageType: 'reactivation',
        reason: 'User inactive for 3-7 days'
      };
    }
  }

  const dayPlan = thirtyDayPlan.find(d => d.day === dayInJourney);
  
  if (dayPlan?.messages.daily) {
    return {
      shouldSend: true,
      message: dayPlan.messages.daily.message,
      cta: dayPlan.messages.daily.cta,
      messageType: 'daily-pull',
      reason: `Day ${dayInJourney} in user journey - ${getPhaseName(dayPlan.phase)}`
    };
  }

  return {
    shouldSend: false,
    messageType: 'none',
    reason: 'No appropriate message for current user state'
  };
}

function getPhaseName(phase: string): string {
  const phases: Record<string, string> = {
    hook: 'Hook & Curiosity',
    bonding: 'Emotional Bonding',
    dependency: 'Dependency & Insight',
    conversion: 'Conversion Push'
  };
  return phases[phase] || 'Ongoing';
}

export function getNextScheduledMessage(userState: UserState): {
  day: number;
  message: string;
  cta?: string;
  scheduledTime: Date;
} | null {
  const { dayInJourney } = userState;
  
  for (let day = dayInJourney + 1; day <= 30; day++) {
    const dayPlan = thirtyDayPlan.find(d => d.day === day);
    if (dayPlan?.messages.daily) {
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + (day - dayInJourney));
      nextDay.setHours(9, 0, 0, 0);
      
      return {
        day,
        message: dayPlan.messages.daily.message,
        cta: dayPlan.messages.daily.cta,
        scheduledTime: nextDay
      };
    }
  }
  
  return null;
}

export function calculateJourneyProgress(userEvents: any[]): {
  day: number;
  phase: string;
  progress: number;
} {
  const dailyPulls = userEvents.filter(e => e.eventName === 'daily_pull_view').length;
  const readings = userEvents.filter(e => e.eventName === 'reading_completed').length;
  
  const day = Math.max(dailyPulls, readings, 1);
  const cappedDay = Math.min(day, 30);
  
  const dayPlan = thirtyDayPlan.find(d => d.day === cappedDay);
  
  return {
    day: cappedDay,
    phase: dayPlan?.phase || 'hook',
    progress: (cappedDay / 30) * 100
  };
}

export const AUTOMATION_TRIGGERS = {
  threeDayInactivity: {
    condition: (events: any[]) => shouldSendReactivation(events),
    action: 'send_reactivation',
    messageType: 'reactivation'
  },
  highIntent: {
    condition: (events: any[]) => isHighIntentUser(events),
    action: 'send_conversion',
    messageType: 'conversion'
  },
  postReading: {
    condition: (events: any[]) => {
      const lastReading = events.find(e => e.eventName === 'reading_completed');
      if (!lastReading) return false;
      const hoursSince = (Date.now() - new Date(lastReading.timestamp).getTime()) / (1000 * 60 * 60);
      return hoursSince >= 2 && hoursSince <= 6;
    },
    action: 'send_followup',
    messageType: 'post-reading'
  },
  dailyPull: {
    condition: (events: any[]) => {
      const lastPull = events.find(e => e.eventName === 'daily_pull_view');
      if (!lastPull) return true;
      const hoursSince = (Date.now() - new Date(lastPull.timestamp).getTime()) / (1000 * 60 * 60);
      return hoursSince >= 20;
    },
    action: 'send_daily',
    messageType: 'daily-pull'
  }
};

export function checkAutomationTriggers(userId: string, events: any[]): string[] {
  const triggers = [];
  
  for (const [name, config] of Object.entries(AUTOMATION_TRIGGERS)) {
    if (config.condition(events)) {
      triggers.push(config.action);
    }
  }
  
  return triggers;
}