'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useReadingLimitStore } from '@/store/reading-types';
import { useLanguage } from '@/hooks/useLanguage';
import type { ReadingType } from '@/store/reading-types';
import { SelectedCard } from '@/lib/tarot/logic';
import { generatePersonalizedReading, cleanReading } from '@/lib/personalizedReadingEngine';
import { useUserStateStore, useDailyTrigger, useStreakSystem } from '@/lib/userStateStore';
import type { DomainAnalysis } from '@/lib/cardEngine';

export interface ReadingResult {
  name: string;
  question: string;
  cards: SelectedCard[];
  reading: string;
  guidance: string;
  nextHook: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  streamingLines: string[];
  language: string;
  timestamp: string;
  meta: {
    streak: number;
    isReturning: boolean;
    personalization: {
      nameUsage: number;
      lineCount: number;
    };
  };
}

interface GenerateInput {
  name: string;
  question: string;
  readingType: ReadingType;
  selectedCards?: SelectedCard[];
  domainAnalysis?: DomainAnalysis;
}

export function useReadingFlow() {
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionKey] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);
  const hasRunRef = useRef(false);

  const { canRead, incrementReading } = useReadingLimitStore();
  const { language } = useLanguage();
  const userState = useUserStateStore();
  const { checkAndIncrementStreak } = useStreakSystem();
  const { getReturnMessage, getStreakMessage } = useDailyTrigger();

  // Track input for regeneration on language change
  const lastInputRef = useRef<GenerateInput | null>(null);
  const lastLanguageRef = useRef(language);

  const reset = useCallback(() => {
    hasRunRef.current = false;
    lastInputRef.current = null;
    setResult(null);
    setIsLoading(false);
    setError(null);
  }, []);

  const generateReading = useCallback(async (input: GenerateInput) => {
    if (hasRunRef.current) {
      console.log('[ReadingFlow] Already running, skipping duplicate call');
      return;
    }
    hasRunRef.current = true;
    lastInputRef.current = input;

    setIsLoading(true);
    setError(null);

    if (!canRead()) {
      setError('Limit reached');
      setIsLoading(false);
      hasRunRef.current = false;
      return;
    }

    try {
      // Simulate processing time for effect
      await new Promise(resolve => setTimeout(resolve, 1500));

      const targetLanguage = language;

      // Check streak before generating
      checkAndIncrementStreak();

      // Build reading input from user state and selected cards
      const userStateData = useUserStateStore.getState();
      const readingInput = {
        name: input.name || 'Seeker',
        question: input.question,
        cards: input.selectedCards?.slice(0, 3) || [],
        contextSummary: input.domainAnalysis ? `${input.domainAnalysis.primaryDomain} - ${input.domainAnalysis.emotionalTone}` : undefined,
        language: targetLanguage as 'en' | 'hi' | 'hinglish',
        emotionalHint: userStateData.lastEmotion,
        userState: {
          lastReading: userStateData.lastReading,
          lastCards: userStateData.lastCards,
          openLoops: userStateData.openLoops
        }
      };

      // Generate personalized reading
      const personalizedOutput = generatePersonalizedReading(readingInput);

      // Clean the reading to remove duplicate lines
      let cleanedReading = cleanReading(personalizedOutput.reading);

      // Extract guidance and closing line (hook) from reading
      const lines = cleanedReading.split('\n');
      let guidance = '';
      let closingLine = '';

       // Find line that contains hook keywords
       const closingIndex = lines.findIndex((line: string) =>
         line.toLowerCase().includes('watch for it') ||
         line.toLowerCase().includes('ignore mat karna') ||
         line.toLowerCase().includes('ready raho') ||
         line.toLowerCase().includes('remember') ||
         line.toLowerCase().includes('keep') ||
         line.toLowerCase().includes('something') ||
         line.toLowerCase().includes('change')
       );

       if (closingIndex !== -1) {
         closingLine = lines[closingIndex];
         lines.splice(closingIndex, 1);
         cleanedReading = lines.join('\n');

         // Extract guidance lines (advice)
         const guidanceLines: string[] = [];
         lines.forEach((line: string) => {
           const lower = line.toLowerCase();
           if (lower.includes('take') ||
               lower.includes('do') ||
               lower.includes('action') ||
               lower.includes('avoid') ||
               lower.includes('stop') ||
               lower.includes('should') ||
               lower.includes('try')) {
             guidanceLines.push(line);
           }
         });
         guidance = guidanceLines.join('. ');
       }

       if (!guidance) {
         guidance = "Trust your intuition and take one small step today.";
       }

       // Build streaming lines for animation
       const allLines = [...lines.filter((l: string) => l.trim().length > 0)];
      if (closingLine) {
        allLines.push(closingLine);
      }

      const streamingLines: string[] = [];
      let currentSegment: string[] = [];

      for (let i = 0; i < allLines.length; i++) {
        const line = allLines[i].trim();
        if (!line) continue;
        currentSegment.push(line);
        if (currentSegment.length >= 2 || i === allLines.length - 1) {
          streamingLines.push(currentSegment.join('. '));
          currentSegment = [];
        }
      }

      // Update user state with this reading
      userState.updateFromReading(readingInput, {
        nextHook: personalizedOutput.nextHook,
        reading: cleanedReading
      });

      // Build meta with streak and return status
      const freshState = useUserStateStore.getState();
      const returnContext = freshState.markReturn();
      const streak = freshState.streak || 0;

      const readingResult: ReadingResult = {
        name: input.name,
        question: input.question,
        cards: input.selectedCards || [],
        reading: cleanedReading,
        guidance,
        nextHook: personalizedOutput.nextHook,
        urgencyLevel: personalizedOutput.urgencyLevel,
        streamingLines,
        language: targetLanguage,
        timestamp: new Date().toISOString(),
        meta: {
          streak,
          isReturning: returnContext.isReturning,
          personalization: {
            nameUsage: personalizedOutput.personalization.nameUsage,
            lineCount: personalizedOutput.personalization.lineCount
          }
        }
      };

      setResult(readingResult);
      incrementReading(input.readingType as any);

    } catch (e) {
      console.error('Reading generation error:', e);
      setError('Failed to generate reading');
      hasRunRef.current = false;
    } finally {
      if (hasRunRef.current) {
        hasRunRef.current = false;
      }
    }
  }, [canRead, incrementReading, language, userState, checkAndIncrementStreak]);

  // Regenerate reading when language changes
  useEffect(() => {
    if (lastLanguageRef.current !== language && lastInputRef.current && result) {
      generateReading(lastInputRef.current);
    }
    lastLanguageRef.current = language;
  }, [language, result, generateReading]);

  const returnMessage = result ? getReturnMessage(result.name, language as any) : null;
  const streakMessage = result ? getStreakMessage(result.name, language as any) : null;

  return {
    result,
    isLoading,
    error,
    canRead,
    generateReading,
    reset,
    returnMessage,
    streakMessage
  };
}
