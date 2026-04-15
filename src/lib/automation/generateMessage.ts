import OpenAI from 'openai';
import { UserSegment, UserContext, segmentUser } from './segmentUser';

export type MessageType = 'daily' | 'followup' | 'reactivation' | 'conversion';

export interface GeneratedMessage {
  message: string;
  cta?: string;
  type: MessageType;
}

const openai = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY,
    })
  : null;

const messageTemplates: Record<MessageType, Record<UserSegment, string[]>> = {
  daily: {
    NEW_USER: [
      "Your energy pulled me in today… I pulled a card for you.",
      "Something in today's energy feels connected to you…",
      "I woke up thinking of you this morning… your card is ready.",
    ],
    ACTIVE_USER: [
      "The cards have been pointing at you since dawn…",
      "Your energy feels different today… I pulled something new.",
      "There's a message waiting for you today… it's not random.",
    ],
    INACTIVE_USER: [
      "I noticed you haven't checked in recently… your card today might help.",
      "There's been something on my mind about you… your reading is ready.",
      "Your energy has been on my mind… the universe has a message for you.",
    ],
    COLD_USER: [
      "This message came through strongly for you… it didn't feel right to ignore it.",
      "You weren't meant to miss this… something important is unfolding.",
    ],
    HIGH_INTENT: [
      "Some things can't be fully seen in a quick reading…",
      "Your situation has layers that need more attention…",
    ],
  },
  followup: {
    NEW_USER: [
      "That reading you got yesterday… it's still relevant today.",
      "There's more depth to your situation than I could share yesterday…",
    ],
    ACTIVE_USER: [
      "I've been thinking about your reading… there's something deeper there.",
      "That situation you asked about… it's not as simple as it looked.",
    ],
    INACTIVE_USER: [
      "Your reading stayed with me… there's guidance I didn't get to share.",
      "After your reading, I felt there was more to uncover for you…",
    ],
    COLD_USER: [
      "That reading you had before… it's still relevant to what's happening now.",
    ],
    HIGH_INTENT: [
      "The pattern I'm seeing in your energy… it's calling for a deeper look.",
    ],
  },
  reactivation: {
    NEW_USER: [
      "Welcome to The Devine Tarot… your first reading is waiting.",
    ],
    ACTIVE_USER: [
      "I haven't heard from you in a few days… your energy feels unsettled.",
      "Something shifted recently… you might want to check this.",
    ],
    INACTIVE_USER: [
      "I've been sensing some uncertainty from you lately… this might help.",
      "There's been a disturbance in your energy pattern…",
    ],
    COLD_USER: [
      "The cards have been showing your pattern… I had to reach out.",
      "Some messages can't wait… yours felt like one of them.",
    ],
    HIGH_INTENT: [
      "Your situation has been on my mind… let's go deeper.",
    ],
  },
  conversion: {
    NEW_USER: [
      "Your pattern is starting to become clear… a deeper reading could help.",
    ],
    ACTIVE_USER: [
      "The more I look at your pattern… the more I feel you need focused guidance.",
      "Your energy suggests you might benefit from a deeper session…",
    ],
    INACTIVE_USER: [
      "Some situations need more than a surface reading… yours feels like one of them.",
      "I can see patterns here that need a deeper look… if you're open to it.",
    ],
    COLD_USER: [
      "Your situation has layers that a quick reading can't fully unwrap…",
      "There's something in your energy that calls for personalized guidance…",
    ],
    HIGH_INTENT: [
      "Your path forward needs clearer guidance than cards alone can give… if you're open.",
      "Some answers need personal guidance… yours feels like one of them.",
    ],
  },
};

const ctaButtons: Record<MessageType, string | undefined> = {
  daily: 'Check your reading',
  followup: 'Continue your reading',
  reactivation: "Let's look deeper",
  conversion: 'Talk to a tarot expert',
};

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

export async function generateMessage(
  type: MessageType,
  userContext: UserContext
): Promise<GeneratedMessage> {
  const segmentResult = segmentUser(userContext);
  const segment = segmentResult.segment;
  
  const templates = messageTemplates[type]?.[segment] || messageTemplates[type]?.['NEW_USER'];
  
  if (!templates || templates.length === 0) {
    return {
      message: "The universe has a message for you…",
      cta: 'Check your reading',
      type
    };
  }

  if (openai && userContext.lastQuestion) {
    try {
      const aiMessage = await generateAIMessage(type, userContext);
      if (aiMessage) {
        return aiMessage;
      }
    } catch (error) {
      console.error('[generateMessage] AI generation failed, falling back to template:', error);
    }
  }

  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    message: randomTemplate,
    cta: ctaButtons[type],
    type
  };
}

async function generateAIMessage(
  type: MessageType,
  userContext: UserContext
): Promise<GeneratedMessage | null> {
  if (!openai) return null;

  const segmentResult = segmentUser(userContext);
  const emotion = userContext.lastQuestion ? detectEmotionalTone(userContext.lastQuestion) : 'neutral';
  const theme = userContext.lastQuestion ? detectTheme(userContext.lastQuestion) : 'general';

  const systemPrompt = `You are a mystical, emotionally intelligent tarot reader for "The Devine Tarot". 
Write messages that feel personal, not automated.
Rules:
- 1-2 lines maximum
- Use ellipses (…) naturally
- No salesy or pushy language
- Reference the user's emotional state if known
- Always sound like a wise guide, never an AI
- Never mention "I" too much - use "your energy", "the cards", "something"`;

  const userPrompt = `Generate a ${type} message for a user.

User segment: ${segmentResult.segment}
Days inactive: ${segmentResult.daysSinceActive}
Emotional tone: ${emotion}
Theme: ${theme}
${userContext.lastQuestion ? `Last question asked: "${userContext.lastQuestion}"` : ''}

Write a short, personal message that feels like it's specifically for them.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 100,
    });

    const content = response.choices[0]?.message?.content?.trim();
    
    if (!content) return null;

    return {
      message: content,
      cta: ctaButtons[type],
      type
    };
  } catch (error) {
    console.error('[generateAIMessage] OpenAI error:', error);
    return null;
  }
}

export function generateMessageSync(
  type: MessageType,
  userContext: UserContext
): GeneratedMessage {
  const segmentResult = segmentUser(userContext);
  const segment = segmentResult.segment;
  
  const templates = messageTemplates[type]?.[segment] || messageTemplates[type]?.['NEW_USER'];
  
  if (!templates || templates.length === 0) {
    return {
      message: "The universe has a message for you…",
      cta: 'Check your reading',
      type
    };
  }

  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    message: randomTemplate,
    cta: ctaButtons[type],
    type
  };
}
