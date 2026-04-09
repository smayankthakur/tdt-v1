import { NextResponse } from 'next/server';
import { selectCards, generateInterpretation } from '@/data/tarot';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question || question.length < 10) {
      return NextResponse.json(
        { error: 'Question must be at least 10 characters' },
        { status: 400 }
      );
    }

    const selectedCards = selectCards(question, 3);
    const interpretation = generateInterpretation(question, selectedCards);

    return NextResponse.json({
      cards: selectedCards,
      interpretation,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate reading' },
      { status: 500 }
    );
  }
}