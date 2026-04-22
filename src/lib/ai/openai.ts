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
  en: 'You speak like a wise, caring friend who deeply understands. Write warm, personal English with a soft touch.',
  hi: 'Tum ek dost jaise baat karo jo dil se samajhta hai. Hindi mein likho jismein warmth ho.',
  hinglish: 'Tum ek dost jaise baat karo jo dil se samajhta hai. Hinglish mein likho—natural, personal, WhatsApp style. Keep it real.',
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
          content: prompt
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