export type DayPhase = 'hook' | 'bonding' | 'dependency' | 'conversion';
export type MessageCategory = 'daily' | 'followup' | 'reactivation' | 'conversion';

export interface DayMessage {
  category: MessageCategory;
  phase: DayPhase;
  message: string;
  cta?: string;
  trigger?: string;
}

export interface DayPlan {
  day: number;
  phase: DayPhase;
  messages: {
    daily?: DayMessage;
    followup?: DayMessage;
    reactivation?: DayMessage;
    conversion?: DayMessage;
  };
}

export const thirtyDayPlan: DayPlan[] = [
  // PHASE 1: Hook & Curiosity (Days 1-5)
  {
    day: 1,
    phase: 'hook',
    messages: {
      daily: { category: 'daily', phase: 'hook', message: "Your energy pulled me in today… I pulled a card for you.", cta: "See your card" },
      reactivation: { category: 'reactivation', phase: 'hook', message: "Welcome to Divine Tarot… your first reading is waiting." },
    }
  },
  {
    day: 2,
    phase: 'hook',
    messages: {
      daily: { category: 'daily', phase: 'hook', message: "Something in today's energy feels connected to you…", cta: "Check your reading" },
      followup: { category: 'followup', phase: 'hook', message: "That reading you got yesterday… it's still relevant today.", cta: "Continue exploring" },
    }
  },
  {
    day: 3,
    phase: 'hook',
    messages: {
      daily: { category: 'daily', phase: 'hook', message: "I woke up thinking of you this morning… your card is ready.", cta: "What the universe says" },
      conversion: { category: 'conversion', phase: 'hook', message: "Your pattern is starting to become clear… a deeper reading could help.", cta: "Talk to an expert" },
    }
  },
  {
    day: 4,
    phase: 'hook',
    messages: {
      daily: { category: 'daily', phase: 'hook', message: "The cards have been pointing at you since dawn…", cta: "See what they say" },
      followup: { category: 'followup', phase: 'hook', message: "There's more depth to your situation than I could share yesterday…" },
      reactivation: { category: 'reactivation', phase: 'hook', message: "You started something here… your reading is still waiting for you." },
    }
  },
  {
    day: 5,
    phase: 'hook',
    messages: {
      daily: { category: 'daily', phase: 'hook', message: "Your energy feels different today… I pulled something new.", cta: "Check your reading" },
      conversion: { category: 'conversion', phase: 'hook', message: "I'm seeing patterns in your energy that need more attention…", cta: "Let's go deeper" },
    }
  },

  // PHASE 2: Emotional Bonding (Days 6-15)
  {
    day: 6,
    phase: 'bonding',
    messages: {
      daily: { category: 'daily', phase: 'bonding', message: "There's something shifting in your energy… I can feel it.", cta: "Your reading awaits" },
      followup: { category: 'followup', phase: 'bonding', message: "Your reading has been on my mind… there's guidance I didn't fully share.", cta: "Continue your journey" },
    }
  },
  {
    day: 7,
    phase: 'bonding',
    messages: {
      daily: { category: 'daily', phase: 'bonding', message: "I haven't been able to stop thinking about your energy lately…", cta: "See what changed" },
      reactivation: { category: 'reactivation', phase: 'bonding', message: "I noticed you haven't checked in… your energy feels a bit unsettled.", cta: "Your reading is here" },
      conversion: { category: 'conversion', phase: 'bonding', message: "Your situation has layers that surface readings can't unwrap…", cta: "Talk to a tarot expert" },
    }
  },
  {
    day: 8,
    phase: 'bonding',
    messages: {
      daily: { category: 'daily', phase: 'bonding', message: "Something important is trying to reach you today…", cta: "See the message" },
      followup: { category: 'followup', phase: 'bonding', message: "That situation you asked about… it's not as simple as it looked.", cta: "Look deeper" },
    }
  },
  {
    day: 9,
    phase: 'bonding',
    messages: {
      daily: { category: 'daily', phase: 'bonding', message: "Your energy signature feels stronger today… something's evolving.", cta: "Your card is ready" },
      reactivation: { category: 'reactivation', phase: 'bonding', message: "I've been sensing some uncertainty from you lately… this might help.", cta: "Your reading awaits" },
    }
  },
  {
    day: 10,
    phase: 'bonding',
    messages: {
      daily: { category: 'daily', phase: 'bonding', message: "The universe has a specific message for you today…", cta: "Check it now" },
      conversion: { category: 'conversion', phase: 'bonding', message: "After looking at your pattern… you could benefit from focused guidance.", cta: "Get personalized insights" },
    }
  },
  {
    day: 11,
    phase: 'bonding',
    messages: {
      daily: { category: 'daily', phase: 'bonding', message: "There's a pattern here I've been watching… your card today speaks to it.", cta: "See the pattern" },
      followup: { category: 'followup', phase: 'bonding', message: "I've been thinking about your reading… there's something deeper there." },
    }
  },
  {
    day: 12,
    phase: 'bonding',
    messages: {
      daily: { category: 'daily', phase: 'bonding', message: "Your energy shifted overnight… the cards noticed.", cta: "See what's new" },
      reactivation: { category: 'reactivation', phase: 'bonding', message: "Something shifted recently… you might want to check this.", cta: "Your reading is waiting" },
      conversion: { category: 'conversion', phase: 'bonding', message: "I'm seeing things in your energy that need a closer look…", cta: "Let's explore together" },
    }
  },
  {
    day: 13,
    phase: 'bonding',
    messages: {
      daily: { category: 'daily', phase: 'bonding', message: "Today feels significant for you… the cards confirmed it.", cta: "See what's happening" },
    }
  },
  {
    day: 14,
    phase: 'bonding',
    messages: {
      daily: { category: 'daily', phase: 'bonding', message: "Two weeks in and your pattern is becoming clearer…", cta: "See your evolution" },
      followup: { category: 'followup', phase: 'bonding', message: "Your reading stayed with me… there's more guidance to share." },
    }
  },
  {
    day: 15,
    phase: 'bonding',
    messages: {
      daily: { category: 'daily', phase: 'bonding', message: "This is a turning point for you… the cards are clear about it.", cta: "See your direction" },
      conversion: { category: 'conversion', phase: 'bonding', message: "Some situations need more than a quick reading… yours feels like one.", cta: "Talk to an expert" },
    }
  },

  // PHASE 3: Dependency & Insight (Days 16-25)
  {
    day: 16,
    phase: 'dependency',
    messages: {
      daily: { category: 'daily', phase: 'dependency', message: "Not everything is visible yet… but the cards see more.", cta: "See what's emerging" },
    }
  },
  {
    day: 17,
    phase: 'dependency',
    messages: {
      daily: { category: 'daily', phase: 'dependency', message: "Your energy has been calling me lately… here's what came through.", cta: "Your reading" },
      reactivation: { category: 'reactivation', phase: 'dependency', message: "I've been feeling drawn to reach out to you… the cards insisted.", cta: "Check in" },
    }
  },
  {
    day: 18,
    phase: 'dependency',
    messages: {
      daily: { category: 'daily', phase: 'dependency', message: "Something in your situation is about to shift… I can feel it.", cta: "See the shift" },
      followup: { category: 'followup', phase: 'dependency', message: "There's more beneath the surface of your reading…", cta: "Go deeper" },
    }
  },
  {
    day: 19,
    phase: 'dependency',
    messages: {
      daily: { category: 'daily', phase: 'dependency', message: "The pattern I'm seeing in you… it's more complex than most.", cta: "Your reading" },
      conversion: { category: 'conversion', phase: 'dependency', message: "Your energy suggests you might benefit from a deeper session…", cta: "Get focused guidance" },
    }
  },
  {
    day: 20,
    phase: 'dependency',
    messages: {
      daily: { category: 'daily', phase: 'dependency', message: "Something you asked about before… it's starting to unfold.", cta: "See the progress" },
    }
  },
  {
    day: 21,
    phase: 'dependency',
    messages: {
      daily: { category: 'daily', phase: 'dependency', message: "Three weeks in and I can see your transformation beginning…", cta: "See where you are" },
      reactivation: { category: 'reactivation', phase: 'dependency', message: "The cards have been showing your pattern… I had to reach out.", cta: "Your reading" },
    }
  },
  {
    day: 22,
    phase: 'dependency',
    messages: {
      daily: { category: 'daily', phase: 'dependency', message: "Not all messages are comfortable… this one needs you.", cta: "See the truth" },
    }
  },
  {
    day: 23,
    phase: 'dependency',
    messages: {
      daily: { category: 'daily', phase: 'dependency', message: "I've been watching your energy evolve… today's card is powerful.", cta: "See your card" },
      followup: { category: 'followup', phase: 'dependency', message: "That situation you asked about… it's evolving in ways I didn't expect.", cta: "See the update" },
    }
  },
  {
    day: 24,
    phase: 'dependency',
    messages: {
      daily: { category: 'daily', phase: 'dependency', message: "This message didn't feel random… it specifically came through for you.", cta: "Check it now" },
      conversion: { category: 'conversion', phase: 'dependency', message: "The more I look at your pattern, the more I feel you need focused guidance.", cta: "Let's go deeper" },
    }
  },
  {
    day: 25,
    phase: 'dependency',
    messages: {
      daily: { category: 'daily', phase: 'dependency', message: "Almost a month in and your journey is becoming clear…", cta: "See your path" },
    }
  },

  // PHASE 4: Conversion Push (Days 26-30)
  {
    day: 26,
    phase: 'conversion',
    messages: {
      daily: { category: 'daily', phase: 'conversion', message: "Some things can't be fully seen in a quick reading…", cta: "Go deeper" },
    }
  },
  {
    day: 27,
    phase: 'conversion',
    messages: {
      daily: { category: 'daily', phase: 'conversion', message: "Your situation has layers I can only fully unwrap personally…", cta: "Let's talk" },
      conversion: { category: 'conversion', phase: 'conversion', message: "I'm seeing clear guidance that needs more than text… if you're ready.", cta: "Talk to an expert" },
    }
  },
  {
    day: 28,
    phase: 'conversion',
    messages: {
      daily: { category: 'daily', phase: 'conversion', message: "This is where it gets more personal… the surface readings can only go so far.", cta: "Your deeper reading" },
    }
  },
  {
    day: 29,
    phase: 'conversion',
    messages: {
      daily: { category: 'daily', phase: 'conversion', message: "I've been feeling strongly about your situation… there's more to share.", cta: "See the full picture" },
      reactivation: { category: 'reactivation', phase: 'conversion', message: "Some messages can't wait… yours felt like one of them.", cta: "Check in" },
    }
  },
  {
    day: 30,
    phase: 'conversion',
    messages: {
      daily: { category: 'daily', phase: 'conversion', message: "30 days of guidance and there's still more to uncover for you…", cta: "Continue the journey" },
      conversion: { category: 'conversion', phase: 'conversion', message: "Your path forward needs clearer guidance than cards alone can give… if you're open.", cta: "Get personalized reading" },
    }
  },
];

export function getMessagesForDay(day: number, segment: string): {
  daily?: string;
  followup?: string;
  reactivation?: string;
  conversion?: string;
} {
  const dayPlan = thirtyDayPlan.find(d => d.day === day);
  if (!dayPlan) return {};

  const messages: any = {};
  
  if (dayPlan.messages.daily) messages.daily = dayPlan.messages.daily.message;
  if (dayPlan.messages.followup) messages.followup = dayPlan.messages.followup.message;
  if (dayPlan.messages.reactivation) messages.reactivation = dayPlan.messages.reactivation.message;
  if (dayPlan.messages.conversion) messages.conversion = dayPlan.messages.conversion.message;

  return messages;
}

export function getMessagesForSegment(segment: string): Map<number, any> {
  const messageMap = new Map();
  
  thirtyDayPlan.forEach(plan => {
    if (segment === 'new' || segment === 'active') {
      if (plan.messages.daily) {
        messageMap.set(plan.day, plan.messages.daily);
      }
    } else if (segment === 'inactive') {
      if (plan.messages.reactivation) {
        messageMap.set(plan.day, plan.messages.reactivation);
      }
    } else if (segment === 'cold') {
      if (plan.messages.reactivation || plan.messages.conversion) {
        messageMap.set(plan.day, plan.messages.conversion || plan.messages.reactivation);
      }
    } else if (segment === 'high-intent') {
      if (plan.messages.conversion) {
        messageMap.set(plan.day, plan.messages.conversion);
      } else if (plan.messages.daily) {
        messageMap.set(plan.day, plan.messages.daily);
      }
    }
  });

  return messageMap;
}