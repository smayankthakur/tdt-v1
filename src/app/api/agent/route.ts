import { NextResponse } from 'next/server';

interface UserContext {
  userId: string;
  phone?: string;
  segment: string;
  lastActiveAt: Date;
  sessionCount: number;
  readingCount: number;
  lastQuestion?: string;
  lastReadingTime?: Date;
  lastReadingTopic?: string;
  lastReadingEmotion?: string;
  bookingPageVisited: boolean;
  bookingSubmitted: boolean;
  totalRevenue: number;
  createdAt: Date;
  events: Array<{ id?: string; eventName: string; timestamp: Date; metadata?: Record<string, any> }>;
}

const mockUsers: UserContext[] = [
  {
    userId: 'user-001',
    phone: '+1234567890',
    segment: 'new',
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    sessionCount: 1,
    readingCount: 1,
    lastQuestion: 'Will my love life improve soon?',
    lastReadingTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    lastReadingTopic: 'love',
    lastReadingEmotion: 'hopeful',
    bookingPageVisited: false,
    bookingSubmitted: false,
    totalRevenue: 0,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    events: []
  },
  {
    userId: 'user-002',
    phone: '+1234567891',
    segment: 'active',
    lastActiveAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    sessionCount: 5,
    readingCount: 4,
    lastQuestion: 'Should I switch jobs?',
    lastReadingTime: new Date(Date.now() - 15 * 60 * 1000),
    lastReadingTopic: 'career',
    lastReadingEmotion: 'anxious',
    bookingPageVisited: true,
    bookingSubmitted: false,
    totalRevenue: 0,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    events: []
  },
  {
    userId: 'user-003',
    phone: '+1234567892',
    segment: 'inactive',
    lastActiveAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    sessionCount: 3,
    readingCount: 2,
    lastQuestion: 'Why do I feel stuck in life?',
    lastReadingTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    lastReadingTopic: 'growth',
    lastReadingEmotion: 'stuck',
    bookingPageVisited: false,
    bookingSubmitted: false,
    totalRevenue: 0,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    events: []
  },
  {
    userId: 'user-004',
    phone: '+1234567893',
    segment: 'cold',
    lastActiveAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    sessionCount: 2,
    readingCount: 1,
    lastQuestion: 'What does my future hold?',
    lastReadingTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    lastReadingTopic: 'general',
    lastReadingEmotion: 'confused',
    bookingPageVisited: false,
    bookingSubmitted: false,
    totalRevenue: 0,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    events: []
  }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, userContext } = body;

    if (action === 'decide') {
      const context = userContext || mockUsers.find(u => u.userId === userId);
      
      if (!context) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const result = { shouldTrigger: false, triggerType: 'none' as const, decision: null };
      return NextResponse.json(result);
    }

    if (action === 'decide-batch') {
      const results: any[] = [];
      return NextResponse.json({
        totalUsers: mockUsers.length,
        messagesToSend: results.length,
        results
      });
    }

    if (action === 'summary') {
      const context = userContext || mockUsers.find(u => u.userId === userId);
      
      if (!context) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const summary = {
        userId: context.userId,
        segment: context.segment,
        daysSinceActive: Math.floor((Date.now() - new Date(context.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24)),
        nextAction: 'No action needed' as const,
        emotionalState: context.lastReadingEmotion || 'unknown',
        recommendedMessage: ''
      };
      return NextResponse.json(summary);
    }

    if (action === 'simulate') {
      const results = mockUsers.map(user => ({
        userId: user.userId,
        segment: user.segment,
        shouldTrigger: false,
        triggerType: 'none' as const,
        priority: null,
        messageType: null,
        message: ''
      }));

      return NextResponse.json({
        simulationResults: results,
        summary: {
          total: mockUsers.length,
          triggers: {
            daily: 0,
            postReading: 0,
            inactivity: 0,
            highIntent: 0,
            none: mockUsers.length
          }
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Agent error:', error);
    return NextResponse.json({ error: 'Agent processing failed' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (userId) {
    const user = mockUsers.find(u => u.userId === userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({
      userId: user.userId,
      segment: user.segment,
      daysSinceActive: Math.floor((Date.now() - new Date(user.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24)),
      nextAction: 'No action needed' as const,
      emotionalState: user.lastReadingEmotion || 'unknown',
      recommendedMessage: ''
    });
  }

  return NextResponse.json({
    agentName: 'The Divine Tarot Agent',
    version: '1.0.0',
    status: 'active',
    usersTracked: mockUsers.length,
    endpoints: {
      decide: 'POST { action: "decide", userId }',
      'decide-batch': 'POST { action: "decide-batch" }',
      summary: 'POST { action: "summary", userId }',
      simulate: 'POST { action: "simulate" }'
    }
  });
}
