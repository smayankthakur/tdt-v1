import { createServerClient } from '@/lib/supabase/server';
import { sendWhatsAppMessage, logWhatsAppMessage } from '@/lib/whatsapp/sendMessage';
import { segmentUser, UserSegment, shouldSendDailyMessage, shouldSendReactivationMessage, shouldSendConversionMessage, getNextMessageType } from './segmentUser';
import { generateMessage, MessageType } from './generateMessage';

export interface AutomationUser {
  id: string;
  phone: string | null;
  lastActiveAt: string | null;
  readingsCount: number;
  bookingIntent: boolean;
  sessionCount: number;
  lastQuestion: string | null;
  lastReadingTopic: string | null;
  lastReadingEmotion: string | null;
  segment: string | null;
}

export interface AutomationResult {
  success: boolean;
  usersProcessed: number;
  messagesSent: number;
  errors: number;
  details: Array<{
    userId: string;
    phone: string;
    messageType: string;
    success: boolean;
    messageId?: string;
    error?: string;
  }>;
}

const MAX_MESSAGES_PER_DAY = 1;

async function getSupabaseClient() {
  try {
    return await createServerClient();
  } catch (error) {
    console.error('[Engine] Failed to create Supabase client:', error);
    return null;
  }
}

async function fetchUsersForAutomation(supabase: any, type: 'daily' | 'reactivation' | 'conversion' | 'all'): Promise<AutomationUser[]> {
  if (!supabase) {
    console.log('[Engine] No Supabase client, using mock data');
    return getMockUsers();
  }

  let query = supabase
    .from('users')
    .select('id, phone, last_active_at, readings_count, booking_intent, session_count, last_question, last_reading_topic, last_reading_emotion, segment')
    .not('phone', 'is', null)
    .neq('phone', '');

  const now = new Date();

  if (type === 'daily') {
    query = query.gte('last_active_at', new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString());
  } else if (type === 'reactivation') {
    query = query.lt('last_active_at', new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString());
    query = query.gt('last_active_at', new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString());
  } else if (type === 'conversion') {
    query = query.eq('booking_intent', true).or('readings_count.gte.2');
  }

  const { data, error } = await query;

  if (error) {
    console.error('[Engine] Fetch users error:', error);
    return [];
  }

  return data || [];
}

function getMockUsers(): AutomationUser[] {
  const now = new Date();
  
  return [
    {
      id: 'mock-user-001',
      phone: '+1234567890',
      lastActiveAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      readingsCount: 1,
      bookingIntent: false,
      sessionCount: 1,
      lastQuestion: 'Will my love life improve soon?',
      lastReadingTopic: 'love',
      lastReadingEmotion: 'hopeful',
      segment: 'NEW_USER'
    },
    {
      id: 'mock-user-002',
      phone: '+1234567891',
      lastActiveAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      readingsCount: 4,
      bookingIntent: true,
      sessionCount: 5,
      lastQuestion: 'Should I switch jobs?',
      lastReadingTopic: 'career',
      lastReadingEmotion: 'confused',
      segment: 'HIGH_INTENT'
    },
    {
      id: 'mock-user-003',
      phone: '+1234567892',
      lastActiveAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      readingsCount: 2,
      bookingIntent: false,
      sessionCount: 3,
      lastQuestion: 'Why do I feel stuck in life?',
      lastReadingTopic: 'growth',
      lastReadingEmotion: 'stuck',
      segment: 'INACTIVE_USER'
    },
    {
      id: 'mock-user-004',
      phone: '+1234567893',
      lastActiveAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      readingsCount: 1,
      bookingIntent: false,
      sessionCount: 2,
      lastQuestion: 'What does my future hold?',
      lastReadingTopic: 'general',
      lastReadingEmotion: 'neutral',
      segment: 'COLD_USER'
    }
  ];
}

async function checkRateLimit(supabase: any, userId: string): Promise<boolean> {
  if (!supabase) {
    return true;
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from('whatsapp_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('sent_at', todayStart.toISOString());

  if (error) {
    console.error('[Engine] Rate limit check error:', error);
    return true;
  }

  return (count || 0) < MAX_MESSAGES_PER_DAY;
}

async function checkDuplicateMessage(supabase: any, userId: string, messageType: string): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const recentHours = messageType === 'conversion' ? 72 : 24;

  const { count, error } = await supabase
    .from('whatsapp_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('type', messageType)
    .gte('sent_at', new Date(Date.now() - recentHours * 60 * 60 * 1000).toISOString());

  if (error) {
    return false;
  }

  return (count || 0) > 0;
}

async function updateUserSegment(supabase: any, userId: string, segment: UserSegment) {
  if (!supabase) return;

  try {
    await supabase
      .from('users')
      .update({ segment, updated_at: new Date().toISOString() })
      .eq('id', userId);
  } catch (error) {
    console.error('[Engine] Update segment error:', error);
  }
}

export async function runAutomation(type: 'daily' | 'reactivation' | 'conversion' | 'all' = 'all'): Promise<AutomationResult> {
  console.log(`[Engine] Starting automation: ${type}`);
  
  const supabase = await getSupabaseClient();
  const users = await fetchUsersForAutomation(supabase, type);
  
  console.log(`[Engine] Found ${users.length} users for ${type}`);

  const result: AutomationResult = {
    success: true,
    usersProcessed: 0,
    messagesSent: 0,
    errors: 0,
    details: []
  };

  for (const user of users) {
    if (!user.phone) {
      continue;
    }

    const canSend = await checkRateLimit(supabase, user.id);
    if (!canSend) {
      console.log(`[Engine] Rate limited: ${user.id}`);
      continue;
    }

    const userContext = {
      id: user.id,
      phone: user.phone,
      lastActiveAt: user.lastActiveAt,
      readingsCount: user.readingsCount,
      bookingIntent: user.bookingIntent,
      sessionCount: user.sessionCount,
      lastQuestion: user.lastQuestion || undefined,
      lastReadingTopic: user.lastReadingTopic || undefined,
      lastReadingEmotion: user.lastReadingEmotion || undefined
    };

    const segmentResult = segmentUser(userContext);
    const messageType = getNextMessageType(userContext) as MessageType;

    const hasDuplicate = await checkDuplicateMessage(supabase, user.id, messageType);
    if (hasDuplicate) {
      console.log(`[Engine] Duplicate message skipped: ${user.id} - ${messageType}`);
      continue;
    }

    let shouldTrigger = false;
    
    if (type === 'reactivation' || segmentResult.segment === 'INACTIVE_USER' || segmentResult.segment === 'COLD_USER') {
      shouldTrigger = shouldSendReactivationMessage(userContext);
    } else if (type === 'conversion' || segmentResult.segment === 'HIGH_INTENT') {
      shouldTrigger = shouldSendConversionMessage(userContext);
    } else if (type === 'daily') {
      shouldTrigger = shouldSendDailyMessage(userContext);
    } else if (type === 'all') {
      shouldTrigger = shouldSendConversionMessage(userContext) || 
                      shouldSendReactivationMessage(userContext) || 
                      shouldSendDailyMessage(userContext);
    }

    if (!shouldTrigger) {
      console.log(`[Engine] No trigger needed for ${user.id} (${segmentResult.segment})`);
      continue;
    }

    const generated = await generateMessage(messageType, userContext);
    
    const sendResult = await sendWhatsAppMessage({
      phone: user.phone,
      message: generated.message,
      userId: user.id,
      type: messageType
    });

    await logWhatsAppMessage(supabase, {
      userId: user.id,
      message: generated.message,
      type: messageType,
      status: sendResult.success ? 'sent' : 'failed',
      twilioMessageId: sendResult.messageId,
      errorMessage: sendResult.error
    });

    if (sendResult.success) {
      await updateUserSegment(supabase, user.id, segmentResult.segment);
    }

    result.usersProcessed++;
    
    if (sendResult.success) {
      result.messagesSent++;
    } else {
      result.errors++;
    }

    result.details.push({
      userId: user.id,
      phone: user.phone,
      messageType,
      success: sendResult.success,
      messageId: sendResult.messageId,
      error: sendResult.error
    });
  }

  console.log(`[Engine] Completed: ${result.messagesSent}/${result.usersProcessed} messages sent`);
  
  return result;
}

export async function triggerPostReadingMessage(userId: string): Promise<{ success: boolean; message?: string; error?: string }> {
  console.log(`[Engine] Triggering post-reading message for: ${userId}`);
  
  const supabase = await getSupabaseClient();
  
  if (!supabase) {
    return { success: false, error: 'No Supabase client' };
  }

  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return { success: false, error: 'User not found' };
    }

      const canSend = await checkRateLimit(supabase, userId);
      if (!canSend) {
        return { success: false, error: 'Rate limited' };
      }

      const userContext = {
        id: user.id,
        phone: user.phone,
        lastActiveAt: user.last_active_at,
        readingsCount: user.readings_count,
        bookingIntent: user.booking_intent,
        sessionCount: user.session_count,
        lastQuestion: user.last_question || undefined,
        lastReadingTopic: user.last_reading_topic || undefined,
        lastReadingEmotion: user.last_reading_emotion || undefined
      };

      const generated = await generateMessage('followup', userContext);
      
      const sendResult = await sendWhatsAppMessage({
        phone: user.phone,
        message: generated.message,
        userId: user.id,
        type: 'followup'
      });

      await logWhatsAppMessage(supabase, {
        userId: user.id,
        message: generated.message,
        type: 'followup',
        status: sendResult.success ? 'sent' : 'failed',
        twilioMessageId: sendResult.messageId,
        errorMessage: sendResult.error
      });

      return {
        success: sendResult.success,
        message: sendResult.success ? generated.message : undefined,
        error: sendResult.error
      };
    } catch (err) {
      console.error('[Engine] Post-reading trigger error:', err);
      return { success: false, error: 'Failed to trigger post-reading message' };
    }
}

export async function triggerBookingIntent(userId: string): Promise<{ success: boolean }> {
  console.log(`[Engine] Marking user ${userId} as booking intent`);
  
  const supabase = await getSupabaseClient();
  
  if (!supabase) {
    return { success: false };
  }

  try {
    await supabase
      .from('users')
      .update({ 
        booking_intent: true, 
        segment: 'HIGH_INTENT',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    return { success: true };
  } catch (error) {
    console.error('[Engine] Booking intent update error:', error);
    return { success: false };
  }
}

export async function updateUserActivity(userId: string, action: 'reading' | 'session' | 'booking'): Promise<void> {
  const supabase = await getSupabaseClient();
  
  if (!supabase) return;

  try {
    const { data: currentUser } = await supabase
      .from('users')
      .select('readings_count, session_count')
      .eq('id', userId)
      .single();

    if (!currentUser) return;

    const updates: Record<string, any> = {
      last_active_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (action === 'reading') {
      updates.readings_count = (currentUser.readings_count || 0) + 1;
      updates.session_count = (currentUser.session_count || 0) + 1;
    } else if (action === 'session') {
      updates.session_count = (currentUser.session_count || 0) + 1;
    } else if (action === 'booking') {
      updates.booking_intent = true;
    }

    await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
  } catch (error) {
    console.error('[Engine] Activity update error:', error);
  }
}
