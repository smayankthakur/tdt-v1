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
  const readingCount = history.length;
  
  let summary = '';
  
  if (readingCount > 1) {
    summary += `You've been here before - this seems like an ongoing situation. `;
  }
  
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
    summary += `This keeps circling back - questions like "${recentQuestions[0]}" keep bringing you here. `;
  }
  
  return summary;
}

const ILLUSION_LINES = [
  "This isn't random - your energy is very clear here...",
  "This came through very strongly from your cards...",
  "I sense something significant in what the cards are showing...",
  "There's a pattern emerging that I want you to notice...",
  "Your energy is speaking loudly through these cards...",
  // Pattern-aware illusion lines
  "This doesn't feel random...",
  "This is coming through very clearly...",
  "There's a deeper layer here that I want you to see...",
  "I've been sensing this pattern in your readings for a while now...",
  "This keeps showing up in your readings...",
  "There's something about this situation that feels very familiar...",
];

const EMOTIONAL_OPENERS = [
  "I can feel the weight of this question on your mind...",
  "There's an emotional current running through this that I want you to feel...",
  "I sense the uncertainty you've been carrying...",
  "This situation has been on your mind more than you admit...",
  "There's something you need to hear, and I'm here to tell you...",
  "I can feel something shifting in your energy right now...",
  // Pattern-aware openers for returning users
  "This situation feels like it hasn't fully settled yet...",
  "I can sense this keeps circling back emotionally...",
  "There's a pattern here that keeps pulling you back...",
  "This doesn't feel like something new... more like something ongoing...",
  "I've been feeling this energy from you for a while now...",
  "Something about this situation feels familiar... like it's been here before...",
];

 const HUMAN_TAROT_SYSTEM_PROMPT = `You are Ginni, a deeply intuitive tarot reader who speaks like a close, understanding friend. Your readings are personal, emotional, and feel written just for the user. Write in natural, conversational Hinglish (Hindi-English mix) with a soft, calm, slightly intimate tone.

 CORE OBJECTIVE:
 Create ONE unified, emotionally rich reading that flows like a single story. The user should feel: "Yeh sirf mere liye likha gaya hai."

 NON-NEGOTIABLE RULES:
 ❌ NEVER:
 - Mention card names or explain individual cards
 - Say "based on the cards", "this card means…", or textbook definitions
 - Use bullet points, numbered lists, or section headings
 - Sound robotic, analytical, or generic
 - Refer to yourself as AI, assistant, chatbot, or system

 ✅ ALWAYS:
 - Address the user by name (if provided) naturally, 1–2 times max
 - Merge all card insights into ONE continuous narrative
 - Focus on emotion, situation, and clarity
 - Keep it under 300 words
 - Make it feel immersive and personal

 INVISIBLE FLOW (FOLLOW THIS ORDER):
 1. GREETING: Start gently with name (if known). E.g., "Mayank, ek baat clearly dikh rahi hai…" or "Mayank, tumhare question mein kuch interesting hai…"

 2. SITUATION READING: Combine all card signals into one insight about their question. E.g., "Tum ek aise phase mein ho jahan…", "Jo tum feel kar rahe ho na…"

 3. EMOTIONAL VALIDATION: Acknowledge their feelings. "Aur honestly, yeh feeling galat nahi hai…", "Kisi bhi insaan ko yeh confuse kar deta…"

 4. HIDDEN PATTERN: Reveal deeper 'why' with psychological layer. "Kyunki tum last time…", "Yeh pattern isiliye dikh raha hai…"

 5. DIRECTION: Subtle future insight, not absolute prediction. "Aage kuch months mein…", "Jo aa raha hai woh…"

 6. GUIDANCE: Clear, actionable step. "Ab tumhe yeh karna chahiye…", "Ek chhota sa step jo sab change kar sakta hai…"

 7. EMOTIONAL CLOSING: End with impact. "Tum already jaante ho kya sahi hai…", "Bas is baar apne aapko ignore mat karna…"

 LANGUAGE & STYLE:
 - Conversational Hinglish – mix Hindi/English naturally
 - Use phrases like "jo dikh raha hai…", "ek pattern clearly aa raha hai…"
 - Avoid any system, technical, or corporate language

 PERSONALIZATION:
 - Use name naturally if available (max 1–2 times)
 - Reference question indirectly: "Jo tum pooch rahe ho…", "Is situation mein…"
 - Adapt tone to detected emotion (love: emotional, career: pressure, confusion: overthinking)

 FINAL CHECK:
 ✔ Reads like a real person, not a machine
 ✔ No card names, no sections, no bullet points
 ✔ Feels deeply personal and emotional
 ✔ Leaves the user feeling understood`;

const LANGUAGE_PROMPTS: Record<string, string> = {
  en: HUMAN_TAROT_SYSTEM_PROMPT,
  hi: `${HUMAN_TAROT_SYSTEM_PROMPT} Write in natural, beautiful Hindi with emotional depth.`,
  hinglish: `${HUMAN_TAROT_SYSTEM_PROMPT} Write in conversational Hinglish - mix of Hindi and English, WhatsApp style, keep it real and personal.`,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, userId, language = 'en', topic, selectedCards: providedCards, name } = body;

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
    const isReturningUser = cardHistory.length > 0;
    
    // Pick opener based on user status
    const basicOpeners = EMOTIONAL_OPENERS.slice(0, 6);
    const patternOpeners = EMOTIONAL_OPENERS.slice(6);
    const availableOpeners = isReturningUser ? EMOTIONAL_OPENERS : basicOpeners;
    const emotionalOpener = availableOpeners[Math.floor(Math.random() * availableOpeners.length)];
    
    // Pick illusion line
    const illusionLine = ILLUSION_LINES[Math.floor(Math.random() * ILLUSION_LINES.length)];

    // Build enhanced prompt
    const topicSection = finalTopic ? `\nTopic: ${finalTopic}` : '';
    const emotionSection = extractedEmotion !== 'neutral' 
      ? `\nUser is feeling: ${extractedEmotion}` 
      : '';
    const historySection = historySummary 
      ? `\nRecent context: ${historySummary}` 
      : '';
    
     let userPrompt = '';
     if (name) {
       userPrompt += `The person asking is: ${name}\n\n`;
     }
     userPrompt += `${emotionalOpener}\n\nQuestion: "${question}"${topicSection}${emotionSection}\nCards drawn: ${cardsFormatted}${memoryContext}${historySection}\n\n${illusionLine}\n\nGive a deeply personal reading following the structure above. Make sure to naturally use their name (${name}) in your response.`;

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

          // Stream the response with pacing for natural feel
          let lastWasParagraph = false;
          for await (const chunk of streamResponse) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', content })}\n\n`));
              
              // Add natural pauses after paragraph breaks
              const isParagraphBreak = content === '\n' || content === '\n\n';
              if (isParagraphBreak || (lastWasParagraph && content.length > 0)) {
                await new Promise(resolve => setTimeout(resolve, 80));
              } else {
                await new Promise(resolve => setTimeout(resolve, 15));
              }
              lastWasParagraph = isParagraphBreak;
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
