import { SelectedCard } from './tarot/logic';
import type { Language } from './i18n/config';

export interface ReadingInput {
  name: string;
  question: string;
  cards: SelectedCard[];
  contextSummary?: string;
  language: Language;
  emotionalHint?: string;
  userState?: UserState;
}

export interface ReadingOutput {
  reading: string;
  nextHook: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  personalization: {
    nameUsage: number;
    lineCount: number;
    averageLength: number;
  };
}

export interface UserState {
  lastReading?: string;
  lastCards?: string[];
  nextHook?: string;
  lastVisit?: number;
  streak?: number;
  totalVisits?: number;
  lastEmotion?: string;
  lastTopic?: string;
  openLoops?: string[];
}

const MAX_CARDS = 3;

function detectEmotionalState(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('love') || q.includes('pyaar') || q.includes('prem') || q.includes('relationship')) return 'love';
  if (q.includes('career') || q.includes('job') || q.includes('kaam') || q.includes('professional')) return 'career';
  if (q.includes('money') || q.includes('finance') || q.includes('paise') || q.includes('financial')) return 'finance';
  if (q.includes('confused') || q.includes('confusion') || q.includes('uljhan') || q.includes('ndecide')) return 'confusion';
  if (q.includes('anxious') || q.includes('anxiety') || q.includes('chinta') || q.includes('nervous')) return 'anxiety';
  if (q.includes('broken') || q.includes('hurt') || q.includes('heartbroken') || q.includes('dard')) return 'heartbreak';
  if (q.includes('stuck') || q.includes('pause') || q.includes('ruka') || q.includes('blocked')) return 'stuck';
  if (q.includes('hope') || q.includes('hope') || q.includes('aasha') || q.includes('wish')) return 'hopeful';
  return 'general';
}

function generateOpenLoop(language: Language, emotion: string): string {
  const loops: Record<Language, Record<string, string[]>> = {
    en: {
      anxious: ["kul 48 hours mein woh answer clear ho jayega… par darr mat.", "Something's about to shift in the next two days… just don't overthink it.", "Kal sham ke baad ek important clue milega… usko pakadna zaroori hai.", "Agli 48 hours mein tumhara dil kuch decide kar lega… ready raho."],
      hopeful: ["Ek small惊喜 tomorrow ke liye aa rahi hai… feel karoge.", "What you're hoping for has already started moving… just watch for Wednesday.", "Tomorrow's energy is completely different… aakhri baar socho.", "Akal mein kuch naya aa raha hai… kal samajh aayega."],
      confused: ["Kal subah ek moment aayega jab sab clear lagega… tab pakado.", "Koi ek important person tumhe kal batayega kya karna hai… sunn sarna mat.", "Weekend tak koi important decision finally ho jayega… preparation start kar do.", "Jo seeking kar rahe ho woh actually tumhare paas aa raha hai… bas dekho."],
      default: ["Kal ya agle 48 hours mein koi unexpected message aayegi… usko ignore mat karna.", "Something's about to shift in your situation… but you'll only notice if you pay attention.", "There's a thread that will continue tomorrow… don't let it break.", "Ek small change is coming that will make everything click… stay open."]
    },
    hi: {
      anxious: ["कल या अगले 48 घंटे में कोई स्पष्टता आएगी… पर डरा मत।", "अगले दो दिन में कुछ महत्वपूर्ण बदलाव आने वाला है… पर overthinking न करो।", "शाम के बाद कोई महत्वपूर्ण संकेत मिलेगा… उसे पकड़ना जरूरी है।"],
      hopeful: ["कल के लिए एक छोटी सी गवाही आ रही है… महसूस करोगे।", "जो आशा कर रहे हो वह लगभग तैयार है… बस रुकने दो।"],
      confused: ["कल सुबह वो पल आएगा जब सब साफ लगेगा… तब समझ जाओगे।", "वेंडर की तरफ से कुछ महत्वपूर्ण संदेश आ रहा है… उसे पकड़ो।"],
      default: ["कल या अगले 48 घंटे में एक unexpected message आएगी… इसे ignore मत करो।", "तुम्हारी स्थिति में एक छोटा बदलाव आने वाला है… पर ध्यान दें।"]
    },
    hinglish: {
      anxious: ["Kal ya agle 48 hours mein koi clarity aayegi… par darr mat.", "Next two days mein kuch important change aa raha hai… but overthinking mat karo.", "Shaam ke baad koi important clue milega… usko pakadna zaroori hai."],
      hopeful: ["Kal ke liye ek small surprise aa rahi hai… feel karoge.", "Jo hope kar rahe ho woh almost ready hai… bas rukne do."],
      confused: ["Kal subah ek moment aayega jab sab clear lagega… tab pakado.", "Koi ek important person tumhe kal batayega kya karna hai… sunn sarna mat."],
      default: ["Kal ya agle 48 hours mein koi unexpected message aayegi… usko ignore mat karna.", "Something's about to shift in your situation… but you'll only notice if you pay attention.", "Ek small change is coming that will make everything click… stay open."]
    },
    ar: {
      anxious: ["کل یا اگلے 48 گھنٹوں میں کچھ واضح ہو جائے گا…ڈرو مت۔", "اگلے دو دنوں میں کچھ اہم تبدیلی آ رہی ہے…刻苦 نہ کرو۔"],
      hopeful: ["کل کے لیے ایک چھوٹی surprise آ رہی ہے…محسوس کرو گے۔", "جو امید کر رہے ہو وہ تقریباً تیار ہے…بس رکو۔"],
      confused: ["کل صبح ایک لمحہ آئے گا جب سب واضح لگے گا…پکڑو۔", "کسی اہم شخص کو کل تمہیں بتائے گا کیا کرنا ہے…تماشہ مت بنانا۔"],
      default: ["کل یا اگلے 48 گھنٹوں میں کچھ unexpected message آئے گی…اسے ignore مت کرنا۔"]
    },
    he: {
      anxious: ["במהלך 48 השעות הקרובות יהיה clarity…אל תפחד.", "בשני הימים הבאים משהו משתנה…אל תחבק מחשבות."],
      hopeful: ["מתנה קטנה מחר…תרגיש.", "מה שאתה מקווה כבר זז…מתן genug vantage."],
      confused: ["בבוקר מחר יגיע מומנט שכולל יה透明…אחוז את זה.", "אדם חשוב ייגש אליך מחר…אל תפספס."],
      default: ["במהלך 48 השעות הקרובות יגיע message…אל תתעלם מזה."]
    }
  };

  const langLoops = loops[language]?.[emotion] || loops[language]?.default || loops.en.default;
  return langLoops[Math.floor(Math.random() * langLoops.length)];
}

function buildPrompt(input: ReadingInput): string {
  const { name, question, cards, contextSummary, language, emotionalHint } = input;
  const emotionalState = emotionalHint || detectEmotionalState(question);

  // Map SelectedCard[] to simple name/meaning arrays
  const cardNames = cards.map(c => c.card.name).join(', ');
  const cardMeanings = cards.map(c => `${c.card.name} → ${c.card.upright}`).join('\n');

  const toneMap: Record<Language, string> = {
    en: "Speak in natural emotional English, like a close friend talking.",
    hi: "Natural, conversational Hindi - as if speaking to someone you care about.",
    hinglish: "Human-like Hinglish, warm and genuine, like real conversation.",
    ar: "Speak naturally in Arabic, like a close friend.",
    he: "Speak naturally in Hebrew, warm and personal."
  };

  return `
You are a deeply intuitive tarot reader who speaks from the heart.

User Name: ${name}
Question: ${question}
Emotional State: ${emotionalState}
Cards Drawn: ${cardNames}

Card Meanings:
${cardMeanings}

${contextSummary ? `Extra Context: ${contextSummary}` : ''}

---
STYLE RULES:

- Talk to ${name} like they're sitting across from you
- Use their name 2-3 times naturally throughout
- NO generic phrases like "universe says" or "energy is"
- NO repetition - each line must feel fresh
- NO long paragraphs - use short emotional bursts
- Each sentence must feel intentional and necessary
- Sound like a real human, not a fortune cookie

---
STRUCTURE (follow EXACTLY):

1. Opening (1-2 lines): Acknowledge what they're feeling beneath the question
2. Insight (2-3 lines): What's REALLY happening below surface
3. Shift (1-2 lines): What they're missing / misunderstanding
4. Timing (1 line): Near-future direction (specific not vague)
5. Guidance (2 lines max): Clear, actionable advice
6. Closing (1 line): Memorable, emotional, slightly mysterious + hook

---
TONE: ${toneMap[language]}

---
EXAMPLE (DO NOT COPY - just for style):

"${name}, your heart's been holding its breath, waiting for something that hasn't happened yet."

"What you're actually seeking isn't out there - it's the permission to trust yourself."

"Kal sham ko jab tum free honge, ek message aayega… usko ignore mat karna."

---
MUST INCLUDE AT END:
Add ONE open loop sentence that makes them want to check back. Examples:
- "Something's shifting in the next 48 hours… watch for it."
- "Kal ek important clue mil jayega… ready raho."
- "Agle din ko kuch unexpected hogi…关注 करो."

---
OUTPUT FORMAT:
Only the raw reading text. No labels, no formatting, no explanations.
`;
}

function extractReadingSegments(readingText: string): { [key: string]: string[] } {
  const lines = readingText.split('\n').filter(l => l.trim().length > 0);
  const segments: { [key: string]: string[] } = {
    opening: [],
    insight: [],
    shift: [],
    timing: [],
    guidance: [],
    closing: []
  };

  let currentSegment = 'opening';
  let paragraphBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length === 0) continue;

    paragraphBuffer.push(line);

    if (paragraphBuffer.length >= 2 || i === lines.length - 1) {
      const paragraphText = paragraphBuffer.join('. ');
      if (paragraphText.toLowerCase().includes('opening') ||
          paragraphText.toLowerCase().includes('though') ||
          paragraphText.toLowerCase().includes('first')) {
        currentSegment = 'opening';
      } else if (paragraphText.toLowerCase().includes('insight') ||
                 paragraphText.toLowerCase().includes('happening') ||
                 paragraphText.toLowerCase().includes('below')) {
        currentSegment = 'insight';
      } else if (paragraphText.toLowerCase().includes('shift') ||
                 paragraphText.toLowerCase().includes('missing') ||
                 paragraphText.toLowerCase().includes('understand')) {
        currentSegment = 'shift';
      } else if (paragraphText.toLowerCase().includes('timing') ||
                 paragraphText.toLowerCase().includes('next') ||
                 paragraphText.toLowerCase().includes('coming') ||
                 paragraphText.toLowerCase().includes('tomorrow')) {
        currentSegment = 'timing';
      } else if (paragraphText.toLowerCase().includes('guidance') ||
                 paragraphText.toLowerCase().includes('advice') ||
                 paragraphText.toLowerCase().includes('should') ||
                 paragraphText.toLowerCase().includes('take')) {
        currentSegment = 'guidance';
      } else if (paragraphText.toLowerCase().includes('closing') ||
                 paragraphText.toLowerCase().includes('remember') ||
                 paragraphText.toLowerCase().includes('waiting')) {
        currentSegment = 'closing';
      }

      segments[currentSegment].push(paragraphText);
      paragraphBuffer = [];
    }
  }

  return segments;
}

export function generatePersonalizedReading(input: ReadingInput): ReadingOutput {
  const prompt = buildPrompt(input);
  // In production, call LLM with prompt
  const simulatedResult = simulateLLMReading(input);

  return {
    reading: simulatedResult.reading,
    nextHook: simulatedResult.nextHook,
    urgencyLevel: simulatedResult.urgencyLevel,
    personalization: {
      nameUsage: (simulatedResult.reading.match(new RegExp(input.name, 'gi')) || []).length,
      lineCount: simulatedResult.reading.split('\n').length,
      averageLength: simulatedResult.reading.length / simulatedResult.reading.split('\n').length
    }
  };
}

function simulateLLMReading(input: ReadingInput): { reading: string; nextHook: string; urgencyLevel: 'low' | 'medium' | 'high' } {
  const { name, question, cards, language } = input;
  const emotionalState = detectEmotionalState(question);

  // Safely get card names
  const getCardName = (idx: number) => cards[idx]?.card?.name || (idx === 0 ? 'The Fool' : idx === 1 ? 'The Magician' : 'The High Priestess');
  const card1 = getCardName(0);
  const card2 = getCardName(1);
  const card3 = getCardName(2);

  const openLoop = generateOpenLoop(language, emotionalState);

  const langTemplates: Record<Language, any> = {
    en: {
      nameInsertions: [name, "you", "you"],
      openers: [
        `${name}, I can feel something beneath your question...`,
        `What you're really asking isn't just about ${card1}...`,
        `Your heart already knows, ${name}, but let me confirm...`
      ],
      insights: [
        `The energy of ${card1} shows you're actually wrestling with trust issues rooted in past experiences.`,
        `There's another layer here - you're protecting something precious while also wanting to be seen.`,
        `What's hidden is that you've already made the decision, you're just waiting for permission.`
      ],
      shifts: [
        `But what you're missing is that this isn't about them at all - it's about your own alignment.`,
        `The misunderstanding is believing this situation defines you. It doesn't.`,
        `You've been interpreting this through an old lens that no longer fits.`
      ],
      timings: [
        `Clarity is arriving in exactly 3 days - mark my words.`,
        `By next week Thursday, something will click into place.`,
        `Weekend brings unexpected clarity - embrace it.`
      ],
      guidance: [
        `Write down what you want - not for them, for yourself.`,
        `Take one small action TODAY that proves you trust yourself.`,
        `Stop explaining yourself. Just show up authentically.`
      ],
      closings: [
        `Remember, the cards don't lie - but you might not like what they reveal.\n${openLoop}`,
        `What you resist persists, but what you acknowledge transforms.\n${openLoop}`,
        `This isn't just about cards - it's about you remembering who you are.\n${openLoop}`
      ]
    },
    hi: {
      openers: [
        `${name}, main soch raha hoon tumhare question ke peeche kya chhupa hai...`,
        `Jo tum Actually pooch rahe ho woh sirf ${card1} ke baare mein nahi hai...`,
        `Tumhara dil already jaanta hai, ${name}, par confirm karne do...`
      ],
      insights: [
        `${card1} ki energy dikhati hai ke tum actually trust issues se fight kar rahe ho jo past experiences se aayi hain.`,
        `Yahan ek aur layer hai - tum kuch precious ko protect kar rahe ho jabki saath mein dekhna chahte ho.`,
        `Chhupa hua yeh hai ke tum already decision le chuke ho, bas permission ki wait kar rahe ho.`
      ],
      shifts: [
        `Par tum kya miss kar rahe ho woh yeh hai ke yeh unke baare mein hi nahi hai - yeh tumhare alignment ke baare mein hai.`,
        `Misunderstanding yeh maan lena hai ke yeh situation tumhe define karta hai. Nahi karta.`,
        `Tumne isko ek purane lens se interpret kiya hai jo ab fit nahi hota.`
      ],
      timings: [
        `Clarity exactly 3 din mein aa rahi hai - yaad rakhna.`,
        `Agle hafte ke Thursday tak, kuch click ho jayega.`,
        `Weekend unexpected clarity laayega - use embrace karo.`
      ],
      guidance: [
        `Jo chahte ho woh likh lo - unke liye nahi, apne liye.`,
        `Aaj ek chhota action lo jo prove kare ke tum apne aap pe trust karte ho.`,
        `Apna explanation band karo. Bas authentic ho kar dikhao.`
      ],
      closings: [
        `Yaad rakho, cards jhoot nahi bolte - par tumko pasand nahi aayega jo dikhayenge.\n${openLoop}`,
        `Jo tum resist karte ho woh persist karta hai, par jo acknowledge karte ho woh transform hota hai.\n${openLoop}`,
        `Yeh sirf cards ke baare mein nahi hai - yeh tumhare us vyakti ko yaad karne ke baare mein hai jo tum ho.\n${openLoop}`
      ]
    },
    hinglish: {
      openers: [
        `${name}, main tumhare question ke neeche kuch feel kar raha hoon...`,
        `Jo tum actually pooch rahe ho woh sirf ${card1} ke baare mein nahi hai...`,
        `Tumhara dil already jaanta hai, ${name}, par confirm karne do...`
      ],
      insights: [
        `${card1} ki energy dikhati hai ke tum actually trust issues se fight kar rahe ho jo past ke experiences se aaye hain.`,
        `Yahan ek aur layer hai - tum kuch precious ko protect kar rahe ho sath mein dekhna chahte ho.`,
        `Chhupa hua yeh hai ke tum already decision le chuke ho, bas permission ki wait kar rahe ho.`
      ],
      shifts: [
        `Par tum kya miss kar rahe ho woh yeh hai ke yeh unke baare mein hi nahi hai - yeh tumhare own alignment ke baare mein hai.`,
        `Misunderstanding yeh maan lena hai ke yeh situation tumhe define karta hai. Nahi karta.`,
        `Tumne isko purane lens se interpret kiya hai jo ab fit nahi hota.`
      ],
      timings: [
        `Clarity exactly 3 din mein aa rahi hai - yaad rakhna.`,
        `Agle hafte ke Thursday tak, kuch click ho jayega.`,
        `Weekend unexpected clarity laayega - use embrace karo.`
      ],
      guidance: [
        `Jo chahte ho woh likh lo - unke liye nahi, apne liye.`,
        `Aaj ek chhota action lo jo prove kare ke tum apne aap pe trust karte ho.`,
        `Apna explanation band karo. Bas authentic ho kar dikhao.`
      ],
      closings: [
        `Yaad rakho, cards jhoot nahi bolte - par tumko pasand nahi aayega jo dikhayenge.\n${openLoop}`,
        `Jo tum resist karte ho woh persist karta hai, par jo acknowledge karte ho woh transform hota hai.\n${openLoop}`,
        `Yeh sirf cards ke baare mein nahi hai - yeh tumhare us vyakti ko yaad karne ke baare mein hai jo tum ho.\n${openLoop}`
      ]
    },
    ar: { // Arabic fallback (using English approximations)
      openers: [`${name}, I sense something deep...`],
      insights: [`The cards indicate a significant phase.`],
      shifts: [`But you may be missing the inner message.`],
      timings: [`Clarity is near.`],
      guidance: [`Trust your inner voice.`],
      closings: [`Remember, the truth will reveal itself.\n${openLoop}`]
    },
    he: { // Hebrew fallback
      openers: [`${name}, אני מרגיש משהו עמוק...`],
      insights: [`הקלפים מצב משמעותי.`],
      shifts: [`אולי אתה מפספס את המסר הפנימי.`],
      timings: [`בהירות קרובה.`],
      guidance: [`בטח בקול הפנימי.`],
      closings: [`זכור, האמת תגלה עצמה.\n${openLoop}`]
    }
  };

  const templates = langTemplates[language] || langTemplates.en;

  const opener = templates.openers[Math.floor(Math.random() * templates.openers.length)];
  const insight1 = templates.insights[Math.floor(Math.random() * templates.insights.length)];
  const insight2 = templates.insights[Math.floor(Math.random() * templates.insights.length)];
  const shift = templates.shifts[Math.floor(Math.random() * templates.shifts.length)];
  const timing = templates.timings[Math.floor(Math.random() * templates.timings.length)];
  const guidance1 = templates.guidance[Math.floor(Math.random() * templates.guidance.length)];
  const guidance2 = templates.guidance[Math.floor(Math.random() * templates.guidance.length)];
  const closing = templates.closings[Math.floor(Math.random() * templates.closings.length)];

  const reading = `${opener}

${insight1}
${insight2}

${shift}

${timing}

${guidance1}
${guidance2}

${closing}`;

  return {
    reading,
    nextHook: openLoop,
    urgencyLevel: emotionalState === 'anxiety' || emotionalState === 'confusion' ? 'high' : 'medium'
  };
}

export function cleanReading(text: string): string {
  const lines = text.split('\n').map(l => l.trim());
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const line of lines) {
    if (line.length === 0) continue;
    const normalized = line.toLowerCase().replace(/[.!?,]/g, '').trim();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      unique.push(line);
    }
  }

  return unique.join('\n');
}

export function detectIntent(question: string): string {
  return detectEmotionalState(question);
}
