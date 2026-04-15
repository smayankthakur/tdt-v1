import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

interface TwilioStatusCallback {
  MessageSid: string;
  MessageStatus: string;
  To: string;
  From: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const payload: TwilioStatusCallback = {
      MessageSid: formData.get('MessageSid') as string || '',
      MessageStatus: formData.get('MessageStatus') as string || '',
      To: formData.get('To') as string || '',
      From: formData.get('From') as string || '',
      ErrorCode: formData.get('ErrorCode') as string | undefined,
      ErrorMessage: formData.get('ErrorMessage') as string | undefined
    };

    console.log('[Webhook] Twilio status callback:', payload);

    const supabase = await createServerClient();

    if (!supabase) {
      console.log('[Webhook] No Supabase client, logging only');
      return NextResponse.json({ received: true });
    }

    const statusMap: Record<string, string> = {
      'queued': 'pending',
      'sent': 'sent',
      'delivered': 'delivered',
      'read': 'read',
      'failed': 'failed',
      'undelivered': 'failed'
    };

    const newStatus = statusMap[payload.MessageStatus] || 'pending';

    const updateFields: Record<string, any> = {
      status: newStatus
    };

    if (newStatus === 'delivered') {
      updateFields.delivered_at = new Date().toISOString();
    } else if (newStatus === 'read') {
      updateFields.read_at = new Date().toISOString();
    } else if (newStatus === 'failed') {
      updateFields.error_message = payload.ErrorMessage || 'Delivery failed';
    }

    const { error } = await supabase
      .from('whatsapp_logs')
      .update(updateFields)
      .eq('twilio_message_id', payload.MessageSid);

    if (error) {
      console.error('[Webhook] Update error:', error);
      return NextResponse.json({ error: 'Failed to update message status' }, { status: 500 });
    }

    console.log(`[Webhook] Updated message ${payload.MessageSid} to ${newStatus}`);

    return NextResponse.json({ received: true, status: newStatus });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'WhatsApp Webhook',
    version: '1.0.0',
    status: 'ready',
    events: ['message_sent', 'message_delivered', 'message_read', 'message_failed'],
    description: 'Receives delivery status callbacks from Twilio'
  });
}
