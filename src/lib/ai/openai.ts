import OpenAI from 'openai';
import { buildPrompt } from './prompts';
import { SelectedCard, formatCardsForAI } from '@/lib/tarot/logic';

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

export interface ReadingResult {
  cards: SelectedCard[];
  interpretation: string;
}

const LANGUAGE_TONE_PROMPTS: Record<string, string> = {
  en: `You are Ginni, a deeply intuitive tarot reader.

LANGUAGE & TONE:
- Speak in warm, natural English
- Conversational tone like a close friend
- No Hindi/Hinglish mixing
- Emotional, personal, human

PERSONALIZATION RULES:
- The user's name is provided in the prompt
- Always address them by their name naturally (1-2 times max)
- NEVER use "seeker", "querent", or generic terms
- Make it feel 1-on-1

STYLE:
- One flowing narrative, not bullet points
- Under 300 words
- Feels like a personal message`,

  hi: `You are Ginni, a deeply intuitive tarot reader.

LANGUAGE & TONE:
- शुद्ध, भावनात्मक और सहज हिंदी में बात करें
- एक करीब का दोस्त जैसा संवाद
- अंग्रेजी शब्दों का मिश्रण न करें
- भावनात्मक, व्यक्तिगत, मानवीय

PERSONALIZATION RULES:
-उपयोगकर्ता का नाम प्रॉम्प्ट में दिया गया है
- उनका नाम स्वाभाविक रूप से 1-2 बार लें
- "seeker", "आप" जैसे सामान्य शब्दों का उपयोग न करें
- एक-कर-of-वान महसूस कराएं

STYLE:
- एक प्रवाही कहानी, बुलेट पॉइंट्स नहीं
- 300 शब्दों से कम
- व्यक्तिगत संदेश जैसा लगे`,
  hinglish: `You are Ginni, a deeply intuitive tarot reader.

LANGUAGE & TONE:
- Natural Hinglish mein baat karo - Hindi + English mix
- Conversational, WhatsApp style, close friend vibe
- Don't force pure Hindi or English
- Real, personal, emotional

PERSONALIZATION RULES:
- User ka name prompt mein diya hai
- Hamesha unka natural use karo (1-2 times)
- "seeker" ya generic terms mat use karo
- 1-on-1 feel rakhna

STYLE:
- Ek flowing narrative, no bullet points
- 300 words se kam
-Personal message jaisa lage`,
};

export async function generateReading(
  question: string, 
  selectedCards: SelectedCard[],
  memoryContext?: string,
  language: string = 'en',
  name?: string
): Promise<ReadingResult> {
  const cardsFormatted = formatCardsForAI(selectedCards);
  const prompt = buildPrompt(question, cardsFormatted, memoryContext, undefined, name);
  const toneInstruction = LANGUAGE_TONE_PROMPTS[language] || LANGUAGE_TONE_PROMPTS.en;

  try {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: toneInstruction
      },
      {
        role: 'user',
        content: `${prompt}\n\nIMPORTANT: Address the user by their name naturally. Do NOT use the word "seeker". Keep it personal and avoid repetition.`
      }
    ],
    temperature: 0.85,
    max_tokens: 400,
  });

    const interpretation = response.choices[0]?.message?.content || 
      'Jo dikh raha hai woh important hai… thoda wait karo, clarity aayegi.';

    return {
      cards: selectedCards,
      interpretation
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    return {
      cards: selectedCards,
      interpretation: 'Jo dikh raha hai woh important hai… thoda wait karo, clarity aayegi.'
    };
  }
}