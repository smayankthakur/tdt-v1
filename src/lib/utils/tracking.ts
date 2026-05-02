import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export type EventName = 
  | 'landing_page_view'
  | 'start_reading_click'
  | 'reading_started'
  | 'question_submitted'
  | 'cards_selected'
  | 'reading_completed'
  | 'reading_viewed'
  | 'ginni_opened'
  | 'ginni_message_sent'
  | 'booking_page_visit'
  | 'booking_click'
  | 'booking_submitted'
  | 'payment_started'
  | 'payment_completed'
  | 'session_start'
  | 'session_end'
  | 'error_occurred';

export interface TrackingEvent {
  userId?: string;
  eventName: EventName;
  metadata?: Record<string, unknown>;
  source?: string;
}

export async function trackEvent(event: TrackingEvent): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.log('[Track Event]', event.eventName, event.metadata || '');
    return true;
  }

  try {
    const { error } = await supabase
      .from('events')
      .insert({
        user_id: event.userId || null,
        event_name: event.eventName,
        metadata: event.metadata || {},
      });

    if (error) {
      console.error('[Track Error]', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Track Exception]', err);
    return false;
  }
}

export function getFunnelStage(eventName: EventName): string {
  const stages: Record<EventName, string> = {
    landing_page_view: 'visitor',
    start_reading_click: 'visitor',
    question_submitted: 'reader',
    cards_selected: 'reader',
    reading_completed: 'engaged',
    reading_viewed: 'engaged',
    ginni_opened: 'engaged',
    ginni_message_sent: 'engaged',
    booking_page_visit: 'intent',
    booking_click: 'intent',
    booking_submitted: 'conversion',
    payment_started: 'conversion',
    payment_completed: 'revenue',
    session_start: 'visitor',
    session_end: 'visitor',
    error_occurred: 'error',
  };
  return stages[eventName] || 'unknown';
}

export function buildTrackingMetadata(data: {
  question?: string;
  cards?: string[];
  spreadType?: string;
  page?: string;
  error?: string;
}): Record<string, unknown> {
  return {
    ...data,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
  };
}