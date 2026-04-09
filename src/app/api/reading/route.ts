import { NextResponse } from 'next/server';
import { getRandomCards, generateInterpretation } from '@/data/tarot';

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

    const cards = getRandomCards(3);
    const interpretation = generateInterpretation(question, cards);

    return NextResponse.json({
      cards,
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