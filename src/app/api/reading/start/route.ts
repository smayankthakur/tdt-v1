import { NextResponse } from 'next/server';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { checkReadingAccess } from '@/lib/payments/access-control';

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // For development/anonymous, allow without auth but limit via client-side store
    // In production with Supabase, enforce paywall
    const userId = user?.id;

    // Validate access (paywall) if user is logged in and Supabase is configured
    if (userId && isSupabaseConfigured()) {
      const access = await checkReadingAccess(userId);
      if (!access.allowed) {
        return NextResponse.json(
          { error: access.upgradePrompt || 'Daily reading limit exceeded', upgrade: true },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { question, selectedCards, language = 'en', name, topic } = body;

    if (!question || question.length < 3) {
      return NextResponse.json(
        { error: 'Please ask a question to receive guidance from the cards.' },
        { status: 400 }
      );
    }

    if (!selectedCards || !Array.isArray(selectedCards) || selectedCards.length < 3) {
      return NextResponse.json(
        { error: 'Please select at least 3 cards.' },
        { status: 400 }
      );
    }

    // Create job record
    const jobId = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour

    const { error: insertError } = await supabase
      .from('reading_jobs')
      .insert({
        id: jobId,
        user_id: userId,
        status: 'pending',
        question,
        selected_cards: selectedCards,
        language: language,
        name: name || null,
        topic: topic || null,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error('[Job Create Error]', insertError);
      return NextResponse.json(
        { error: 'Failed to create reading job' },
        { status: 500 }
      );
    }

    // Return immediately with jobId
    return NextResponse.json({
      jobId,
      status: 'processing',
      message: 'Reading is being prepared',
    });
  } catch (error) {
    console.error('[ReadingStart] Error:', error);
    return NextResponse.json(
      { error: 'The cards are having difficulty connecting. Please try again.' },
      { status: 500 }
    );
  }
}
