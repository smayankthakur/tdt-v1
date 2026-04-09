import { MessageDecision } from './tarot-agent';

export interface WhatsAppMessagePayload {
  messaging_product: string;
  to: string;
  type: string;
  template?: {
    name: string;
    language: { code: string };
    components: any[];
  };
  text?: {
    body: string;
  };
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  userId: string;
  timestamp: Date;
}

const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

export async function sendWhatsAppMessage(
  phoneNumber: string,
  decision: MessageDecision,
  userId: string
): Promise<SendResult> {
  const templateName = 'divine_tarot_message';
  
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.log('WhatsApp not configured - mock send:', {
      to: phoneNumber,
      message: decision.message,
      cta: decision.cta,
      type: decision.type
    });
    
    return {
      success: true,
      messageId: `mock_${Date.now()}`,
      userId,
      timestamp: new Date()
    };
  }

  const template: WhatsAppMessagePayload['template'] = {
    name: templateName,
    language: { code: 'en' },
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: decision.message }
        ]
      }
    ]
  };

  if (decision.cta && template.components) {
    template.components.push({
      type: 'button',
      sub_type: 'url',
      index: '0',
      parameters: [
        { type: 'text', text: decision.cta }
      ]
    });
  }

  const payload: WhatsAppMessagePayload = {
    messaging_product: 'whatsapp',
    to: phoneNumber,
    type: 'template',
    template
  };

  try {
    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('WhatsApp API error:', responseData);
      return {
        success: false,
        error: responseData.error?.message || 'Failed to send message',
        userId,
        timestamp: new Date()
      };
    }

    return {
      success: true,
      messageId: responseData.messages?.[0]?.id,
      userId,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
      timestamp: new Date()
    };
  }
}

export async function sendBulkMessages(
  messages: Array<{ phoneNumber: string; userId: string; decision: MessageDecision }>
): Promise<{
  total: number;
  successful: number;
  failed: number;
  results: SendResult[]
}> {
  const results: SendResult[] = [];
  let successful = 0;
  let failed = 0;

  for (const msg of messages) {
    const result = await sendWhatsAppMessage(msg.phoneNumber, msg.decision, msg.userId);
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

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('0')) {
    return cleaned.substring(1);
  }
  
  if (!cleaned.startsWith('1') && cleaned.length === 10) {
    return `1${cleaned}`;
  }
  
  return cleaned;
}

export async function logMessageSent(
  userId: string,
  messageType: string,
  messageText: string,
  success: boolean,
  messageId?: string
): Promise<void> {
  console.log('Message logged:', {
    userId,
    type: messageType,
    text: messageText,
    success,
    messageId,
    timestamp: new Date().toISOString()
  });
}