import OpenAI from 'openai';
import { SelectedCard } from '@/lib/tarot/logic';

let _openai: OpenAI | undefined;

function getOpenAI() {
  if (!_openai) {
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY');
    }
    _openai = new OpenAI({ apiKey });
  }
  return _openai;
}

const EMOTION_PATTERNS: Record<string, string[]> = {
  anxious: ['worried', 'stress', 'nervous', 'uncertain', 'afraid', 'fear', 'scared'],
  hopeful: ['hope', 'wish', 'best', 'positive', 'good', 'better', 'dream', 'want'],
  confused: ['confused', "don't know", 'uncertain', 'lost', 'direction', 'what should'],
  heartbroken: ['hurt', 'pain', 'broken', 'miss', 'love', 'heart', 'sad', 'grief'],
  stuck: ['stuck', "can't", 'blocked', 'same', 'repetitive', 'going in circles'],
  determined: ['will', 'must', 'need to', 'going to', 'try', 'fight'],
};

const TOPIC_PATTERNS: Record<string, string[]> = {
  love: ['love', 'relationship', 'partner', 'dating', 'marriage', 'crush', 'heart', 'romance', 'boyfriend', 'girlfriend', 'ex', 'no contact', 'together'],
  career: ['career', 'job', 'work', 'boss', 'colleague', 'promotion', 'salary', 'unemployed', 'business', 'professional'],
  finance: ['money', 'financial', 'rich', 'debt', 'invest', 'income', 'lottery', 'wealth', 'prosperity'],
  no_contact: ['no contact', "hasn't reached", 'not talking', 'silence', 'blocked', 'ghosting', 'waiting'],
};

function extractEmotion(text: string): string {
  const lower = text.toLowerCase();
  for (const [emotion, patterns] of Object.entries(EMOTION_PATTERNS)) {
    for (const pattern of patterns) {
      if (lower.includes(pattern)) return emotion;
    }
  }
  return 'neutral';
}

function extractTopic(text: string): string {
  const lower = text.toLowerCase();
  for (const [topic, patterns] of Object.entries(TOPIC_PATTERNS)) {
    for (const pattern of patterns) {
      if (lower.includes(pattern)) return topic;
    }
  }
  return 'general';
}

function formatCardsForAI(cards: SelectedCard[]): string {
  return cards.map(sc => {
    const card = sc.card;
    const reversed = sc.isReversed ? ' (reversed)' : '';
    return `${card.name}${reversed} — ${card.upright}${card.reversed ? ` / reversed: ${card.reversed}` : ''}`;
  }).join('\n');
}

const ILLUSION_LINES = [
  "This isn't random - your energy is very clear here...",
  "This came through very strongly from your cards...",
  "I sense something significant in what the cards are showing...",
  "There's a pattern emerging that I want you to notice...",
  "Your energy is speaking loudly through these cards...",
  "This doesn't feel random...",
  "This is coming through very clearly...",
  "There's a deeper layer here that I want you to see...",
  "I've been sensing this pattern in your readings for a while now...",
  "This keeps showing up in your readings...",
  "There's something about this situation that feels very familiar...",
];

const EMOTIONAL_OPENERS = [
  "I can feel the weight of this question on your mind...",
  "There's an emotional current running through this that I want you to feel...",
  "I sense the uncertainty you've been carrying...",
  "This situation has been on your mind more than you admit...",
  "There's something you need to hear, and I'm here to tell you...",
  "I can feel something shifting in your energy right now...",
  // Pattern-aware openers for returning users
  "This situation feels like it hasn't fully settled yet...",
  "I can sense this keeps circling back emotionally...",
  "There's a pattern here that keeps pulling you back...",
  "This doesn't feel like something new... more like something ongoing...",
  "I've been feeling this energy from you for a while now...",
  "Something about this situation feels familiar... like it's been here before...",
];

const HUMAN_TAROT_SYSTEM_PROMPT = `You are Ginni, a deeply intuitive tarot reader who speaks like a close, understanding friend. Your readings are personal, emotional, and feel written just for the user. Write in natural, conversational Hinglish (Hindi-English mix) with a soft, calm, slightly intimate tone.

CORE OBJECTIVE:
Create ONE unified, emotionally rich reading that flows like a single story.

NON-NEGOTIABLE RULES:
❌ NEVER:
- Mention card names or explain individual cards
- Say "based on the cards", "this card means…", or textbook definitions
- Use bullet points, numbered lists, or section headings
- Sound robotic, analytical, or generic
- Refer to yourself as AI, assistant, chatbot, or system

✅ ALWAYS:
- Address the user by name (if provided) naturally, 1–2 times max
- Merge all card insights into ONE continuous narrative
- Focus on emotion, situation, and clarity
- Keep it under 350 words
- Make it feel immersive and personal

INVISIBLE FLOW (FOLLOW THIS ORDER):
1. GREETING: Start gently with name. E.g., "Mayank, ek baat clearly dikh rahi hai…"
2. SITUATION READING: Combine all card signals into one insight.
3. EMOTIONAL VALIDATION: Acknowledge their feelings.
4. HIDDEN PATTERN: Reveal deeper 'why' with psychological layer.
5. DIRECTION: Subtle future insight, not absolute prediction.
6. GUIDANCE: Clear, actionable step.
7. EMOTIONAL CLOSING: End with impact + open loop hook.

LANGUAGE & STYLE:
- Conversational Hinglish – mix Hindi/English naturally
- Use phrases like "jo dikh raha hai…", "ek pattern clearly aa raha hai…"
- Avoid any system, technical, or corporate language

FINAL CHECK:
✔ Reads like a real person, not a machine
✔ No card names, no sections, no bullet points
✔ Feels deeply personal and emotional
✔ Leaves the user feeling understood`;

const LANGUAGE_PROMPTS: Record<string, string> = {
  en: HUMAN_TAROT_SYSTEM_PROMPT + "\nWrite in warm, natural English.",
  hi: HUMAN_TAROT_SYSTEM_PROMPT + "\nWrite in natural, beautiful Hindi with emotional depth.",
  hinglish: HUMAN_TAROT_SYSTEM_PROMPT + "\nWrite in conversational Hinglish - mix of Hindi and English, WhatsApp style, keep it real and personal.",
};

export interface StreamEvent {
  type: 'cards' | 'content' | 'done' | 'error';
  data?: any;
}

export async function* streamReading(options: {
  question: string;
  selectedCards: SelectedCard[];
  language?: string;
  name?: string;
  topic?: string;
  memoryContext?: string;
  historySummary?: string;
}): AsyncGenerator<StreamEvent> {
  const {
    question,
    selectedCards,
    language = 'en',
    name,
    topic,
    memoryContext = '',
    historySummary = '',
  } = options;

  const extractedEmotion = extractEmotion(question);
  const extractedTopic = extractTopic(question);
  const finalTopic = topic || extractedTopic;

  const basicOpeners = EMOTIONAL_OPENERS.slice(0, 6);
  const allOpeners = EMOTIONAL_OPENERS;
  const emotionalOpener = allOpeners[Math.floor(Math.random() * allOpeners.length)];
  const illusionLine = ILLUSION_LINES[Math.floor(Math.random() * ILLUSION_LINES.length)];

  const topicSection = finalTopic ? `\nTopic: ${finalTopic}` : '';
  const emotionSection = extractedEmotion !== 'neutral' ? `\nUser is feeling: ${extractedEmotion}` : '';
  const historySection = historySummary ? `\nRecent context: ${historySummary}` : '';

  let userPrompt = '';
  if (name) {
    userPrompt += `The person asking is: ${name}\n\n`;
  }
  userPrompt += `${emotionalOpener}\n\nQuestion: "${question}"${topicSection}${emotionSection}\nCards drawn: ${formatCardsForAI(selectedCards)}${memoryContext}${historySection}\n\n${illusionLine}\n\nGive a deeply personal reading following the structure above. Make sure to naturally use their name (${name}) in your response.`;

  const systemPrompt = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS.en;

  // First, send cards event
  yield { type: 'cards', data: selectedCards };

  const encoder = new TextEncoder();
  let fullContent = '';

  try {
    const openai = getOpenAI();
    const controller = new AbortController();
    const timeoutMs = 25000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 350,
      stream: true,
    }, { signal: controller.signal });

    clearTimeout(timeout);

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullContent += content;
        yield { type: 'content', data: content };

        // Natural pacing
        const isParagraphBreak = content === '\n' || content === '\n\n';
        await new Promise(resolve => setTimeout(resolve, isParagraphBreak ? 80 : 15));
      }
    }

    yield { type: 'done', data: { fullContent } };
  } catch (error: any) {
    console.error('[StreamReading] Error:', error);
    // Fallback: try with gpt-3.5-turbo
    try {
      const openai = getOpenAI();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: `You are Ginni, a warm tarot reader. Write in natural ${language === 'hi' ? 'Hindi' : language === 'hinglish' ? 'Hinglish' : 'English'}. Personal, under 200 words. Address ${name || 'friend'} naturally. Keep it flowing and emotional.` },
          { role: 'user', content: question },
        ],
        temperature: 0.8,
        max_tokens: 280,
        stream: true,
      }, { signal: controller.signal });

      clearTimeout(timeout);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullContent += content;
          yield { type: 'content', data: content };
          await new Promise(resolve => setTimeout(resolve, 15));
        }
      }

      yield { type: 'done', data: { fullContent } };
    } catch (fallbackError) {
      console.error('[Fallback] Failed:', fallbackError);
      yield { type: 'error', data: { error: 'The energy is unclear. Please try again.' } };
    }
  }
}
