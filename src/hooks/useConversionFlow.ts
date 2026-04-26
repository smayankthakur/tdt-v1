// ====== CONVERSION-OPTIMIZED READING FLOW ======
// Integrates curiosity gap paywalls with reading generation

import { useState, useCallback, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useUserPlanStore } from '@/lib/store/user-plan-store';
import { useReadingStore } from '@/store/reading-store';
import { checkUserAccess } from '@/lib/access-control';
import { createCuriosityGap, shouldTriggerCuriosityGap } from '@/lib/convert/CuriosityGap';
import { evaluateTriggers } from '@/lib/convert/ConversionTriggers';
import { SelectedCard } from '@/lib/tarot/logic';
import type { DomainAnalysis } from '@/lib/cardEngine';
import { generatePersonalizedReading, cleanReading } from '@/lib/personalizedReadingEngine';
import { useUserStateStore } from '@/lib/userStateStore';
import type { ReadingType } from '@/store/reading-types';

export interface ConversionReadingResult {
  name: string;
  question: string;
  cards: SelectedCard[];
  reading: string;
  preview: {
    fullText: string;
    preview: string;
    isLocked: boolean;
    hook: string;
    cta: string;
    urgency: string;
  } | null;
  guidance: string;
  nextHook: string;
  domainAnalysis: DomainAnalysis | null;
  streamingLines: string[];
  language: string;
  meta: {
    isPremium: boolean;
    engagementScore: number;
    triggerType: string;
    paywallShown: boolean;
  };
}

export function useConversionFlow() {
  const [result, setResult] = useState<ConversionReadingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallData, setPaywallData] = useState<{
    hook: string;
    cta: string;
    urgency: string;
    remainingReads?: number;
  } | null>(null);
  
  const { language } = useLanguage();
  const { plan, isPremium: isPremiumUser } = useUserPlanStore();
  const { setReadingPreview, setShowPaywall: setStorePaywall, setPaywallTrigger } = useReadingStore();

  const hasRunRef = useRef(false);

  const triggerPaywall = useCallback((triggerType: string, context: {
    hook: string;
    cta: string;
    urgency: string;
    remainingReads?: number;
  }) => {
    setShowPaywall(true);
    setStorePaywall(true);
    setPaywallTrigger(triggerType);
    setPaywallData(context);
  }, [setStorePaywall, setPaywallTrigger]);

  const generateReading = useCallback(async (
    input: {
      name: string;
      question: string;
      readingType: ReadingType;
      selectedCards?: SelectedCard[];
      domainAnalysis?: DomainAnalysis;
    }
  ) => {
    if (hasRunRef.current) {
      console.log('[ConversionFlow] Already running');
      return;
    }
    hasRunRef.current = true;
    setIsLoading(true);
    setError(null);
    setShowPaywall(false);
    setPaywallData(null);

    try {
      // Check user access
      const access = await checkUserAccess(null);
      const hasAccess = access.allowed;

      if (!hasAccess) {
        triggerPaywall('daily_limit', {
          hook: access.plan === 'free' 
            ? "You've used your free readings for today."
            : "Your access has expired.",
          cta: "Upgrade to Premium",
          urgency: "Unlock unlimited insights now",
          remainingReads: 0
        });
        setIsLoading(false);
        hasRunRef.current = false;
        return;
      }

      // Calculate engagement score
      const engagementScore = Math.min(1, 
        (input.question?.length || 0) / 150 * 0.5 + 
        (input.selectedCards?.length || 0) / 3 * 0.5
      );

      // Build reading input
      const userStateData = useUserStateStore.getState();
      const readingInput = {
        name: input.name || 'Seeker',
        question: input.question,
        cards: input.selectedCards?.slice(0, 3) || [],
        contextSummary: input.domainAnalysis 
          ? `${input.domainAnalysis.primaryDomain} - ${input.domainAnalysis.emotionalTone}` 
          : undefined,
        language: language as 'en' | 'hi' | 'hinglish',
        emotionalHint: userStateData.lastEmotion,
        userState: {
          lastReading: userStateData.lastReading,
          lastCards: userStateData.lastCards,
          openLoops: userStateData.openLoops
        }
      };

      // Generate personalized reading
      const personalizedOutput = generatePersonalizedReading(readingInput);
      let cleanedReading = cleanReading(personalizedOutput.reading);

      // Extract guidance and closing
      const lines = cleanedReading.split('\n');
      const closingKeywords = [
        'watch for it', 'ignore mat karna', 'ready raho',
        'remember', 'keep', 'something', 'change',
        'next', 'coming', 'shift'
      ];
      
      const closingIndex = lines.findIndex((line: string) =>
        closingKeywords.some(kw => line.toLowerCase().includes(kw))
      );

      let guidance = '';
      let closingLine = '';

      if (closingIndex !== -1) {
        closingLine = lines[closingIndex];
        lines.splice(closingIndex, 1);
        cleanedReading = lines.join('\n');

        const guidanceLines: string[] = [];
        lines.forEach((line: string) => {
          const lower = line.toLowerCase();
          if (/\b(should|must|need to|try|do|avoid|stop|take|action)\b/.test(lower)) {
            guidanceLines.push(line);
          }
        });
        guidance = guidanceLines.slice(0, 3).join(' ');
      }

      if (!guidance) {
        guidance = `Focus on ${input.domainAnalysis?.primaryDomain || 'this situation'}. ` +
          `The cards suggest paying attention to the deeper patterns.`;
      }

      // Extract next hook
      const returnHooks = [
        "This insight is only the beginning...",
        "The pattern is developing — check back tomorrow.",
        "Something more is forming. Return when ready.",
        "Your journey continues. The next card awaits.",
        "The answer evolves. Come back to see how."
      ];
      const nextHook = returnHooks[Math.floor(Math.random() * returnHooks.length)];

      // Build streaming lines
      const streamingLines = cleanedReading
        .split(/[.!?]+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 10)
        .slice(0, 12);

      // === CONVERSION LOGIC: Create curiosity gap for free users ===
      let preview: ConversionReadingResult['preview'] = null;
      const triggerCuriosity = shouldTriggerCuriosityGap(
        input.question.length,
        engagementScore,
        isPremiumUser
      );

      if (!isPremiumUser && triggerCuriosity) {
        const gap = createCuriosityGap(cleanedReading, false);
        preview = {
          fullText: cleanedReading,
          preview: gap.preview,
          isLocked: true,
          hook: gap.hook,
          cta: gap.cta,
          urgency: gap.urgency
        };
        
        // Trigger paywall for curiosity gap
        triggerPaywall('curiosity_gap', {
          hook: gap.hook,
          cta: gap.cta,
          urgency: gap.urgency,
          remainingReads: access.remainingReads
        });
      } else {
        // For premium users or non-triggered, show full
        const gap = createCuriosityGap(cleanedReading, true);
        preview = {
          fullText: cleanedReading,
          preview: gap.preview,
          isLocked: false,
          hook: '',
          cta: '',
          urgency: ''
        };
      }

      const result: ConversionReadingResult = {
        name: input.name,
        question: input.question,
        cards: input.selectedCards?.slice(0, 3) || [],
        reading: cleanedReading,
        preview,
        guidance,
        nextHook,
        domainAnalysis: input.domainAnalysis || null,
        streamingLines,
        language,
        meta: {
          isPremium: isPremiumUser,
          engagementScore,
          triggerType: triggerCuriosity ? 'curiosity_gap' : 'none',
          paywallShown: !isPremiumUser && triggerCuriosity
        }
      };

      setResult(result);
      setReadingPreview(result.preview);

    } catch (err: any) {
      console.error('[ConversionFlow] Error:', err);
      setError(err.message || 'Failed to generate reading');
    } finally {
      setIsLoading(false);
      hasRunRef.current = false;
    }
  }, [language, triggerPaywall, setReadingPreview, isPremiumUser]);

  const reset = useCallback(() => {
    hasRunRef.current = false;
    setResult(null);
    setIsLoading(false);
    setError(null);
    setShowPaywall(false);
    setPaywallData(null);
  }, []);

  return {
    result,
    isLoading,
    error,
    showPaywall,
    paywallData,
    generateReading,
    reset
  };
}