import { NextResponse } from 'next/server';
import { 
  TrackingEvent, 
  EventName, 
  FunnelStage, 
  calculateFunnelStage, 
  calculateFunnelMetrics 
} from '@/lib/funnel-tracking';

const inMemoryEvents: TrackingEvent[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, sessionId, eventName, source, utmSource, utmMedium, utmCampaign, referrer, metadata } = body;

    if (!eventName) {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

    const event: TrackingEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      sessionId,
      eventName: eventName as EventName,
      timestamp: new Date(),
      source,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
      metadata,
    };

    inMemoryEvents.push(event);

    return NextResponse.json({
      success: true,
      eventId: event.id,
      currentStage: calculateFunnelStage(inMemoryEvents.filter(e => e.userId === userId))
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const sessionId = searchParams.get('sessionId');
  const eventName = searchParams.get('eventName');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let filteredEvents = [...inMemoryEvents];

  if (userId) {
    filteredEvents = filteredEvents.filter(e => e.userId === userId);
  }
  if (sessionId) {
    filteredEvents = filteredEvents.filter(e => e.sessionId === sessionId);
  }
  if (eventName) {
    filteredEvents = filteredEvents.filter(e => e.eventName === eventName);
  }
  if (startDate) {
    filteredEvents = filteredEvents.filter(e => new Date(e.timestamp) >= new Date(startDate));
  }
  if (endDate) {
    filteredEvents = filteredEvents.filter(e => new Date(e.timestamp) <= new Date(endDate));
  }

  if (userId) {
    return NextResponse.json({
      events: filteredEvents,
      userId,
      stage: calculateFunnelStage(filteredEvents),
      totalEvents: filteredEvents.length
    });
  }

  return NextResponse.json({
    events: filteredEvents.slice(-100),
    totalEvents: inMemoryEvents.length,
    metrics: calculateFunnelMetrics(inMemoryEvents)
  });
}

export async function DELETE() {
  inMemoryEvents.length = 0;
  return NextResponse.json({ success: true, message: 'All tracking data cleared' });
}