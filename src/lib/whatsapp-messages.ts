export type UserSegment = 
  | 'new'
  | 'active'
  | 'inactive'
  | 'cold'
  | 'high-intent';

export type MessageType = 
  | 'daily-pull'
  | 'reactivation'
  | 'cold-reactivation'
  | 'post-reading'
  | 'conversion';

export interface MessageTemplate {
  type: MessageType;
  segments: UserSegment[];
  templates: string[];
  cta?: string;
}

export interface UserProfile {
  id: string;
  phone?: string;
  segment: UserSegment;
  lastActiveAt: Date;
  sessionCount: number;
  readingCount: number;
  bookingIntent: boolean;
  lastReadingTopic?: string;
  lastReadingCards?: string[];
  createdAt: Date;
}

export const dailyPullMessages: MessageTemplate[] = [
  {
    type: 'daily-pull',
    segments: ['new', 'active'],
    templates: [
      "Your energy feels different today… I pulled something for you.",
      "There's a message waiting for you today… it's not random.",
      "I woke up thinking of you this morning… your card is ready.",
      "The cards have been pointing at you since dawn…",
      "Something in today's energy feels connected to you…",
    ],
    cta: "Check your reading"
  },
  {
    type: 'daily-pull',
    segments: ['inactive'],
    templates: [
      "I noticed you haven't checked in recently… your card today might help.",
      "There's been something on my mind about you… your reading is ready.",
      "Your energy has been on my mind… the universe has a message for you.",
    ],
    cta: "See what the cards say"
  },
  {
    type: 'daily-pull',
    segments: ['cold'],
    templates: [
      "This message came through strongly for you… it didn't feel right to ignore it.",
      "You weren't meant to miss this… something important is unfolding.",
      "I've been feeling drawn to reach out to you… the cards insisted.",
    ],
    cta: "Your reading awaits"
  }
];

export const reactivationMessages: MessageTemplate[] = [
  {
    type: 'reactivation',
    segments: ['inactive'],
    templates: [
      "I haven't heard from you in a few days… your energy feels unsettled.",
      "Something shifted recently… you might want to check this.",
      "There's been a disturbance in your energy pattern…",
      "I've been sensing some uncertainty from you lately…",
    ],
    cta: "Your reading is waiting"
  },
  {
    type: 'cold-reactivation',
    segments: ['cold'],
    templates: [
      "This message came through strongly for you… it didn't feel right to ignore it.",
      "You weren't meant to miss this… something important is unfolding.",
      "The cards have been showing your pattern… I had to reach out.",
      "Some messages can't wait… yours felt like one of them.",
    ],
    cta: "Let's look deeper"
  }
];

export const postReadingMessages: MessageTemplate[] = [
  {
    type: 'post-reading',
    segments: ['new', 'active', 'inactive', 'cold'],
    templates: [
      "I've been thinking about your reading… there's something deeper there.",
      "That situation you asked about… it's not as simple as it looked.",
      "After your reading, I felt there was more to uncover for you…",
      "Your reading stayed with me… there's guidance I didn't get to share.",
    ],
    cta: "Continue your reading"
  }
];

export const conversionMessages: MessageTemplate[] = [
  {
    type: 'conversion',
    segments: ['high-intent'],
    templates: [
      "Some situations need more than a surface reading… yours feels like one of them.",
      "I can see patterns here that need a deeper look… if you're open to it.",
      "There's something in your energy that calls for personalized guidance…",
      "Your situation has layers that a quick reading can't fully unwrap…",
    ],
    cta: "Talk to a tarot expert"
  },
  {
    type: 'conversion',
    segments: ['active'],
    templates: [
      "The more I look at your pattern… the more I feel you need focused guidance.",
      "Your energy suggests you might benefit from a deeper session…",
    ],
    cta: "Get personalized insights"
  }
];

export const allTemplates: MessageTemplate[] = [
  ...dailyPullMessages,
  ...reactivationMessages,
  ...postReadingMessages,
  ...conversionMessages
];

export function getMessageForSegment(
  segment: UserSegment,
  type: MessageType
): { message: string; cta?: string } {
  const filtered = allTemplates.filter(
    t => t.type === type && t.segments.includes(segment)
  );
  
  if (filtered.length === 0) {
    return { message: "The universe has a message for you..." };
  }
  
  const template = filtered[Math.floor(Math.random() * filtered.length)];
  const message = template.templates[Math.floor(Math.random() * template.templates.length)];
  
  return { message, cta: template.cta };
}

export function determineSegment(user: UserProfile): UserSegment {
  const now = new Date();
  const lastActive = new Date(user.lastActiveAt);
  const daysSinceActive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
  
  if (user.bookingIntent) return 'high-intent';
  if (daysSinceActive <= 1) return user.sessionCount <= 1 ? 'new' : 'active';
  if (daysSinceActive <= 7) return 'inactive';
  return 'cold';
}

export function shouldSendDailyPull(user: UserProfile): boolean {
  const now = new Date();
  const lastActive = new Date(user.lastActiveAt);
  const hoursSinceActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
  return hoursSinceActive >= 20;
}

export function shouldSendReactivation(user: UserProfile): boolean {
  const now = new Date();
  const lastActive = new Date(user.lastActiveAt);
  const daysSinceActive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceActive >= 3 && daysSinceActive <= 7;
}

export function shouldSendColdReactivation(user: UserProfile): boolean {
  const now = new Date();
  const lastActive = new Date(user.lastActiveAt);
  const daysSinceActive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceActive >= 7;
}

export function shouldSendConversion(user: UserProfile): boolean {
  return user.bookingIntent || (user.sessionCount >= 3 && user.readingCount >= 5);
}