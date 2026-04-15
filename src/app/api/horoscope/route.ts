import { NextResponse } from 'next/server';
import { 
  generateHoroscope, 
  generateAllDailyHoroscopes, 
  HoroscopeContent,
  ZodiacSign,
  HoroscopeType
} from '@/lib/horoscope/engine';
import { ZODIAC_SIGNS } from '@/lib/blog/seo-strategy';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, sign, type } = body;

    if (action === 'generate-one') {
      if (!sign) {
        return NextResponse.json({ error: 'sign required' }, { status: 400 });
      }

      const horoscope = await generateHoroscope(sign as ZodiacSign, type as HoroscopeType);

      return NextResponse.json({
        action: 'generate-one',
        timestamp: new Date().toISOString(),
        horoscope
      });
    }

    if (action === 'generate-all-daily') {
      const horoscopes = await generateAllDailyHoroscopes();

      return NextResponse.json({
        action: 'generate-all-daily',
        timestamp: new Date().toISOString(),
        count: horoscopes.length,
        horoscopes
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('[Horoscope API] Error:', error);
    return NextResponse.json({ error: 'Horoscope generation failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Horoscope API',
    version: '1.0.0',
    status: 'ready',
    actions: {
      'generate-one': 'Generate single horoscope (sign, type)',
      'generate-all-daily': 'Generate all 12 zodiac signs for today',
    },
    supportedSigns: ZODIAC_SIGNS,
    supportedTypes: ['daily', 'weekly', 'monthly', 'love', 'career'],
    example: {
      action: 'generate-one',
      sign: 'Aries',
      type: 'daily'
    }
  });
}