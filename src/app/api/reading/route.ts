import { NextResponse } from 'next/server';
import { selectCards, generateInterpretation } from '@/data/tarot';
import { trackUserActivity } from '@/lib/user-tracking';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, userId } = body;

    if (!question || question.length < 10) {
      return NextResponse.json(
        { error: 'Question must be at least 10 characters' },
        { status: 400 }
      );
    }

    const selectedCards = selectCards(question, 3);
    const interpretation = generateInterpretation(question, selectedCards);

    if (userId) {
      trackUserActivity(userId, 'reading');
    }

    return NextResponse.json({
      cards: selectedCards,
      interpretation,
      timestamp: new Date().toISOString(),
      postReadingMessage: {
        enabled: true,
        triggerAfter: '6 hours',
        message: "I've been thinking about your reading… there's something deeper there."
      }
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate reading' },
      { status: 500 }
    );
  }
}