import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { pickCards, formatCardsForAI, SelectedCard, CardHistory } from '@/lib/tarot/logic';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { updateUserMemory, getUserMemory, buildMemoryContext } from '@/lib/ai/memory';

let _openai: OpenAI | undefined;

function getOpenAI() {
  if (!_openai) {
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY');
    }
    _openai = new OpenAI({ apiKey });
  }
  return _openai;
}

const HUMAN_TAROT_SYSTEM_PROMPT = `You are an intuitive tarot reader. You speak like a real human psychic. Your tone is emotional, slightly mystical, but grounded and actionable. You connect deeply with the user's situation and never sound robotic.

RULES:
- Use "you" language - speak directly to the user
- Reference emotions and feelings
- Never start with "Based on the cards" or "The cards indicate"
- Use phrases like "I'm sensing...", "Your energy shows...", "This isn't random..."
- Give practical advice mixed with spiritual insight
- Keep responses between 150-250 words
- End with subtle curiosity or encouragement
- Make it feel personal, not generic`;

const LANGUAGE_PROMPTS: Record<string, string> = {
  en: `${HUMAN_TAROT_SYSTEM_PROMPT} Write in elegant, warm English.`,
  hi: `${HUMAN_TAROT_SYSTEM_PROMPT} Write in natural, beautiful Hindi.`,
  hinglish: `${HUMAN_TAROT_SYSTEM_PROMPT} Write in conversational Hinglish - mix of Hindi and English, WhatsApp style, keep it real and personal.`,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, userId, language = 'en', topic, selectedCards: providedCards } = body;

    if (!question || question.length < 3) {
      return NextResponse.json(
        { error: 'Please ask a question to receive guidance from the cards.' },
        { status: 400 }
      );
    }

    // Fetch user memory and history if available
    let memoryContext = '';
    const cardHistory: CardHistory[] = [];
    if (userId && isSupabaseConfigured()) {
      try {
        const memory = await getUserMemory(userId);
        memoryContext = buildMemoryContext(memory);
        
        // Fetch recent readings for repetition control
        const { data: recentReadings } = await supabase
          .from('readings')
          .select('id, question, topic, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (recentReadings) {
          // Get cards for each reading
          for (const reading of recentReadings) {
            const { data: cards } = await supabase
              .from('cards_drawn')
              .select('card_name')
              .eq('reading_id', reading.id);
            
            cardHistory.push({
              cards: cards?.map(c => c.card_name) || [],
              topic: reading.topic,
              question: reading.question,
              createdAt: new Date(reading.created_at)
            });
          }
        }
      } catch (memError) {
        console.error('[Memory Fetch Error]', memError);
      }
    }

    // Use provided cards or select with smart weighting
    const selectedCards = providedCards?.length >= 3 
      ? providedCards 
      : pickCards({
          userId,
          topic,
          question,
          history: cardHistory,
          count: 3
        });
    
    const cardsFormatted = formatCardsForAI(selectedCards);
    
    // Build the prompt with memory context
    const topicSection = topic ? `\nTopic focus: ${topic}` : '';
    const userPrompt = `Question: ${question}
Cards: ${cardsFormatted}${topicSection}
${memoryContext ? `\nUser context: ${memoryContext}` : ''}

Give a personal, emotionally connected reading that makes the user feel truly seen.`;

    const systemPrompt = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS.en;

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const openai = getOpenAI();
          
          const streamResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.8,
            max_tokens: 400,
            stream: true,
          });

          // Send cards first
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'cards', cards: selectedCards })}\n\n`));

          // Stream the response
          for await (const chunk of streamResponse) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', content })}\n\n`));
            }
          }

          // Signal completion
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();

          // Save to database after streaming (fire and forget)
          if (userId && isSupabaseConfigured()) {
            saveReadingAsync(userId, question, selectedCards, 'streaming', language).catch(err => {
              console.error('[Async Save Error]', err);
            });
          }

        } catch (error) {
          console.error('[Streaming Error]', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'The energy is unclear. Please try again.' })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Reading generation error:', error);
    return NextResponse.json(
      { error: 'The cards are having difficulty connecting. Please try again.' },
      { status: 500 }
    );
  }
}

async function saveReadingAsync(
  userId: string,
  question: string,
  cards: SelectedCard[],
  interpretation: string,
  language: string
) {
  try {
    // Create reading record
    const { data: reading, error: readingError } = await supabase
      .from('readings')
      .insert({
        user_id: userId,
        question: question,
        spread_type: '3-card',
        language: language,
      })
      .select('id')
      .single();

    if (readingError || !reading) {
      console.error('[DB Reading Error]', readingError);
      return;
    }

    // Insert cards
    const cardsData = cards.map(sc => ({
      reading_id: reading.id,
      card_name: sc.card.name,
      position: sc.position,
      is_reversed: sc.isReversed || false,
    }));
    
    await supabase
      .from('cards_drawn')
      .insert(cardsData);

    // Insert AI response
    await supabase
      .from('ai_responses')
      .insert({
        reading_id: reading.id,
        response: interpretation,
      });

    // Update user memory
    await updateUserMemory(
      userId, 
      question, 
      interpretation,
      cards.map(sc => ({ card_name: sc.card.name }))
    );

    console.log('[Reading Saved]', reading.id);
  } catch (dbError) {
    console.error('[DB Save Error]', dbError);
  }
}
