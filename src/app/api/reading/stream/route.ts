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

// Emotion extraction patterns
const EMOTION_PATTERNS: Record<string, string[]> = {
  anxious: ['worried', 'stress', 'nervous', 'uncertain', 'afraid', 'fear', 'scared'],
  hopeful: ['hope', 'wish', 'best', 'positive', 'good', 'better', 'dream', 'want'],
  confused: ['confused', 'don\'t know', 'uncertain', 'lost', 'direction', 'what should'],
  heartbroken: ['hurt', 'pain', 'broken', 'miss', 'love', 'heart', 'sad', 'grief'],
  stuck: ['stuck', 'can\'t', 'blocked', 'same', 'repetitive', 'going in circles'],
  determined: ['will', 'must', 'need to', 'going to', 'try', 'fight', '努力'],
};

const TOPIC_PATTERNS: Record<string, string[]> = {
  love: ['love', 'relationship', 'partner', 'dating', 'marriage', 'crush', 'heart', 'romance', 'boyfriend', 'girlfriend', 'ex', 'no contact', 'together'],
  career: ['career', 'job', 'work', 'boss', 'colleague', 'promotion', 'salary', 'unemployed', 'business', 'professional'],
  finance: ['money', 'financial', 'rich', 'debt', 'invest', 'income', 'lottery', 'wealth', 'prosperity', 'financial'],
  no_contact: ['no contact', 'hasn\'t reached', 'not talking', 'silence', 'blocked', 'ghosting', 'waiting'],
};

function extractEmotion(text: string): string {
  const lower = text.toLowerCase();
  for (const [emotion, patterns] of Object.entries(EMOTION_PATTERNS)) {
    for (const pattern of patterns) {
      if (lower.includes(pattern)) return emotion;
    }
  }
  return 'neutral';
}

function extractTopic(text: string): string {
  const lower = text.toLowerCase();
  for (const [topic, patterns] of Object.entries(TOPIC_PATTERNS)) {
    for (const pattern of patterns) {
      if (lower.includes(pattern)) return topic;
    }
  }
  return 'general';
}

function summarizeHistory(history: CardHistory[]): string {
  if (!history.length) return '';
  
  const topics = Array.from(new Set(history.map(h => h.topic).filter(Boolean)));
  const emotions = history.map(h => extractEmotion(h.question || '')).filter(e => e !== 'neutral');
  const recentQuestions = history.slice(0, 3).map(h => h.question).filter(Boolean);
  
  let summary = '';
  
  if (topics.length > 0) {
    summary += `Recent themes: ${topics.join(', ')}. `;
  }
  
  if (emotions.length > 0) {
    const dominantEmotion = emotions.sort((a, b) =>
      emotions.filter(v => v === a).length - emotions.filter(v => v === b).length
    ).pop();
    if (dominantEmotion && dominantEmotion !== 'neutral') {
      summary += `Emotional pattern: feeling ${dominantEmotion}. `;
    }
  }
  
  if (recentQuestions.length > 1) {
    summary += `Questions asked: "${recentQuestions[0]}", "${recentQuestions[1]}". `;
  }
  
  return summary;
}

const ILLUSION_LINES = [
  "This isn't random...",
  "Your energy is very clear here...",
  "This came through strongly...",
  "I sense something significant...",
  "There's a pattern emerging...",
];

const EMOTIONAL_OPENERS = [
  "I can sense the weight of this question on your mind...",
  "There's an emotional current running through this...",
  "I feel the uncertainty you're carrying...",
  "This situation has been on your mind more than you admit...",
  "There's something you need to hear...",
];

const HUMAN_TAROT_SYSTEM_PROMPT = `You are an intuitive tarot reader with decades of experience. You speak like a wise, compassionate human psychic - not an AI. Your readings feel personal, emotional, and deeply connected to the querent's actual situation.

VOICE & TONE:
- Use first-person: "I'm sensing...", "I feel...", "There's something here..."
- Speak directly to "you"
- Be warm but authoritative
- Mix spiritual insight with practical wisdom
- Never sound robotic or academic

CRITICAL: You MUST use the card data provided. Each card has keywords, emotions, and meanings. Reference them specifically.

RESPONSE STRUCTURE (MUST FOLLOW):
1. EMOTIONAL HOOK (2-3 sentences)
   Acknowledge their feeling based on the question and selected cards
   Example: "I can sense the weight of this question on your mind. The cards you've drawn reflect exactly what you're going through..."

2. CARD-BY-CARD (for each of 3 cards):
   For EACH card, you MUST:
   - Name the card and its position (Past/Present/Future)
   - Connect the card's keywords and emotions to the user's situation
   - Reference the upright or reversed meaning as it applies
   - Make it personal to their question
   
   Example: "The Three of Swords in your Past speaks directly to the heartbreak you're still carrying. Its keywords are heartbreak, pain, grief - and I feel this pain strongly in your question about whether they'll come back..."

3. COMBINED INSIGHT (2-3 sentences)
   Weave all three cards together. Show how they collectively answer their specific question.
   Connect Past → Present → Future narrative.

4. GUIDANCE (2-3 sentences)
   What should they do? What's coming next? What action or mindset is needed?

5. SOFT CLOSING (1-2 sentences)
   End with gentle hope or curiosity. Leave them feeling seen.

IMPORTANT RULES:
- NEVER start with "Based on the cards" or "The cards indicate"
- NEVER use numbered lists or bullet points
- NEVER explain tarot theory
- MUST reference: card name, position, specific keywords, emotions from the card data
- Connect EVERY card to the user's specific question
- NEVER exceed 300 words total
- Use natural paragraphs, no headings`;

const LANGUAGE_PROMPTS: Record<string, string> = {
  en: HUMAN_TAROT_SYSTEM_PROMPT,
  hi: `${HUMAN_TAROT_SYSTEM_PROMPT} Write in natural, beautiful Hindi with emotional depth.`,
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

    // Extract emotion and topic from question
    const extractedEmotion = extractEmotion(question);
    const extractedTopic = extractTopic(question);
    const finalTopic = topic || extractedTopic;

    // Fetch user memory and history
    let memoryContext = '';
    const cardHistory: CardHistory[] = [];
    
    if (userId && isSupabaseConfigured()) {
      try {
        const memory = await getUserMemory(userId);
        memoryContext = buildMemoryContext(memory);
        
        const { data: recentReadings } = await supabase
          .from('readings')
          .select('id, question, topic, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (recentReadings) {
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

    // Get or select cards
    const selectedCards = providedCards?.length >= 3 
      ? providedCards 
      : pickCards({
          userId,
          topic: finalTopic,
          question,
          history: cardHistory,
          count: 3
        });
    
    const cardsFormatted = formatCardsForAI(selectedCards);
    const historySummary = summarizeHistory(cardHistory);
    
    // Pick random illusion line
    const illusionLine = ILLUSION_LINES[Math.floor(Math.random() * ILLUSION_LINES.length)];
    const emotionalOpener = EMOTIONAL_OPENERS[Math.floor(Math.random() * EMOTIONAL_OPENERS.length)];

    // Build enhanced prompt
    const topicSection = finalTopic ? `\nTopic: ${finalTopic}` : '';
    const emotionSection = extractedEmotion !== 'neutral' 
      ? `\nUser is feeling: ${extractedEmotion}` 
      : '';
    const historySection = historySummary 
      ? `\nRecent context: ${historySummary}` 
      : '';
    
    const userPrompt = `${emotionalOpener}

Question: "${question}"
${topicSection}
${emotionSection}
Cards drawn: ${cardsFormatted}
${memoryContext}
${historySection}

${illusionLine}

Give a deeply personal reading following the structure above.`;

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
            temperature: 0.7,
            max_tokens: 500,
            stream: true,
          });

          // Send cards first so frontend can display them
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'cards', cards: selectedCards })}\n\n`));

          // Stream the response with small delay for realism
          for await (const chunk of streamResponse) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', content })}\n\n`));
              // Small delay for natural pacing
              await new Promise(resolve => setTimeout(resolve, 20));
            }
          }

          // Signal completion
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();

          // Save to database after streaming
          if (userId && isSupabaseConfigured()) {
            saveReadingAsync(userId, question, selectedCards, finalTopic, extractedEmotion, language).catch(err => {
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
  topic: string,
  emotion: string,
  language: string
) {
  try {
    const { data: reading, error: readingError } = await supabase
      .from('readings')
      .insert({
        user_id: userId,
        question: question,
        spread_type: '3-card',
        topic: topic,
        language: language,
      })
      .select('id')
      .single();

    if (readingError || !reading) {
      console.error('[DB Reading Error]', readingError);
      return;
    }

    const cardsData = cards.map(sc => ({
      reading_id: reading.id,
      card_name: sc.card.name,
      position: sc.position,
      is_reversed: sc.isReversed || false,
    }));
    
    await supabase.from('cards_drawn').insert(cardsData);

    // Update user memory
    await updateUserMemory(
      userId, 
      question, 
      '', // interpretation saved separately
      cards.map(sc => ({ card_name: sc.card.name }))
    );

    console.log('[Reading Saved]', reading.id);
  } catch (dbError) {
    console.error('[DB Save Error]', dbError);
  }
}
