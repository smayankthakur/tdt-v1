import { NextResponse } from 'next/server';
import { decideMessage, decideMessageBatch } from '@/lib/tarot-agent';
import { sendBulkMessages } from '@/lib/whatsapp-integration';
import { trackUserActivity } from '@/lib/user-tracking';

interface ProcessedUser {
  userId: string;
  phone?: string;
  segment: string;
  lastActiveAt: string;
  sessionCount: number;
  readingCount: number;
  lastQuestion?: string;
  lastReadingTime?: string;
  bookingPageVisited: boolean;
  bookingSubmitted: boolean;
}

const userDatabase: Map<string, ProcessedUser> = new Map();

function initializeMockUsers() {
  if (userDatabase.size === 0) {
    const mockData: ProcessedUser[] = [
      {
        userId: 'user-001',
        phone: '+1234567890',
        segment: 'new',
        lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sessionCount: 1,
        readingCount: 1,
        lastQuestion: 'Will my love life improve soon?',
        lastReadingTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        bookingPageVisited: false,
        bookingSubmitted: false
      },
      {
        userId: 'user-002',
        phone: '+1234567891',
        segment: 'active',
        lastActiveAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        sessionCount: 5,
        readingCount: 4,
        lastQuestion: 'Should I switch jobs?',
        lastReadingTime: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
        bookingPageVisited: true,
        bookingSubmitted: false
      },
      {
        userId: 'user-003',
        phone: '+1234567892',
        segment: 'inactive',
        lastActiveAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        sessionCount: 3,
        readingCount: 2,
        lastQuestion: 'Why do I feel stuck in life?',
        lastReadingTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        bookingPageVisited: false,
        bookingSubmitted: false
      },
      {
        userId: 'user-004',
        phone: '+1234567893',
        segment: 'cold',
        lastActiveAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        sessionCount: 2,
        readingCount: 1,
        lastQuestion: 'What does my future hold?',
        lastReadingTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        bookingPageVisited: false,
        bookingSubmitted: false
      }
    ];
    
    mockData.forEach(u => userDatabase.set(u.userId, u));
  }
  return Array.from(userDatabase.values());
}

function toUserContext(user: ProcessedUser) {
  return {
    userId: user.userId,
    phone: user.phone,
    segment: user.segment as any,
    lastActiveAt: new Date(user.lastActiveAt),
    sessionCount: user.sessionCount,
    readingCount: user.readingCount,
    lastQuestion: user.lastQuestion,
    lastReadingTime: user.lastReadingTime ? new Date(user.lastReadingTime) : undefined,
    lastReadingTopic: undefined,
    lastReadingEmotion: undefined,
    bookingPageVisited: user.bookingPageVisited,
    bookingSubmitted: user.bookingSubmitted,
    totalRevenue: 0,
    createdAt: new Date(),
    events: []
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    initializeMockUsers();
    const users = initializeMockUsers();

    if (action === 'run-daily') {
      const userContexts = users.map(toUserContext);
      const decisions = decideMessageBatch(userContexts);
      
      const messagesToSend = decisions
        .filter(d => d.shouldTrigger && d.decision)
        .map(d => ({
          phoneNumber: users.find(u => u.userId === d.userId)?.phone || '',
          userId: d.userId,
          decision: d.decision!
        }))
        .filter(m => m.phoneNumber);

      const sendResults = await sendBulkMessages(messagesToSend);

      return NextResponse.json({
        action: 'daily-run',
        timestamp: new Date().toISOString(),
        usersProcessed: users.length,
        messagesTriggered: decisions.filter(d => d.shouldTrigger).length,
        messagesSent: sendResults.successful,
        sendResults: sendResults.results.map(r => ({
          userId: r.userId,
          success: r.success,
          messageId: r.messageId
        }))
      });
    }

    if (action === 'analyze-all') {
      const userContexts = users.map(toUserContext);
      const decisions = userContexts.map(ctx => {
        const decision = decideMessage(ctx);
        return {
          userId: ctx.userId,
          segment: ctx.segment,
          shouldTrigger: decision.shouldTrigger,
          triggerType: decision.triggerType,
          priority: decision.decision?.priority,
          messageType: decision.decision?.type,
          message: decision.decision?.message?.substring(0, 50) + '...'
        };
      });

      return NextResponse.json({
        action: 'analyze-all',
        timestamp: new Date().toISOString(),
        usersProcessed: users.length,
        decisions
      });
    }

    if (action === 'process-reading') {
      const { userId, question, readingTime } = body;
      
      if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
      }

      const user = userDatabase.get(userId);
      if (user) {
        user.lastActiveAt = new Date().toISOString();
        user.sessionCount += 1;
        user.readingCount += 1;
        user.lastQuestion = question;
        user.lastReadingTime = new Date().toISOString();
        
        trackUserActivity(userId, 'reading');
      }

      return NextResponse.json({
        action: 'process-reading',
        userId,
        message: 'User activity tracked',
        nextTrigger: 'post-reading (2-6 hours)'
      });
    }

    if (action === 'track-booking-visit') {
      const { userId } = body;
      
      if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
      }

      const user = userDatabase.get(userId);
      if (user) {
        user.bookingPageVisited = true;
        user.lastActiveAt = new Date().toISOString();
        
        trackUserActivity(userId, 'booking');
      }

      return NextResponse.json({
        action: 'track-booking-visit',
        userId,
        message: 'User marked as high intent',
        nextTrigger: 'conversion message (next cron run)'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Automation runner error:', error);
    return NextResponse.json({ error: 'Automation failed' }, { status: 500 });
  }
}

export async function GET() {
  initializeMockUsers();
  const users = initializeMockUsers();

  return NextResponse.json({
    runner: 'Divine Tarot Automation Runner',
    version: '1.0.0',
    status: 'ready',
    usersTracked: users.length,
    actions: {
      'run-daily': 'Run daily message automation',
      'analyze-all': 'Analyze all users and return trigger decisions',
      'process-reading': 'Track reading completion',
      'track-booking-visit': 'Mark user as high intent'
    },
    nextScheduledRun: 'Cron: every 6 hours'
  });
}