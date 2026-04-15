import Twilio from 'twilio';

export interface SendWhatsAppMessageParams {
  phone: string;
  message: string;
  userId: string;
  type: string;
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  userId: string;
  timestamp: Date;
  status: string;
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const isConfigured = accountSid && authToken && whatsappNumber;

let twilioClient: Twilio.Twilio | null = null;

if (isConfigured) {
  twilioClient = Twilio(accountSid, authToken);
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('0')) {
    return cleaned.substring(1);
  }
  
  if (!cleaned.startsWith('1') && cleaned.length === 10) {
    return `1${cleaned}`;
  }
  
  if (!cleaned.startsWith('+')) {
    return `+${cleaned}`;
  }
  
  return cleaned;
}

export async function sendWhatsAppMessage(
  params: SendWhatsAppMessageParams
): Promise<SendResult> {
  const { phone, message, userId, type } = params;
  
  if (!isConfigured || !twilioClient) {
    console.log('[WhatsApp Mock] Sending message:', {
      to: phone,
      message: message.substring(0, 50) + '...',
      userId,
      type
    });
    
    return {
      success: true,
      messageId: `mock_${Date.now()}`,
      userId,
      timestamp: new Date(),
      status: 'mock_sent'
    };
  }

  const formattedPhone = formatPhoneNumber(phone);

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: whatsappNumber,
      to: formattedPhone,
      statusCallback: process.env.TWILIO_STATUS_CALLBACK_URL
    });

    console.log('[WhatsApp] Message sent:', {
      sid: result.sid,
      status: result.status,
      to: formattedPhone,
      userId
    });

    return {
      success: true,
      messageId: result.sid,
      userId,
      timestamp: new Date(),
      status: result.status
    };
  } catch (error) {
    console.error('[WhatsApp] Send error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
      timestamp: new Date(),
      status: 'failed'
    };
  }
}

export async function sendBulkWhatsAppMessages(
  messages: SendWhatsAppMessageParams[]
): Promise<{
  total: number;
  successful: number;
  failed: number;
  results: SendResult[];
}> {
  const results: SendResult[] = [];
  let successful = 0;
  let failed = 0;

  for (const msg of messages) {
    const result = await sendWhatsAppMessage(msg);
    results.push(result);
    
    if (result.success) {
      successful++;
    } else {
      failed++;
    }
  }

  return {
    total: messages.length,
    successful,
    failed,
    results
  };
}

export async function logWhatsAppMessage(
  supabase: any,
  params: {
    userId: string;
    message: string;
    type: string;
    status: string;
    twilioMessageId?: string;
    errorMessage?: string;
  }
) {
  if (!supabase) {
    console.log('[WhatsApp] Log (mock):', params);
    return;
  }

  try {
    const { data, error } = await supabase
      .from('whatsapp_logs')
      .insert({
        user_id: params.userId,
        message: params.message,
        type: params.type,
        status: params.status,
        twilio_message_id: params.twilioMessageId,
        error_message: params.errorMessage
      })
      .select()
      .single();

    if (error) {
      console.error('[WhatsApp] Log error:', error);
    }

    return data;
  } catch (err) {
    console.error('[WhatsApp] Log exception:', err);
  }
}

export async function updateMessageStatus(
  supabase: any,
  messageId: string,
  status: 'sent' | 'delivered' | 'read' | 'failed',
  errorMessage?: string
) {
  if (!supabase) return;

  const updateFields: Record<string, any> = {
    status
  };

  if (status === 'delivered') {
    updateFields.delivered_at = new Date().toISOString();
  } else if (status === 'read') {
    updateFields.read_at = new Date().toISOString();
  } else if (status === 'failed') {
    updateFields.error_message = errorMessage;
  }

  try {
    await supabase
      .from('whatsapp_logs')
      .update(updateFields)
      .eq('twilio_message_id', messageId);
  } catch (err) {
    console.error('[WhatsApp] Status update error:', err);
  }
}

export function isWhatsAppConfigured(): boolean {
  return !!isConfigured;
}
