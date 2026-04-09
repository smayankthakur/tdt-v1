import { NextResponse } from 'next/server';
import { 
  getUsersNeedingDailyPull, 
  getUsersNeedingReactivation, 
  getUsersNeedingColdReactivation,
  getHighIntentUsers,
  determineMessageType
} from '@/lib/user-tracking';
import { getMessageForSegment, MessageType } from '@/lib/whatsapp-messages';

interface WhatsAppPayload {
  messaging_product: string;
  to: string;
  type: string;
  template: {
    name: string;
    language: { code: string };
    components: any[];
  };
}

async function sendWhatsAppMessage(phone: string, message: string, cta?: string): Promise<boolean> {
  const payload: WhatsAppPayload = {
    messaging_product: 'whatsapp',
    to: phone,
    type: 'template',
    template: {
      name: 'divine_tarot_message',
      language: { code: 'en' },
      components: [
        {
          type: 'body',
          parameters: [{ type: 'text', text: message }]
        }
      ]
    }
  };

  if (cta) {
    payload.template.components.push({
      type: 'button',
      sub_type: 'url',
      parameters: [{ type: 'text', text: cta }]
    });
  }

  const whatsappApiUrl = process.env.WHATSAPP_API_URL;
  const whatsappToken = process.env.WHATSAPP_TOKEN;

  if (!whatsappApiUrl || !whatsappToken) {
    console.log('WhatsApp not configured, mock send:', { phone, message, cta });
    return true;
  }

  try {
    const response = await fetch(whatsappApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    return false;
  }
}

export async function POST() {
  try {
    const results = {
      dailyPullSent: 0,
      reactivationSent: 0,
      coldReactivationSent: 0,
      conversionSent: 0,
      failed: 0
    };

    const dailyPullUsers = getUsersNeedingDailyPull();
    for (const user of dailyPullUsers) {
      if (user.phone) {
        const { message, cta } = getMessageForSegment(user.segment, 'daily-pull');
        const sent = await sendWhatsAppMessage(user.phone, message, cta);
        if (sent) results.dailyPullSent++;
        else results.failed++;
      }
    }

    const reactivationUsers = getUsersNeedingReactivation();
    for (const user of reactivationUsers) {
      if (user.phone) {
        const { message, cta } = getMessageForSegment(user.segment, 'reactivation');
        const sent = await sendWhatsAppMessage(user.phone, message, cta);
        if (sent) results.reactivationSent++;
        else results.failed++;
      }
    }

    const coldUsers = getUsersNeedingColdReactivation();
    for (const user of coldUsers) {
      if (user.phone) {
        const { message, cta } = getMessageForSegment(user.segment, 'cold-reactivation');
        const sent = await sendWhatsAppMessage(user.phone, message, cta);
        if (sent) results.coldReactivationSent++;
        else results.failed++;
      }
    }

    const highIntentUsers = getHighIntentUsers();
    for (const user of highIntentUsers) {
      if (user.phone) {
        const { message, cta } = getMessageForSegment(user.segment, 'conversion');
        const sent = await sendWhatsAppMessage(user.phone, message, cta);
        if (sent) results.conversionSent++;
        else results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });
  } catch (error) {
    console.error('Error processing scheduled messages:', error);
    return NextResponse.json(
      { error: 'Failed to process scheduled messages' },
      { status: 500 }
    );
  }
}