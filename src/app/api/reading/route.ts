import { NextResponse } from 'next/server';
import { selectRandomCards } from '@/lib/tarot';
import { generateReading } from '@/lib/ai';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { updateUserMemory, getUserMemory, buildMemoryContext } from '@/lib/ai/memory';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, userId } = body;

    if (!question || question.length < 3) {
      return NextResponse.json(
        { error: 'Please ask a question to receive guidance from the cards.' },
        { status: 400 }
      );
    }

    // Fetch user memory if available
    let memoryContext = '';
    if (userId && isSupabaseConfigured()) {
      const memory = await getUserMemory(userId);
      memoryContext = buildMemoryContext(memory);
    }

    // Select 3 random cards
    const selectedCards = selectRandomCards(3);
    
    // Generate AI reading with memory context
    const result = await generateReading(question, selectedCards, memoryContext);

    // Save to database if configured
    if (userId && isSupabaseConfigured()) {
      try {
        // Create reading record
        const { data: reading, error: readingError } = await supabase
          .from('readings')
          .insert({
            user_id: userId,
            question: question,
            spread_type: '3-card',
          })
          .select('id')
          .single();

        if (!readingError && reading) {
          // Insert cards
          const cardsData = selectedCards.map(sc => ({
            reading_id: reading.id,
            card_name: sc.card.name,
            position: sc.position,
            is_reversed: false,
          }));
          
          await supabase
            .from('cards_drawn')
            .insert(cardsData);

          // Insert AI response
          await supabase
            .from('ai_responses')
            .insert({
              reading_id: reading.id,
              response: result.interpretation,
            });

          // Update user memory
          await updateUserMemory(
            userId, 
            question, 
            result.interpretation,
            selectedCards.map(sc => ({ card_name: sc.card.name }))
          );
        }
      } catch (dbError) {
        console.error('[DB Save Error]', dbError);
      }
    }

    return NextResponse.json({
      cards: result.cards,
      interpretation: result.interpretation,
      timestamp: new Date().toISOString(),
      savedToHistory: isSupabaseConfigured() && !!userId,
    });

  } catch (error) {
    console.error('Reading generation error:', error);
    return NextResponse.json(
      { error: 'The cards are having difficulty connecting. Please try again.' },
      { status: 500 }
    );
  }
}