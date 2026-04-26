import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { streamReading } from '@/lib/ai/streaming';
import { updateUserMemory } from '@/lib/ai/memory';
import type { SelectedCard } from '@/lib/tarot/logic';

// Helper to send SSE event
function sseEncode(type: string, data: any): string {
  return `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return new Response(
      sseEncode('error', { error: 'jobId is required' }),
      { status: 400, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  // Fetch job
  const { data: job, error: jobError } = await supabase
    .from('reading_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (jobError || !job) {
    return new Response(
      sseEncode('error', { error: 'Job not found' }),
      { status: 404, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  // Authorization: ensure job belongs to this user (if logged in)
  if (userId && job.user_id && job.user_id !== userId) {
    return new Response(
      sseEncode('error', { error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  // Prepare stream
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // If job already completed, stream cached result immediately
        if (job.status === 'completed' && job.result) {
          try {
            const result = JSON.parse(job.result);
            // Send cards
            controller.enqueue(encoder.encode(sseEncode('cards', result.cards)));
            // Send content line by line? result.reading is full text. We'll stream by sentences to mimic live.
            const sentences = (result.reading || '').split(/(?<=[.!?])\s+/g);
            for (const sentence of sentences) {
              if (sentence.trim()) {
                controller.enqueue(encoder.encode(sseEncode('content', sentence + ' ')));
                await new Promise(r => setTimeout(r, 30));
              }
            }
            controller.enqueue(encoder.encode(sseEncode('done', {})));
            controller.close();
            return;
          } catch (e) {
            // fall through to regenerate
          }
        }

        // If job is failed, send error
        if (job.status === 'failed') {
          controller.enqueue(encoder.encode(sseEncode('error', { error: job.error || 'Reading failed' })));
          controller.close();
          return;
        }

        // If job is pending or processing, try to claim it (if pending)
        let isProcessor = false;
        if (job.status === 'pending') {
          const { error: updateError } = await supabase
            .from('reading_jobs')
            .update({ status: 'processing', updated_at: new Date().toISOString() })
            .eq('id', jobId)
            .eq('status', 'pending');
          
          if (!updateError) {
            isProcessor = true;
          }
        } else if (job.status === 'processing') {
          // If already processing by someone else, we wait for completion
          isProcessor = false;
        }

        if (isProcessor) {
          // This instance will process the reading
          const { question, selected_cards, language, name, topic } = job;

          // Convert stored selected_cards (should already be array with card objects)
          const cards: SelectedCard[] = selected_cards as SelectedCard[];

          // Build memory context if user
          let memoryContext = '';
          let historySummary = '';
          if (userId) {
            try {
              const { getUserMemory, buildMemoryContext } = await import('@/lib/ai/memory');
              const memory = await getUserMemory(userId);
              if (memory) {
                memoryContext = buildMemoryContext(memory);
              }
              const { data: recentReadings } = await supabase
                .from('readings')
                .select('question, topic, created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(5);
              if (recentReadings) {
                const summaries = recentReadings.map(r => `${r.topic}: ${r.question}`).join('; ');
                historySummary = summaries;
              }
            } catch (e) {
              console.error('[Memory fetch error]', e);
            }
          }

          // Stream reading
          let fullContent = '';
          try {
            for await (const event of streamReading({
              question,
              selectedCards: cards,
              language: language || 'en',
              name: name || undefined,
              topic,
              memoryContext,
              historySummary,
            })) {
              if (event.type === 'cards') {
                controller.enqueue(encoder.encode(sseEncode('cards', event.data)));
              } else if (event.type === 'content') {
                fullContent += event.data;
                controller.enqueue(encoder.encode(sseEncode('content', event.data)));
              } else if (event.type === 'done') {
                controller.enqueue(encoder.encode(sseEncode('done', {})));
                // Save result to job
                const resultPayload = {
                  reading: fullContent,
                  cards,
                  language,
                  name,
                  topic,
                  question,
                  timestamp: new Date().toISOString(),
                };
                await supabase
                  .from('reading_jobs')
                  .update({
                    status: 'completed',
                    result: JSON.stringify(resultPayload),
                    updated_at: new Date().toISOString(),
                  })
                  .eq('id', jobId);

                // Also create reading record in history if user exists
                if (userId) {
                  await saveReadingToHistory(supabase, userId, question, cards, topic || '', language || 'en', fullContent);
                  // Increment reading count after successful save
                  try {
                    const { data: user } = await supabase
                      .from('users')
                      .select('readings_today, last_reading_date')
                      .eq('id', userId)
                      .single();
                    
                    if (user) {
                      const today = new Date().toDateString();
                      const lastDate = user.last_reading_date 
                        ? new Date(user.last_reading_date).toDateString() 
                        : null;
                      
                      await supabase
                        .from('users')
                        .update({
                          readings_today: lastDate === today ? (user.readings_today || 0) + 1 : 1,
                          last_reading_date: new Date().toISOString(),
                        })
                        .eq('id', userId);
                    }
                  } catch (e) {
                    console.error('[Increment count error]', e);
                  }
                }
                break;
              } else if (event.type === 'error') {
                controller.enqueue(encoder.encode(sseEncode('error', event.data)));
                await supabase
                  .from('reading_jobs')
                  .update({
                    status: 'failed',
                    error: event.data?.error || 'Unknown error',
                    updated_at: new Date().toISOString(),
                  })
                  .eq('id', jobId);
                break;
              }
            }
          } catch (err: any) {
            console.error('[Processing Error]', err);
            controller.enqueue(encoder.encode(sseEncode('error', { error: err.message || 'Processing failed' })));
            await supabase
              .from('reading_jobs')
              .update({
                status: 'failed',
                error: err.message,
                updated_at: new Date().toISOString(),
              })
              .eq('id', jobId);
          }
        } else {
          // Not the processor; wait for job to complete by polling
          let attempts = 0;
          const maxAttempts = 60; // 30 seconds max wait
          const interval = setInterval(async () => {
            const { data: updatedJob } = await supabase
              .from('reading_jobs')
              .select('status, result, error')
              .eq('id', jobId)
              .single();

            if (!updatedJob) {
              clearInterval(interval);
              return;
            }

            if (updatedJob.status === 'completed' && updatedJob.result) {
              clearInterval(interval);
              try {
                const result = JSON.parse(updatedJob.result);
                controller.enqueue(encoder.encode(sseEncode('cards', result.cards)));
                const sentences = (result.reading || '').split(/(?<=[.!?])\s+/g);
                for (const sentence of sentences) {
                  if (sentence.trim()) {
                    controller.enqueue(encoder.encode(sseEncode('content', sentence + ' ')));
                  }
                }
                controller.enqueue(encoder.encode(sseEncode('done', {})));
                controller.close();
              } catch (e) {
                controller.enqueue(encoder.encode(sseEncode('error', { error: 'Failed to parse result' })));
                controller.close();
              }
            } else if (updatedJob.status === 'failed') {
              clearInterval(interval);
              controller.enqueue(encoder.encode(sseEncode('error', { error: updatedJob.error || 'Failed' })));
              controller.close();
            } else if (++attempts >= maxAttempts) {
              clearInterval(interval);
              controller.enqueue(encoder.encode(sseEncode('error', { error: 'Reading timed out' })));
              controller.close();
            }
            // else continue polling
          }, 500);
        }
      } catch (err: any) {
        console.error('[Stream Error]', err);
        controller.enqueue(encoder.encode(sseEncode('error', { error: err.message || 'Stream failed' })));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Optional: keep POST for backward compatibility but redirect to start endpoint? We'll implement POST to start job internally if someone uses it directly.
export async function POST(request: NextRequest) {
  // Legacy: treat as start? But we already have /start. We'll just reject with instruction.
  return NextResponse.json(
    { error: 'Use /api/reading/start to begin a reading, then connect to this endpoint with the jobId' },
    { status: 400 }
  );
}

async function saveReadingToHistory(
  supabase: any,
  userId: string,
  question: string,
  cards: SelectedCard[],
  topic: string,
  language: string,
  interpretation: string
) {
  try {
    const { data: reading, error: readingError } = await supabase
      .from('readings')
      .insert({
        user_id: userId,
        question,
        spread_type: '3-card',
        topic,
        language,
      })
      .select('id')
      .single();

    if (readingError || !reading) {
      console.error('[History Save Error]', readingError);
      return;
    }

    const cardsData = cards.map(sc => ({
      reading_id: reading.id,
      card_name: sc.card.name,
      position: sc.position,
      is_reversed: sc.isReversed || false,
    }));

    await supabase.from('cards_drawn').insert(cardsData);
    await supabase.from('ai_responses').insert({
      reading_id: reading.id,
      response: interpretation,
    });
  } catch (e) {
    console.error('[History Save Exception]', e);
  }
}
