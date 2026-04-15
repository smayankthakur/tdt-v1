import { NextResponse } from 'next/server';
import { UserContext, decideMessage, decideMessageBatch, generateAgentSummary } from '@/lib/tarot-agent';

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
    lastReadingTime: new Date(Date.now() - 15 * 60 * 60 * 1000),
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

      const result = decideMessage(context);
      return NextResponse.json(result);
    }

    if (action === 'decide-batch') {
      const results = decideMessageBatch(mockUsers);
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

      const summary = generateAgentSummary(context);
      return NextResponse.json(summary);
    }

    if (action === 'simulate') {
      const results = mockUsers.map(user => {
        const decision = decideMessage(user);
        return {
          userId: user.userId,
          segment: user.segment,
          shouldTrigger: decision.shouldTrigger,
          triggerType: decision.triggerType,
          priority: decision.decision?.priority,
          messageType: decision.decision?.type,
          message: decision.decision?.message
        };
      });

      return NextResponse.json({
        simulationResults: results,
        summary: {
          total: mockUsers.length,
          triggers: {
            daily: results.filter(r => r.triggerType === 'daily').length,
            postReading: results.filter(r => r.triggerType === 'post-reading').length,
            inactivity: results.filter(r => r.triggerType === 'inactivity').length,
            highIntent: results.filter(r => r.triggerType === 'high-intent').length,
            none: results.filter(r => r.triggerType === 'none').length
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
    return NextResponse.json(generateAgentSummary(user));
  }

  return NextResponse.json({
    agentName: 'The Devine Tarot Agent',
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