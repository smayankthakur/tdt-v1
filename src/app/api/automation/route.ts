import { NextResponse } from 'next/server';
import { runAutomation, triggerPostReadingMessage, triggerBookingIntent, updateUserActivity } from '@/lib/automation/engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, type } = body;

    if (action === 'run-daily' || action === 'run') {
      const result = await runAutomation(type as any || 'all');
      
      return NextResponse.json({
        action: 'run-automation',
        timestamp: new Date().toISOString(),
        ...result
      });
    }

    if (action === 'run-daily-only') {
      const result = await runAutomation('daily');
      
      return NextResponse.json({
        action: 'daily-run',
        timestamp: new Date().toISOString(),
        ...result
      });
    }

    if (action === 'run-reactivation') {
      const result = await runAutomation('reactivation');
      
      return NextResponse.json({
        action: 'reactivation-run',
        timestamp: new Date().toISOString(),
        ...result
      });
    }

    if (action === 'run-conversion') {
      const result = await runAutomation('conversion');
      
      return NextResponse.json({
        action: 'conversion-run',
        timestamp: new Date().toISOString(),
        ...result
      });
    }

    if (action === 'trigger-post-reading') {
      if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
      }
      
      const result = await triggerPostReadingMessage(userId);
      
      return NextResponse.json({
        action: 'post-reading-trigger',
        timestamp: new Date().toISOString(),
        ...result
      });
    }

    if (action === 'trigger-booking-intent') {
      if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
      }
      
      const result = await triggerBookingIntent(userId);
      
      return NextResponse.json({
        action: 'booking-intent-trigger',
        timestamp: new Date().toISOString(),
        ...result
      });
    }

    if (action === 'update-activity') {
      if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
      }
      
      await updateUserActivity(userId, body.activityType || 'session');
      
      return NextResponse.json({
        action: 'activity-updated',
        timestamp: new Date().toISOString(),
        userId
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Automation runner error:', error);
    return NextResponse.json({ error: 'Automation failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    runner: 'The Devine Tarot Automation Runner',
    version: '2.0.0',
    status: 'ready',
    actions: {
      'run-daily': 'Run all automation (daily, reactivation, conversion)',
      'run-daily-only': 'Run daily messages only',
      'run-reactivation': 'Run reactivation messages only',
      'run-conversion': 'Run conversion messages only',
      'trigger-post-reading': 'Trigger post-reading follow-up for a user',
      'trigger-booking-intent': 'Mark user as high intent',
      'update-activity': 'Update user activity (reading, session, booking)'
    },
    segments: ['NEW_USER', 'ACTIVE_USER', 'INACTIVE_USER', 'COLD_USER', 'HIGH_INTENT'],
    messageTypes: ['daily', 'followup', 'reactivation', 'conversion'],
    nextScheduledRun: 'Configure via cron or external scheduler'
  });
}