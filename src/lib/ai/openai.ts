import OpenAI from 'openai';
import { buildPrompt } from './prompts';
import { SelectedCard, formatCardsForAI } from '../tarot/logic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY,
});

export interface ReadingResult {
  cards: SelectedCard[];
  interpretation: string;
}

export async function generateReading(question: string, selectedCards: SelectedCard[]): Promise<ReadingResult> {
  const cardsFormatted = formatCardsForAI(selectedCards);
  const prompt = buildPrompt(question, cardsFormatted);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a mystical, emotionally intelligent tarot reader. Speak like a wise guide, not an AI.'
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