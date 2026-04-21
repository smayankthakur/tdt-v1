'use client';

import { useState, useCallback } from 'react';
import { useReadingLimitStore } from '@/store/reading-types';
import { useLanguage } from '@/hooks/useLanguage';
import { useAutoLanguage } from '@/hooks/useAutoLanguage';
import { type ReadingType } from '@/store/reading-types';
import { SelectedCard } from '@/lib/tarot/logic';
import { generateHumanizedReading, createContextFromAnalysis } from '@/lib/humanizeReading';
import type { DomainAnalysis } from '@/lib/cardEngine';

export interface ReadingResult {
  name: string;
  question: string;
  greeting: string;
  reading: string;
  guidance: string;
  streamingLines: string[]; // For streaming output
  language: string;
  timestamp: string;
}

interface GenerateInput {
  name: string;
  question: string;
  readingType: ReadingType;
  selectedCards?: SelectedCard[];
  domainAnalysis?: DomainAnalysis;
}

const PERSONALITY_OPENINGS = {
  hinglish: [
    "{name}, jo energy aa rahi hai…",
    "{name}, tumhare situation mein kuch interesting chal raha hai.",
    "{name}, suno… jo dikh raha hai woh important hai.",
    "Hey {name}, thoda deep focus kar raha hoon…",
  ],
  english: [
    "{name}, I'm sensing something here…",
    "Let me share what I'm seeing for you, {name}.",
    "Take a moment with this, {name}…",
    "What I'm picking up on, {name}…",
  ],
  hindi: [
    "{name}, jo sanket mil rahe hain…",
    "{name}, aapke question ke answers mein kuch interesting hai…",
  ],
};

const GUIDANCE_TEMPLATES = {
  hinglish: [
    "Toh ab kya karein? Patience rakhho aur apni instinct pe trust karo. Jo chahte ho woh apne aap milega.",
    "Direction clear hai. Bas thoda time lagega, par progress zaroor hogi.",
    "Situation thoda complex hai, par solution simple hai. Soch kar samajh ao.",
    "Energy abhi shifting hai. Thoda wait karo, results aayenge.",
  ],
  english: [
    "Trust your instincts here. The universe is guiding you, even if the path isn't clear yet.",
    "What you're seeking is already on its way. Just stay open.",
    "There's more to this than meets the eye. Take your time processing.",
    "The timing isn't right yet, but it will be. Stay patient.",
  ],
  hindi: [
    "Abhi wait karna pad sakta hai. Par jo chahte ho woh zaroor milega.",
    " situation clear ho raha hai. Thoda time do.",
    "Apni instinct pe bharosa rakho. Answers aayenge.",
  ],
};

const READING_PATTERNS = {
  detailed: [
    { pattern: 'love', content: "Tumhare relationship mein kuch important chal raha hai. Jo feel kar rahe ho woh real hai. Ek person ka impact tum par bahut hai, aur woh person bhi tumhe feel kar raha hai. Status ab gray zone mein hai - na tum close ho, na door. Par communication se sab sudhar sakta hai.", guidance: "Pehle approach karo. Adha time do. Koi bada decision abhi mat lo. Communication is the key." },
    { pattern: 'career', content: "Tumhara professional journey ab ek crucial point par hai. Jo kaam kar rahe ho usme kuch missing feel ho raha hai. Either growth chahiye ya new opportunity. Interview ya promotion ki timing abhi right hai.", guidance: "Apne skills showcase karo. Jab timing sahi ho, tab opportunity khud aayegi." },
  ],
  yesno: [
    { pattern: 'yes', content: "Haan. Probability high hai. Jo tum chahte ho, wohhone wala hai.", guidance: "Keep doing what you're doing. Results aane wale hain." },
    { pattern: 'no', content: "Abhi no. Timing wrong hai. Par future mein possibility hai.", guidance: "Wait karo. Aur prepare karo. Time change karega." },
  ],
  daily: [
    { content: "Aaj ka din balanced hai. Morning me start strong karo, afternoon me challenges aayenge, but evening good hai. Health ka dhyan rakhna hai - water piyo. Emotions unpredictable rahenge, but control tumhare paas hai.", guidance: "Schedule me flexibility rakhna. Overthinking se avoid karo." },
  ],
  union: [
    { content: "Union possible hai, par conditions apply hote hain. Person interested hai but show nahi kar raha. Tumhe patience rakhna hoga. Time lag sakta hai, but final outcome positive dikh raha hai. Koi external factor delay kar sakta hai.", guidance: "Proactively connect karo but desperate mat bano. Let nature take its course." },
  ],
  thirdparty: [
    { content: "Third party situation clear dikh raha hai. Person aware hai tumhe aur us person ke beech. Unki priority ab aap nahi ho. End ho chuka hai ya hone vala hai. Wishful thinking zone mein ho tum.", guidance: "Accept reality. Move on. Naya connection wait kar raha hai." },
  ],
  shaadi: [
    { content: "Shaadi ka probability time ke saath increase ho raha hai. Logistics kaana hai. Traditional approach better kaam karegi. Family ki involvement required hogi. Date ya timeline abhi vague hai.", guidance: "Start looking. Attend events. Let family know. Settings ke saath raho." },
  ],
  soulmate: [
    { content: "Soulmate connection agree rahe hain. Personality traits clear hain - emotional, supportive, growth-oriented. physical meeting abhi door hai, but online connection possible hai. Trust the process.", guidance: " Don't settle. Your person is coming. Stay true to your needs." },
  ],
  baby: [
    { content: "Timing abhi right nahi hai. Preparation phase mein ho. Health ya financial pe kaam karna hoga pehle. Nature kaana hai tumhe ready hai. Doctor ya expert guidance le sakte ho.", guidance: "Prepare properly. Take medical advice. When ready, try without stress." },
  ],
  partner: [
    { content: "Partner ki feelings clear hain - woh deeply care karte hain, par expression issue hai. Apna pyaar but show nahi karte. Actions speak louder - observe what they do, not say.", guidance: " communicate openly but gently. Ask, don't assume." },
  ],
  spiritual: [
    { content: "Spiritual journey strong movement mein hai. Inner work required hai. Darr ke saath deal karna hoga. Transformation hone vala hai - painful but necessary. Past life echoes present.", guidance: "Meditation rakhna. Journaling help karegi. Professional help lo if needed." },
  ],
  month: [
    { content: "This month kuch interesting laane wala hai Unexpected opportunity ya meeting possible hai. Financially stable rahega but new expense bhi aayega. People in your life will shift - some close, some distant.", guidance: "Stay adaptable. New beginnings ke liye ready raho." },
  ],
  universe: [
    { content: "Universe tumhe guide kar raha hai. Signs ignore mat karo - they are everywhere. Tum ready ho us level ke insights ke liye. Deep transformation happening. Trust the unseen.", guidance: "Pay attention to coincidences. Keep a journal. Trust what feels right." },
  ],
  action: [
    { content: "Partner next step le sakta hai - wait kar rahe hain tumhe. Initiative tumse expect kar rahe hain. Decision door ya door hai. Clear communication needed hai before action.", guidance: "Be bold first. Set the tone. They will respond." },
  ],
  relationship: [
    { content: "Past: Connection strong start hua tha. Issues developed over time. Present: At crossroads - choice time. Future: Positive agar changes kiya. Niche fix karna hoga, surface nahi.", guidance: "Work on the foundation. Counseling help kar sakti hai. Both need to try." },
  ],
  default: [
    { content: "Energy is shifting. You are at a point of transformation. What you seek is seeking you. Trust the journey.", guidance: "Be patient. Trust yourself. The answers will come when the time is right." },
  ],
};

function generateOpening(name: string, language: string): string {
  const openings = PERSONALITY_OPENINGS[language as keyof typeof PERSONALITY_OPENINGS] || PERSONALITY_OPENINGS.english;
  const opening = openings[Math.floor(Math.random() * openings.length)];
  return opening.replace('{name}', name);
}

function generateGuidance(readingType: string, language: string): string {
  const templates = GUIDANCE_TEMPLATES[language as keyof typeof GUIDANCE_TEMPLATES] || GUIDANCE_TEMPLATES.english;
  return templates[Math.floor(Math.random() * templates.length)];
}

// Generate reading based on actual selected cards using humanization engine - UNIFIED FLOW
function generateReadingFromCards(
  selectedCards: SelectedCard[],
  question: string,
  readingType: string,
  name: string = 'Seeker',
  domainAnalysis?: DomainAnalysis,
  language: string = 'en'
): { reading: string; guidance: string; streamingLines: string[]; greeting?: string } {
  // Build context using precomputed domain analysis if available
  let context;
  if (domainAnalysis) {
    context = createContextFromAnalysis(domainAnalysis, question, name);
  } else {
    // Fallback: analyze question inline
    context = createContextFromAnalysis(
      {
        primaryDomain: 'general',
        emotionalTone: 'neutral',
        keywords: [],
      },
      question,
      name
    );
  }
  
  // Generate full reading using humanization engine with language transformation
  const reading = generateHumanizedReading(context, selectedCards, language as 'en' | 'hi' | 'hinglish');
  
  // Create unified single-flow reading without sections or headers
  const greeting = reading.opening;
  const fullReading = `${reading.opening} ${reading.presentEnergy} ${reading.underlyingPattern} ${reading.direction} ${reading.guidance} ${reading.closing}`;
  
  // Split into natural flow for streaming - single unified paragraph with natural pauses
  const lines = fullReading
    .split('. ')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .flatMap((sentence, idx, arr) => {
      // Add subtle breaks at transition points but keep flow natural
      if (idx === 0 || idx === arr.length - 1) {
        return [sentence];
      }
      // Every few sentences, add a small pause for effect but no headers
      if (idx % 3 === 0 && idx < arr.length - 2) {
        return [sentence, ''];
      }
      return [sentence];
    });
  
  return {
    reading: fullReading,
    guidance: reading.guidance,
    streamingLines: lines,
    greeting,
  };
}

// Helper to convert humanized reading to streaming lines - UNIFIED FLOW WITHOUT HEADERS
function formatReadingSections(reading: ReturnType<typeof generateHumanizedReading>): string[] {
  const fullReading = `${reading.opening} ${reading.presentEnergy} ${reading.underlyingPattern} ${reading.direction} ${reading.guidance} ${reading.closing}`;
  
  return fullReading
    .split('. ')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// Fallback reading when no cards
function generateReadingContent(question: string, readingType: string, language: string): string {
  const patterns = READING_PATTERNS[readingType as keyof typeof READING_PATTERNS] || READING_PATTERNS.default;
  
  if (Array.isArray(patterns)) {
    const lowerQ = question.toLowerCase();
    
    for (const p of patterns) {
      if ('pattern' in p && p.pattern && lowerQ.includes(p.pattern)) {
        return p.content;
      }
    }
    
    const randomItem = patterns[Math.floor(Math.random() * patterns.length)];
    return randomItem.content;
  }

  return "The cards are listening to your question...";
}

function analyzeEmotion(question: string): string {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('fear') || lowerQ.includes('darr') || lowerQ.includes('nervous')) {
    return 'fear';
  }
  if (lowerQ.includes('hope') || lowerQ.includes('wish') || lowerQ.includes('want')) {
    return 'hope';
  }
  if (lowerQ.includes('confused') || lowerQ.includes('kya') || lowerQ.includes('samajh')) {
    return 'confusion';
  }
  
  return 'curious';
}

// Storage key for persisting readings
const READINGS_STORAGE_KEY = 'tdt_persisted_readings';

interface StoredReading extends ReadingResult {
  storedAt: number;
  sessionKey: string;
}

function getStoredReadings(): StoredReading[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(READINGS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveReadingToStorage(reading: ReadingResult, sessionKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    const stored = getStoredReadings();
    const newStored: StoredReading = {
      ...reading,
      storedAt: Date.now(),
      sessionKey,
    };
    const updated = [newStored, ...stored.slice(0, 9)]; // Keep last 10
    localStorage.setItem(READINGS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

function getStoredReading(sessionKey: string): ReadingResult | null {
  const stored = getStoredReadings();
  const found = stored.find(r => r.sessionKey === sessionKey);
  return found || null;
}

export function useReadingFlow() {
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionKey] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);
  
  const { canRead, incrementReading } = useReadingLimitStore();
  const { language } = useLanguage();
  const { region } = useAutoLanguage();
  
  const generateReading = useCallback(async (input: GenerateInput) => {
    setIsLoading(true);
    setError(null);
    
    if (!canRead()) {
      setError('Limit reached');
      setIsLoading(false);
      return;
    }
    
    // Check if we already have a reading stored for this session (prevent regeneration)
    const existingReading = getStoredReading(sessionKey);
    if (existingReading) {
      setResult(existingReading);
      setIsLoading(false);
      return;
    }
    
    try {
      // Ritual pacing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const detectedLang = region === 'india' ? 'hinglish' : 'en';
      
      // Generate reading based on actual cards if provided
      let readingContent: string;
      let guidance: string;
      let streamingLines: string[] = [];
      let greeting: string;

      if (input.selectedCards && input.selectedCards.length > 0) {
        const generated = generateReadingFromCards(
          input.selectedCards,
          input.question,
          input.readingType,
          input.name,
          input.domainAnalysis,
          language
        );
        readingContent = generated.reading;
        guidance = generated.guidance;
        streamingLines = generated.streamingLines;
        greeting = generated.greeting || generateOpening(input.name, detectedLang);
      } else {
        greeting = generateOpening(input.name, detectedLang);
        readingContent = generateReadingContent(input.question, input.readingType, detectedLang);
        guidance = generateGuidance(input.readingType, detectedLang);
        // Fallback streaming lines - unify the flow without headers
        streamingLines = [
          `${greeting} ${readingContent} ${guidance} Tum already jaante ho kya sahi hai… bas ab usse ignore mat karo.`,
        ];
      }
      
      const readingResult: ReadingResult = {
        name: input.name,
        question: input.question,
        greeting,
        reading: readingContent,
        guidance,
        streamingLines,
        language: detectedLang,
        timestamp: new Date().toISOString(),
      };
      
      // Persist reading to localStorage - makes it immune to language changes
      saveReadingToStorage(readingResult, sessionKey);
      
      setResult(readingResult);
      incrementReading(input.readingType as any);
      
    } catch (e) {
      setError('Failed to generate reading');
    } finally {
      setIsLoading(false);
    }
  }, [canRead, incrementReading, region, sessionKey]);
  
  return {
    result,
    isLoading,
    error,
    canRead,
    generateReading,
  };
}