import { NextResponse } from 'next/server';
import { runAutomation } from '@/lib/automation/engine';
import { startScheduler, stopScheduler, getSchedulerStatus } from '@/lib/automation/scheduler';

let schedulerInitialized = false;

function initScheduler() {
  if (!schedulerInitialized) {
    startScheduler();
    schedulerInitialized = true;
  }
}

initScheduler();

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const type = body.type || 'all';
    
    console.log(`[Cron] Running automation: ${type}`);
    
    const result = await runAutomation(type);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      type,
      ...result
    });
  } catch (error) {
    console.error('[Cron] Error processing scheduled messages:', error);
    return NextResponse.json(
      { error: 'Failed to process scheduled messages' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Cron Messages',
    version: '2.0.0',
    status: 'ready',
    description: 'Scheduled endpoint for automated WhatsApp messages',
    supportedTypes: ['all', 'daily', 'reactivation', 'conversion'],
    usage: 'POST to this endpoint with { type: "daily" } for scheduled runs',
    recommendedSchedule: {
      daily: 'Every day at 9 AM',
      reactivation: 'Every hour',
      conversion: 'Every 2 hours',
      all: 'Every 6 hours'
    }
  });
}