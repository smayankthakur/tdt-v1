import OpenAI from 'openai';
import { buildPrompt } from './prompts';
import { SelectedCard, formatCardsForAI } from '../tarot/logic';

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

const LANGUAGE_SYSTEM_PROMPTS: Record<string, string> = {
  en: 'You are a mystical, emotionally intelligent tarot reader. Speak like a wise guide, not an AI. Write in elegant English.',
  hi: 'आप एक रहस्यमय, भावनात्मक रूप से बुद्धिमान टैरो रीडर हैं। एक बुद्धिमान मार्गदर्शक की तरह बोलें, AI की तरह नहीं। हिंदी में लिखें जो प्राकृतिक और सुंदर हो।',
  hinglish: 'You are a mystical tarot reader. Speak like a friend who really cares. Write in Hinglish - conversational mix of Hindi and English with WhatsApp style. Keep it real, keep it personal.',
};

export async function generateReading(
  question: string, 
  selectedCards: SelectedCard[],
  memoryContext?: string,
  language: string = 'en'
): Promise<ReadingResult> {
  const cardsFormatted = formatCardsForAI(selectedCards);
  const prompt = buildPrompt(question, cardsFormatted, memoryContext);
  const systemPrompt = LANGUAGE_SYSTEM_PROMPTS[language] || LANGUAGE_SYSTEM_PROMPTS.en;

  try {
    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const interpretation = response.choices[0]?.message?.content || 
      'The cards have spoken, but the message is still forming. Please ask again.';

    return {
      cards: selectedCards,
      interpretation
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback reading if API fails
    return {
      cards: selectedCards,
      interpretation: generateFallbackReading(question, selectedCards)
    };
  }
}

function generateFallbackReading(question: string, cards: SelectedCard[]): string {
  // Simple fallback for when OpenAI is unavailable
  const cardMeanings = cards.map(c => c.card.meaning).join(', ');
  const firstCard = cards[0]?.card.name || 'The cards';
  
  return `I sense that your question about "${question.slice(0, 50)}..." weighs heavily on your mind. 

The ${firstCard} has appeared prominently, suggesting that ${cardMeanings}.

Trust your intuition in this matter. The universe is guiding you toward what you need to see. Be open to the messages coming through.

There's more depth here that deserves exploration...`;
}