import OpenAI from 'openai';
import { ZODIAC_SIGNS } from '@/lib/blog/seo-strategy';

const openai = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY })
  : null;

export type ZodiacSign = typeof ZODIAC_SIGNS[number];
export type HoroscopeType = 'daily' | 'weekly' | 'monthly' | 'love' | 'career';

export interface HoroscopeContent {
  sign: ZodiacSign;
  type: HoroscopeType;
  date: string;
  title: string;
  overview: string;
  love: string;
  career: string;
  emotions: string;
  card: string;
  advice: string;
  keywords: string[];
}

const tarotCards = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
  "Judgement", "The World"
];

function getRandomCard(): string {
  return tarotCards[Math.floor(Math.random() * tarotCards.length)];
}

function getTodayDateString(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export async function generateHoroscope(
  sign: ZodiacSign,
  type: HoroscopeType = 'daily'
): Promise<HoroscopeContent> {
  const card = getRandomCard();
  const dateStr = getTodayDateString();

  if (openai) {
    try {
      const aiContent = await generateAIHoroscope(sign, type, card, dateStr);
      if (aiContent) return aiContent;
    } catch (e) {
      console.error('[Horoscope] AI generation failed, using template');
    }
  }

  return generateTemplateHoroscope(sign, type, card, dateStr);
}

async function generateAIHoroscope(
  sign: ZodiacSign,
  type: HoroscopeType,
  card: string,
  dateStr: string
): Promise<HoroscopeContent | null> {
  if (!openai) return null;

  const typeLabel = type === 'daily' ? 'today' : type === 'weekly' ? 'this week' : 'this month';

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a mystical tarot reader writing daily horoscopes. Write in a personal, emotional tone. Keep each section 2-3 sentences. Be specific to the sign energy.'
      },
      {
        role: 'user',
        content: `Write a ${type} horoscope for ${sign} for ${dateStr}. 

The card of the day is: ${card}

Include:
- Overview (3-4 sentences about the overall energy)
- Love (what's happening in relationships)
- Career (work and ambitions)
- Emotional guidance
- One actionable advice

Write like you're speaking directly to ${sign}. Be warm, mysterious, but clear.`
      }
    ],
    temperature: 0.8,
    max_tokens: 600,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return null;

  const sections = content.split('\n\n').filter(s => s.trim());
  
  return {
    sign,
    type,
    date: dateStr,
    title: `${sign} ${type} Horoscope - ${dateStr}`,
    overview: sections[0] || getDefaultOverview(sign),
    love: sections[1] || getDefaultLove(sign),
    career: sections[2] || getDefaultCareer(sign),
    emotions: sections[3] || getDefaultEmotions(sign),
    card,
    advice: sections[4] || getDefaultAdvice(sign),
    keywords: [`${sign.toLowerCase()} horoscope`, `${sign.toLowerCase()} tarot`, `${type} ${sign.toLowerCase()} reading`],
  };
}

function generateTemplateHoroscope(
  sign: ZodiacSign,
  type: HoroscopeType,
  card: string,
  dateStr: string
): HoroscopeContent {
  const signTraits: Record<ZodiacSign, { element: string; quality: string; ruling: string }> = {
    Aries: { element: 'Fire', quality: 'Cardinal', ruling: 'Mars' },
    Taurus: { element: 'Earth', quality: 'Fixed', ruling: 'Venus' },
    Gemini: { element: 'Air', quality: 'Mutable', ruling: 'Mercury' },
    Cancer: { element: 'Water', quality: 'Cardinal', ruling: 'Moon' },
    Leo: { element: 'Fire', quality: 'Fixed', ruling: 'Sun' },
    Virgo: { element: 'Earth', quality: 'Mutable', ruling: 'Mercury' },
    Libra: { element: 'Air', quality: 'Cardinal', ruling: 'Venus' },
    Scorpio: { element: 'Water', quality: 'Fixed', ruling: 'Pluto' },
    Sagittarius: { element: 'Fire', quality: 'Mutable', ruling: 'Jupiter' },
    Capricorn: { element: 'Earth', quality: 'Cardinal', ruling: 'Saturn' },
    Aquarius: { element: 'Air', quality: 'Fixed', ruling: 'Uranus' },
    Pisces: { element: 'Water', quality: 'Mutable', ruling: 'Neptune' },
  };

  const traits = signTraits[sign];

  return {
    sign,
    type,
    date: dateStr,
    title: `${sign} ${type} Horoscope - ${dateStr}`,
    overview: `Today brings important energy for you, ${sign}. The stars are aligning to help you see what you've been missing. ${traits.ruling} is guiding your path toward something meaningful. This is a day of clarity and forward movement.`,
    love: `${sign}, love is showing up in unexpected ways today. If you're single, someone from your past might reappear, or a new connection will spark your interest. If you're in a relationship, communicate openly - your partner is ready to listen.`,
    career: `Your professional energy is high today, ${sign}. The work you've been doing is about to pay off. Trust your instincts in meetings and negotiations. ${traits.element} energy is pushing you to take action.`,
    emotions: `You're feeling things deeply right now, and that's okay. ${sign}, your emotional intelligence is your superpower today. Take time to process what you're feeling before reacting.`,
    card: `Your card today is ${card}. This represents ${getCardMeaning(card)}. Let this guide your decisions today.`,
    advice: `Take one bold step forward today, ${sign}. Trust the process and trust yourself.`,
    keywords: [
      `${sign.toLowerCase()} horoscope`,
      `${sign.toLowerCase()} tarot reading`,
      `${sign} ${type} prediction`,
      `${sign.toLowerCase()} ${traits.element.toLowerCase()} sign`,
    ],
  };
}

function getCardMeaning(card: string): string {
  const meanings: Record<string, string> = {
    'The Fool': 'new beginnings, taking a leap of faith',
    'The Magician': 'manifestation, using your skills',
    'The High Priestess': 'intuition, hidden knowledge',
    'The Empress': 'creativity, abundance, feminine energy',
    'The Emperor': 'structure, authority, stability',
    'The Lovers': 'love, harmony, important choices',
    'The Chariot': 'determination, victory, willpower',
    'Strength': 'courage, patience, inner power',
    'The Hermit': 'introspection, solitude, wisdom',
    'Wheel of Fortune': 'change, cycles, destiny',
    'Justice': 'balance, truth, karma',
    'The Hanged Man': 'letting go, new perspective',
    'Death': 'transformation, endings, new beginnings',
    'Temperance': 'balance, harmony, patience',
    'The Devil': 'shadow work, temptation, breaking free',
    'The Tower': 'sudden change, revelation, awakening',
    'The Star': 'hope, inspiration, spiritual guidance',
    'The Moon': 'intuition, emotions, dreams',
    'The Sun': 'joy, success, vitality',
    'Judgement': 'rebirth, calling, inner觉醒',
    'The World': 'completion, achievement, wholeness',
  };
  return meanings[card] || 'spiritual growth';
}

function getDefaultOverview(sign: ZodiacSign): string {
  return `Today brings important energy for you, ${sign}. The universe is conspiring in your favor. Pay attention to the signs around you.`;
}

function getDefaultLove(sign: ZodiacSign): string {
  return `${sign}, love is in the air today. Communication is key in your relationships. Express what you truly feel.`;
}

function getDefaultCareer(sign: ZodiacSign): string {
  return `Your professional energy is strong today, ${sign}. Trust your instincts and take the lead.`;
}

function getDefaultEmotions(sign: ZodiacSign): string {
  return `You're sensitive today, ${sign}. Take time for yourself and process your emotions healthily.`;
}

function getDefaultAdvice(sign: ZodiacSign): string {
  return `Trust your intuition today, ${sign}. You know the answers you're seeking.`;
}

export async function generateAllDailyHoroscopes(): Promise<HoroscopeContent[]> {
  const horoscopes: HoroscopeContent[] = [];
  
  for (const sign of ZODIAC_SIGNS) {
    const horoscope = await generateHoroscope(sign, 'daily');
    horoscopes.push(horoscope);
    await new Promise(r => setTimeout(r, 500));
  }
  
  return horoscopes;
}

export function formatHoroscopeForWeb(horoscope: HoroscopeContent): string {
  return `
    <article class="horoscope" data-sign="${horoscope.sign}" data-type="${horoscope.type}">
      <h1>${horoscope.title}</h1>
      <p class="overview">${horoscope.overview}</p>
      
      <section class="love">
        <h2>💕 Love</h2>
        <p>${horoscope.love}</p>
      </section>
      
      <section class="career">
        <h2>💼 Career</h2>
        <p>${horoscope.career}</p>
      </section>
      
      <section class="emotions">
        <h2>🌊 Emotions</h2>
        <p>${horoscope.emotions}</p>
      </section>
      
      <section class="card">
        <h2>🔮 Card of the Day</h2>
        <p>${horoscope.card}</p>
      </section>
      
      <section class="advice">
        <h2>⭐ Advice</h2>
        <p>${horoscope.advice}</p>
      </section>
    </article>
  `;
}

export function getHoroscopeKeywords(sign: ZodiacSign): string[] {
  return [
    `${sign.toLowerCase()} horoscope today`,
    `${sign.toLowerCase()} daily tarot`,
    `${sign.toLowerCase()} zodiac prediction`,
    `${sign} love horoscope`,
    `${sign} career horoscope`,
    `daily horoscope ${sign.toLowerCase()}`,
  ];
}