import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Missing required field: text' },
        { status: 400 }
      );
    }

    // Stub: return original text as translation
    return NextResponse.json({
      text,
      translation: text,
      source: 'fallback',
      note: 'Translation API not configured'
    });
  } catch (error) {
    console.error('[api/translate] Error:', error);
    return NextResponse.json(
      { error: 'Translation service unavailable' },
      { status: 500 }
    );
  }
}
