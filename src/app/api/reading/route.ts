import { NextResponse } from 'next/server';
import { selectRandomCards } from '@/lib/tarot';
import { generateReading } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, userId } = body;

    if (!question || question.length < 3) {
      return NextResponse.json(
        { error: 'Please ask a question to receive guidance from the cards.' },
        { status: 400 }
      );
    }

    // Select 3 random cards
    const selectedCards = selectRandomCards(3);
    
    // Generate AI reading using OpenAI
    const result = await generateReading(question, selectedCards);

    return NextResponse.json({
      cards: result.cards,
      interpretation: result.interpretation,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Reading generation error:', error);
    return NextResponse.json(
      { error: 'The cards are having difficulty connecting. Please try again.' },
      { status: 500 }
    );
  }
}