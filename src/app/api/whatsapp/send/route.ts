import { NextResponse } from 'next/server';
import { getMessageForSegment, MessageType, UserProfile } from '@/lib/whatsapp-messages';

interface SendMessageRequest {
  phone: string;
  userId: string;
  type: MessageType;
}

export async function POST(request: Request) {
  try {
    const body: SendMessageRequest = await request.json();
    const { phone, userId, type } = body;

    if (!phone || !userId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: phone, userId, type' },
        { status: 400 }
      );
    }

    const mockUser: UserProfile = {
      id: userId,
      phone,
      segment: 'active',
      lastActiveAt: new Date(),
      sessionCount: 2,
      readingCount: 2,
      bookingIntent: false,
      createdAt: new Date()
    };

    const { message, cta } = getMessageForSegment(mockUser.segment, type);

    const whatsappMessage = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: 'divine_tarot_message',
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: message }
            ]
          },
          ...(cta ? [{
            type: 'button',
            sub_type: 'url',
            parameters: [
              { type: 'text', text: cta }
            ]
          }] : [])
        ]
      }
    };

    console.log('WhatsApp message prepared:', whatsappMessage);

    return NextResponse.json({
      success: true,
      message: message,
      cta: cta,
      whatsappPayload: whatsappMessage
    });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}