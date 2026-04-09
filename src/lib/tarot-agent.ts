import { determineSegment, getMessageForSegment, MessageType, UserSegment } from './whatsapp-messages';
import { 
  calculateFunnelStage, 
  isHighIntentUser, 
  shouldSendReactivation, 
  shouldSendConversionMessage,
  EventName,
  FunnelStage 
} from './funnel-tracking';
import { trackUserActivity, getUserProfile } from './user-tracking';

export interface UserContext {
  userId: string;
  phone?: string;
  segment: UserSegment;
  lastActiveAt: Date;
  sessionCount: number;
  readingCount: number;
  lastQuestion?: string;
  lastReadingTime?: Date;
  lastReadingTopic?: string;
  lastReadingEmotion?: string;
  bookingPageVisited: boolean;
  bookingSubmitted: boolean;
  totalRevenue: number;
  createdAt: Date;
  events: Array<{ id?: string; eventName: string; timestamp: Date; metadata?: Record<string, any> }>;
}

export interface MessageDecision {
  type: MessageType;
  message: string;
  cta?: string;
  sendTime: Date;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  contextUsed: string[];
}

export interface TriggerResult {
  shouldTrigger: boolean;
  triggerType: 'daily' | 'post-reading' | 'inactivity' | 'high-intent' | 'none';
  userId: string;
  decision: MessageDecision | null;
}

const DAILY_HOUR = 9;
const POST_READING_MIN_HOURS = 2;
const POST_READING_MAX_HOURS = 6;
const INACTIVITY_DAYS_THRESHOLD = 3;

function classifyUser(context: UserContext): UserSegment {
  const now = new Date();
  const lastActive = new Date(context.lastActiveAt);
  const daysSinceActive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
  
  if (context.bookingSubmitted || (context.readingCount >= 3 && context.bookingPageVisited)) {
    return 'high-intent';
  }
  
  if (daysSinceActive <= 1) {
    return context.sessionCount <= 1 ? 'new' : 'active';
  }
  if (daysSinceActive <= 7) {
    return 'inactive';
  }
  return 'cold';
}

function detectEmotionalTone(question: string): string {
  const lower = question.toLowerCase();
  
  if (lower.match(/worried|scared|afraid|nervous|stress|panic|dread|overthink/)) {
    return 'anxious';
  }
  if (lower.match(/hope|wish|dream|positive|better|excited|optimistic/)) {
    return 'hopeful';
  }
  if (lower.match(/confused|lost|don.?t know|uncertain|unclear|mixed/)) {
    return 'confused';
  }
  if (lower.match(/hurt|pain|sad|grief|loss|heartbreak|broken|depressed|crying/)) {
    return 'heartbroken';
  }
  if (lower.match(/want|desire|goal|achieve|success|career|advance|build/)) {
    return 'ambitious';
  }
  if (lower.match(/stuck|can.?t|no progress|trying|effort|change/)) {
    return 'stuck';
  }
  
  return 'neutral';
}

function detectTheme(question: string): string {
  const lower = question.toLowerCase();
  
  if (lower.match(/love|relationship|partner|heart|romance|marriage|crush|attraction|ex|dating|soulmate/)) {
    return 'love';
  }
  if (lower.match(/work|job|career|boss|promotion|interview|business|project|professional|ambition/)) {
    return 'career';
  }
  if (lower.match(/money|financial|wealth|income|investment|rich|salary|debt|budget/)) {
    return 'money';
  }
  if (lower.match(/personal|growth|spiritual|self|future|life|purpose|meaning|change|transformation/)) {
    return 'growth';
  }
  if (lower.match(/should.?i|choice|decide|option|path|which|choose|alternative|commitment/)) {
    return 'decision';
  }
  
  return 'general';
}

function generatePersonalizedMessage(context: UserContext, type: MessageType): { message: string; cta?: string } {
  const base = getMessageForSegment(context.segment, type);
  
  if (!context.lastQuestion) {
    return base;
  }
  
  const emotion = detectEmotionalTone(context.lastQuestion);
  const theme = detectTheme(context.lastQuestion);
  
  const personalizedOpeners: Record<string, string[]> = {
    anxious: [
      "I can feel the weight you're carrying...",
      "There's something on your mind...",
      "Your energy feels a bit heavy today..."
    ],
    hopeful: [
      "Something you're hoping for is in the air...",
      "Your positive energy is attracting something...",
      "I sense something good coming your way..."
    ],
    confused: [
      "That confusion you're feeling...",
      "The fog you're in...",
      "Your situation isn't as complicated as it feels..."
    ],
    heartbroken: [
      "I can feel what you're going through...",
      "There's a pain in your energy...",
      "What you're experiencing matters..."
    ],
    ambitious: [
      "Your ambition is noticed...",
      "Something you're building toward...",
      "Your goals are attracting guidance..."
    ],
    stuck: [
      "That feeling of being stuck...",
      "The frustration you're experiencing...",
      "Something is about to shift for you..."
    ],
    neutral: [
      "There's something I need to share with you...",
      "Your reading is ready...",
      "The cards have a message for you..."
    ]
  };
  
  const thematicClosers: Record<string, string> = {
    love: "In matters of the heart, trust what feels right.",
    career: "Your professional path is calling for clarity.",
    money: "The universe is aligning your resources.",
    growth: "Your transformation is unfolding.",
    decision: "The answer is closer than you think.",
    general: "The guidance you're seeking is here."
  };
  
  const openers = personalizedOpeners[emotion] || personalizedOpeners.neutral;
  const randomOpener = openers[Math.floor(Math.random() * openers.length)];
  
  let personalizedMessage = randomOpener;
  
  if (type === 'post-reading' && context.lastQuestion) {
    const questionPreview = context.lastQuestion.slice(0, 30) + (context.lastQuestion.length > 30 ? '...' : '');
    personalizedMessage = `That question you asked about "${questionPreview}"... ${thematicClosers[theme] || thematicClosers.general}`;
  } else if (type === 'reactivation' || type === 'cold-reactivation') {
    const daysInactive = Math.floor((Date.now() - new Date(context.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24));
    const concernOpeners = [
      `I noticed you haven't checked in for ${daysInactive} days...`,
      `It's been a little while...`,
      `Something shifted around your situation...`
    ];
    personalizedMessage = concernOpeners[Math.floor(Math.random() * concernOpeners.length)] + ' ' + thematicClosers[theme];
  } else if (type === 'conversion') {
    const conversionOpeners = [
      `Your situation with ${theme}... it needs more than a quick reading.`,
      `Some answers need personal guidance... yours feels like one of them.`,
      `The pattern I'm seeing in your ${theme} energy... it's calling for attention.`
    ];
    personalizedMessage = conversionOpeners[Math.floor(Math.random() * conversionOpeners.length)];
  }
  
  return { message: personalizedMessage, cta: base.cta };
}

function determinePriority(context: UserContext): 'high' | 'medium' | 'low' {
  const segment = classifyUser(context);
  const daysSinceActive = Math.floor((Date.now() - new Date(context.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24));
  
  if (context.bookingSubmitted || (context.readingCount >= 3 && context.bookingPageVisited)) {
    return 'high';
  }
  
  if (segment === 'cold' && daysSinceActive > 7) {
    return 'low';
  }
  
  if (segment === 'inactive' || daysSinceActive >= INACTIVITY_DAYS_THRESHOLD) {
    return 'medium';
  }
  
  return 'medium';
}

export function decideMessage(context: UserContext): TriggerResult {
  const now = new Date();
  const segment = classifyUser(context);
  const daysSinceActive = Math.floor((now.getTime() - new Date(context.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24));
  const hoursSinceLastReading = context.lastReadingTime 
    ? Math.floor((now.getTime() - new Date(context.lastReadingTime).getTime()) / (1000 * 60 * 60))
    : null;
  
  const lastEventTime = context.events.length > 0
    ? Math.max(...context.events.map(e => new Date(e.timestamp).getTime()))
    : null;
  const hoursSinceLastEvent = lastEventTime ? Math.floor((now.getTime() - lastEventTime) / (1000 * 60 * 60)) : null;
  
  const alreadySentToday = context.events.some(e => {
    const eventTime = new Date(e.timestamp);
    return e.eventName === 'whatsapp_message_sent' && 
           eventTime.toDateString() === now.toDateString();
  });
  
  if (alreadySentToday) {
    return {
      shouldTrigger: false,
      triggerType: 'none',
      userId: context.userId,
      decision: null
    };
  }
  
  if (shouldSendConversionMessage(context.events as any)) {
    const { message, cta } = generatePersonalizedMessage(context, 'conversion');
    const decision: MessageDecision = {
      type: 'conversion',
      message,
      cta,
      sendTime: now,
      priority: 'high',
      reason: 'High intent detected (multiple readings or booking page visit)',
      contextUsed: ['readingCount', 'bookingPageVisited', 'segment']
    };
    
    return {
      shouldTrigger: true,
      triggerType: 'high-intent',
      userId: context.userId,
      decision
    };
  }
  
  if (hoursSinceLastReading !== null && 
      hoursSinceLastReading >= POST_READING_MIN_HOURS && 
      hoursSinceLastReading <= POST_READING_MAX_HOURS) {
    const { message, cta } = generatePersonalizedMessage(context, 'post-reading');
    const decision: MessageDecision = {
      type: 'post-reading',
      message,
      cta,
      sendTime: now,
      priority: 'medium',
      reason: `Post-reading follow-up (${hoursSinceLastReading} hours since last reading)`,
      contextUsed: ['lastQuestion', 'lastReadingTime', 'lastReadingTopic']
    };
    
    return {
      shouldTrigger: true,
      triggerType: 'post-reading',
      userId: context.userId,
      decision
    };
  }
  
  if (daysSinceActive >= INACTIVITY_DAYS_THRESHOLD) {
    const isCold = daysSinceActive > 7;
    const messageType = isCold ? 'cold-reactivation' : 'reactivation';
    const { message, cta } = generatePersonalizedMessage(context, messageType);
    
    const decision: MessageDecision = {
      type: messageType,
      message,
      cta,
      sendTime: now,
      priority: 'medium',
      reason: `Inactivity detected (${daysSinceActive} days since last activity)`,
      contextUsed: ['lastActiveAt', 'segment', 'lastQuestion']
    };
    
    return {
      shouldTrigger: true,
      triggerType: 'inactivity',
      userId: context.userId,
      decision
    };
  }
  
  const currentHour = now.getHours();
  const isAppropriateDailyTime = currentHour >= DAILY_HOUR - 1 && currentHour <= DAILY_HOUR + 2;
  const hoursSinceDailyEvent = hoursSinceLastEvent !== null && hoursSinceLastEvent < 20;
  
  if (isAppropriateDailyTime && !hoursSinceDailyEvent && segment !== 'cold') {
    const { message, cta } = generatePersonalizedMessage(context, 'daily-pull');
    
    const decision: MessageDecision = {
      type: 'daily-pull',
      message,
      cta,
      sendTime: now,
      priority: 'low',
      reason: `Daily pull scheduled for ${segment} user`,
      contextUsed: ['segment', 'lastQuestion', 'readingCount']
    };
    
    return {
      shouldTrigger: true,
      triggerType: 'daily',
      userId: context.userId,
      decision
    };
  }
  
  return {
    shouldTrigger: false,
    triggerType: 'none',
    userId: context.userId,
    decision: null
  };
}

export function decideMessageBatch(users: UserContext[]): TriggerResult[] {
  const results: TriggerResult[] = [];
  const todaySent = new Set<string>();
  
  for (const user of users) {
    const decision = decideMessage(user);
    
    if (decision.shouldTrigger && decision.decision && !todaySent.has(user.userId)) {
      results.push(decision);
      todaySent.add(user.userId);
    }
  }
  
  return results.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.decision?.priority || 'low'] - priorityOrder[b.decision?.priority || 'low'];
  });
}

export function generateAgentSummary(user: UserContext): {
  userId: string;
  segment: string;
  daysSinceActive: number;
  nextAction: string;
  emotionalState: string;
  recommendedMessage: string;
} {
  const segment = classifyUser(user);
  const daysSinceActive = Math.floor((Date.now() - new Date(user.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24));
  const emotion = user.lastQuestion ? detectEmotionalTone(user.lastQuestion) : 'unknown';
  const theme = user.lastQuestion ? detectTheme(user.lastQuestion) : 'unknown';
  
  let nextAction = 'No action needed';
  let recommendedMessage = '';
  
  const decision = decideMessage(user);
  if (decision.shouldTrigger && decision.decision) {
    nextAction = `Send ${decision.triggerType} message (${decision.decision.priority} priority)`;
    recommendedMessage = decision.decision.message;
  }
  
  return {
    userId: user.userId,
    segment,
    daysSinceActive,
    nextAction,
    emotionalState: `${emotion} / ${theme}`,
    recommendedMessage
  };
}