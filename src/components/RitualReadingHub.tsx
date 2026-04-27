'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, Heart, Briefcase, TrendingUp, Users, Home, Compass, Clock, Bell, BellOff } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAutoLanguage } from '@/hooks/useAutoLanguage';
import { useReadingFlow } from '@/hooks/useReadingFlow';
import { useReadingStore } from '@/store/reading-store';
import { useFunnelStore } from '@/store/funnel-store';
import { READING_TYPES, type ReadingType } from '@/store/reading-types';
import { SelectedCard } from '@/lib/tarot/logic';
import { generateCardSet, analyzeIntent, recordReadingSelection, finalizeReadingCards, type DomainAnalysis } from '@/lib/cardEngine';
import { wrapReadingWithBehavior, getPremiumCTA } from '@/lib/behavioral/engine';
import Button from '@/components/ui/button';
import TarotCardComponent from '@/components/TarotCard';
import { FloatingTextarea } from '@/components/ui/FloatingInput';
import StreamingOutput from './StreamingOutput';
import CountdownTimer from './CountdownTimer';
import SoftPaywall from './SoftPaywall';
import ReadingOutput from './ReadingOutput';
import Watermark from '@/components/ui/Watermark';

// Generate simple unique session ID
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

type RitualStep =
  | 'topic-select'
  | 'intention-lock'
  | 'question-input'
  | 'shuffle'
  | 'card-select'
  | 'suspense'
  | 'card-reveal'
  | 'reading-delivery'
  | 'loading-result';

interface TopicCard {
  id: ReadingType;
  label: string;
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const TOPIC_CARDS: TopicCard[] = [
  { id: 'love', label: 'Love', emoji: '💕', icon: Heart, color: 'from-pink-500/20 to-rose-500/20' },
  { id: 'career', label: 'Career', emoji: '💼', icon: Briefcase, color: 'from-amber-500/20 to-orange-500/20' },
  { id: 'finance', label: 'Finance', emoji: '💰', icon: TrendingUp, color: 'from-emerald-500/20 to-teal-500/20' },
  { id: 'marriage', label: 'Marriage', emoji: '💒', icon: Home, color: 'from-purple-500/20 to-violet-500/20' },
  { id: 'no_contact', label: 'No Contact', emoji: '🔇', icon: Users, color: 'from-red-500/20 to-rose-500/20' },
  { id: 'general', label: 'General', emoji: '🔮', icon: Sparkles, color: 'from-blue-500/20 to-cyan-500/20' },
];

const getShuffleMessages = (t: (key: string) => string) => {
  const msgs = t('ritualHub.shuffle');
  if (Array.isArray(msgs)) return msgs;
  // Fallback if translation system doesn't support array values
  return [
    "Just a moment...",
    "Aligning energy...",
    "What's meant to come...",
    "The cards are speaking...",
    "Catching signals...",
  ];
};

const getRevealMessages = (t: (key: string) => string) => {
  const msgs = t('ritualHub.reveal');
  if (Array.isArray(msgs)) return msgs;
  // Fallback if translation system doesn't support array values
  return [
    "This is the first sign...",
    "What's coming is important...",
    "Look at what's hidden...",
    "Energy is clearing...",
    "This is what you've been seeking...",
  ];
};

// Micro-interaction: vibration effect
const vibrate = () => {
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
};

interface RitualReadingHubProps {
  userId?: string | null;
}

export default function RitualReadingHub({ userId: propUserId }: RitualReadingHubProps) {
  const [step, setStep] = useState<RitualStep>('topic-select');
  const [selectedTopic, setSelectedTopic] = useState<ReadingType | null>(null);
  const [question, setQuestion] = useState('');
  const [userName, setUserName] = useState('');
  const [shuffleMessage, setShuffleMessage] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [sessionId] = useState(() => generateSessionId());
  const [domainAnalysis, setDomainAnalysis] = useState<DomainAnalysis | null>(null);
  const [behavioralWrap, setBehavioralWrap] = useState<import('@/lib/behavioral/engine').BehavioralWrap | null>(null);
  const [showPremiumTrigger, setShowPremiumTrigger] = useState(false);
  const [reminderOptIn, setReminderOptIn] = useState(false);
  const [internalUserId, setInternalUserId] = useState<string | null>(propUserId || null);

  // Sync prop changes
  useEffect(() => {
    if (propUserId !== undefined) {
      setInternalUserId(propUserId);
    }
  }, [propUserId]);
  const questionStartTime = useRef<number>(0);
  const questionEdits = useRef<number>(0);

  // Check saved reminder preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('tarot_daily_reminder');
    if (saved === 'true') {
      setReminderOptIn(true);
    }
  }, []);

   const { t, language, isHydrated } = useLanguage();
  const shuffleMessages = getShuffleMessages(t);
  const revealMessages = getRevealMessages(t);
  const { handleUserInput } = useAutoLanguage();
   const { generateReading, result, isLoading, error, reset: resetReadingFlow, returnMessage, streakMessage } = useReadingFlow();
  const { reset: resetReadingStore, setDeck, setSelectedCardsWithDetails, selectedCardsWithDetails } = useReadingStore();
  const { setCurrentStage, setQuestion: setFunnelQuestion, incrementReadingCount } = useFunnelStore();

  useEffect(() => {
    if (step === 'topic-select') setCurrentStage('input');
    else if (step === 'card-select') setCurrentStage('selection');
    else if (step === 'reading-delivery') setCurrentStage('reading');
  }, [step, setCurrentStage]);

   // Update loading text when language changes
   useEffect(() => {
     setLoadingText(t('reading.loading'));
   }, [language, t]);

   // Track question engagement
   useEffect(() => {
     if (step === 'question-input') {
       questionStartTime.current = Date.now();
       questionEdits.current = 0;
     }
   }, [step]);

   // Track question edits as engagement
   useEffect(() => {
     if (step === 'question-input') {
       questionEdits.current += 1;
     }
   }, [question, step]);

  // Topic selection handler
  const handleTopicSelect = (topic: ReadingType) => {
    vibrate();
    setSelectedTopic(topic);

    // Intention lock phase
    setStep('intention-lock');

    setTimeout(() => {
      setStep('question-input');
    }, 1500);
  };

  // Question submission - with auto language detection + engagement tracking
  const handleQuestionSubmit = async () => {
    if (!question.trim() || question.length < 5) return;
    vibrate();

    // Track engagement metrics
    const timeSpent = Date.now() - questionStartTime.current;
    const hesitationScore = questionEdits.current > 2 ? 0.7 : timeSpent > 30000 ? 0.6 : 0.2;
    const questionDepth: 'surface' | 'medium' | 'deep' = question.length > 100 ? 'deep' : question.length > 50 ? 'medium' : 'surface';

    // Store metrics in funnel store for later use
    const { setQuestionDepth, setHesitationScore } = useFunnelStore.getState();
    setQuestionDepth(questionDepth);
    setHesitationScore(hesitationScore);

    // Store name in reading store
    useReadingStore.getState().setUserName(userName.trim());

    // Auto-detect language from user's question
    if (question.length > 10) {
      handleUserInput(question);
    }

    // 1. Analyze intent of the question
    const analysis = analyzeIntent(question, selectedTopic || undefined);

    // 2. Generate card pool using ENGINE (seeded, intent-aware)
    const { cards, analysis: cardAnalysis } = generateCardSet({
      question,
      readingType: selectedTopic || 'general',
      timestamp: Date.now(),
      sessionId,
      count: 9, // Show 9 cards for user selection
    });

    // 3. Store analysis - use the engine's analysis for consistency
    setDomainAnalysis(cardAnalysis);

    setFunnelQuestion(question);

    // 4. Set the deck for this reading
    const { setDeck } = useReadingStore.getState();
    setDeck(cards);

    setStep('shuffle');

    // Shuffle messages rotation
    let msgIndex = 0;
    const shuffleInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % shuffleMessages.length;
      setShuffleMessage(shuffleMessages[msgIndex]);
    }, 800);

    // After shuffle, proceed to card selection
    setTimeout(() => {
      clearInterval(shuffleInterval);
      setStep('card-select');
    }, 3000);
  };

  // Card selection complete
  const handleCardSelectionComplete = (selectedCards: SelectedCard[]) => {
    // Suspense pause
    setStep('suspense');

    setTimeout(() => {
      // Proceed to reveal (cards flip sequentially)
      setStep('card-reveal');
    }, 1500);
  };

   // Card reveal complete - generate reading
   const handleCardRevealComplete = () => {
     // Generate the reading with emotional pacing
     setStep('loading-result');
     setLoadingText(t('ritualHub.loadingMessage'));

     // Get tracking data
     const timeSpent = Date.now() - questionStartTime.current;
     const questionDepth: 'surface' | 'medium' | 'deep' = question.length > 100 ? 'deep' : question.length > 50 ? 'medium' : 'surface';
     const hesitationScore = questionEdits.current > 2 ? 0.7 : timeSpent > 30000 ? 0.6 : 0.2;

      // Pass engagement to funnel store
      const { readingCount, setQuestionDepth, setHesitationScore } = useFunnelStore.getState();
      setQuestionDepth(questionDepth);
      setHesitationScore(hesitationScore);

     // Generate behavioral wrap based on engagement
     const emotion = domainAnalysis?.emotionalTone || 'neutral';
     const wrap = wrapReadingWithBehavior(language, userName.trim(), selectedTopic || 'general', {
       readingCount,
       questionDepth,
       hesitationScore,
       emotionIntensity: hesitationScore > 0.5 ? 'high' : 'medium',
     });
     setBehavioralWrap(wrap);
     setShowPremiumTrigger(wrap.showPremium);

     // Use the selected cards and user name from state/store
     const { selectedCardsWithDetails } = useReadingStore.getState();
     const finalUserName = userName.trim() || 'Seeker';

     generateReading({
       name: finalUserName,
       question: question,
       readingType: selectedTopic!,
       selectedCards: selectedCardsWithDetails,
       domainAnalysis: domainAnalysis!,
     }).then(() => {
       incrementReadingCount();

       // Save reminder preference
       if (reminderOptIn) {
         localStorage.setItem('tarot_daily_reminder', 'true');
       }

       setTimeout(() => {
         setStep('reading-delivery');
       }, 2000);
     });
   };

   // Reset and start over
   const handleStartOver = () => {
     resetReadingStore();
     setSelectedTopic(null);
     setQuestion('');
     setUserName('');
     setDomainAnalysis(null);
     setStep('topic-select');
     // Reset reading flow to allow new reading
     resetReadingFlow();
   };

  // Render individual step
  const renderStep = () => {
    switch (step) {
      case 'topic-select':
        return <TopicSelection onSelect={handleTopicSelect} />;

      case 'intention-lock':
        return <IntentionLock topic={selectedTopic} />;

       case 'question-input':
         return (
           <QuestionInput
             question={question}
             onQuestionChange={setQuestion}
             onSubmit={handleQuestionSubmit}
             userName={userName}
             onUserNameChange={setUserName}
           />
         );

      case 'shuffle':
        return (
          <ShuffleAnimation
            message={shuffleMessage}
            messages={shuffleMessages}
          />
        );

      case 'card-select':
        return (
          <CardSelection
            onSelectionComplete={handleCardSelectionComplete}
            readingType={selectedTopic!}
            question={question}
            analysis={domainAnalysis}
            sessionId={sessionId}
          />
        );

      case 'suspense':
        return <SuspensePause domain={domainAnalysis || undefined} />;

      case 'card-reveal':
        return (
          <CardReveal
            onComplete={handleCardRevealComplete}
            readingType={selectedTopic!}
            question={question}
            domain={domainAnalysis}
          />
        );

      case 'loading-result':
        return <LoadingState text={loadingText} />;

       case 'reading-delivery':
         return <ReadingDelivery result={result!} onStartOver={handleStartOver} reminderOptIn={reminderOptIn} setReminderOptIn={setReminderOptIn} showPremiumTrigger={showPremiumTrigger} userId={internalUserId} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#12121A] to-[#0B0B0F] pt-24 pb-12 md:pt-32 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ========== STEP 1: TOPIC SELECTION ==========
function TopicSelection({ onSelect }: { onSelect: (topic: ReadingType) => void }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex rounded-full p-4 bg-gold/10 mb-6"
        >
          <Sparkles className="h-8 w-8 text-gold" />
        </motion.div>
        <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
          {t('ritualHub.topicSelect.title')}
        </h1>
        <p className="text-foreground-secondary max-w-xl mx-auto">
          {t('ritualHub.topicSelect.subtitle')}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {TOPIC_CARDS.map((topic, index) => {
          const Icon = topic.icon;
          return (
            <motion.button
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onSelect(topic.id)}
              className="group relative p-6 rounded-2xl bg-gradient-to-br bg-surface/50 border border-gold/10 hover:border-gold/40 transition-all duration-300 overflow-hidden text-center"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10">
                <motion.div
                  className="text-4xl mb-3"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {topic.emoji}
                </motion.div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-medium text-foreground text-sm md:text-base group-hover:text-gold transition-colors">
                  {topic.label}
                </h3>
              </div>
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, rgba(244,197,66,0.15) 0%, transparent 70%)',
                  filter: 'blur(10px)'
                }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ========== STEP 2: INTENTION LOCK ==========
function IntentionLock({ topic }: { topic: ReadingType | null }) {
  const { t } = useLanguage();
  const topicLabel = topic ? TOPIC_CARDS.find(t => t.id === topic)?.label : '';

  return (
    <div className="text-center py-20">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex rounded-full p-6 bg-gold/10 mb-8"
      >
        <Sparkles className="h-12 w-12 text-gold animate-pulse" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-2xl md:text-3xl text-foreground leading-relaxed max-w-xl mx-auto"
      >
        {t('ritualHub.intentionLock.message')}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-foreground-secondary mt-6"
      >
        {t('ritualHub.intentionLock.topicLabel')}: <span className="text-gold font-medium">{topicLabel}</span>
      </motion.p>
    </div>
  );
}

// ========== STEP 3: GUIDED QUESTION ==========
function QuestionInput({
  question,
  onQuestionChange,
  onSubmit,
  userName,
  onUserNameChange,
}: {
  question: string;
  onQuestionChange: (q: string) => void;
  onSubmit: () => void;
  userName: string;
  onUserNameChange: (name: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex rounded-full p-4 bg-gold/10 mb-6">
          <Sparkles className="h-8 w-8 text-gold" />
        </div>
        <h1 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
          {t('ritualHub.question.title')}
        </h1>
        <p className="text-foreground-secondary text-sm md:text-base">
          {t('ritualHub.question.subtitle')}
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 text-center">
            {t('readingForm.name')}
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => onUserNameChange(e.target.value)}
            placeholder={t('readingForm.namePlaceholder')}
            maxLength={50}
            className="w-full px-5 py-4 rounded-2xl bg-[#0B0F1A] border border-[#2A2F3A] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 outline-none transition-all text-white placeholder:text-gray-400 text-center"
            autoFocus
          />
          {!userName.trim() && (
            <p className="text-center text-amber-400 text-sm mt-2">
              {t('readingForm.nameError')}
            </p>
          )}
        </div>

        {/* Question Input */}
        <FloatingTextarea
          label={t('ritualHub.question.label')}
          value={question}
          onChange={onQuestionChange}
          placeholder={t('ritualHub.question.placeholder')}
          maxLength={500}
        />
      </div>

      <p className="text-center text-foreground-muted text-sm">
        {t('ritualHub.question.hint')}
      </p>

      <div className="pt-4">
        <Button
          size="lg"
          className="w-full"
          onClick={onSubmit}
          disabled={!question.trim() || question.length < 5 || !userName.trim()}
        >
          <span>{t('ritualHub.question.submit')}</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="pt-2">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="w-full">
          {t('ritualHub.question.back')}
        </Button>
      </div>
    </div>
  );
}

// ========== STEP 4: SHUFFLE ANIMATION ==========
function ShuffleAnimation({ message, messages }: { message: string; messages: string[] }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length);
    }, 800);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="text-center space-y-8">
        {/* Floating cards around */}
        <div className="relative w-64 h-80 mx-auto">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-20 h-28 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl border-2 border-purple-500/30"
              animate={{
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
                rotate: [0, Math.random() * 360 - 180, 0],
                scale: [1, 1.1 + Math.random() * 0.2, 1],
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
              style={{
                left: `${20 + (i % 3) * 30}%`,
                top: `${20 + Math.floor(i / 3) * 40}%`,
              }}
            />
          ))}
        </div>

        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="font-serif text-2xl md:text-3xl text-foreground"
        >
          {messages[msgIndex]}
        </motion.p>

        <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto" />
      </div>
    </div>
  );
}

  // ========== STEP 5: CARD SELECTION ==========
  function CardSelection({
    onSelectionComplete,
    readingType,
    question,
    analysis,
    sessionId,
  }: {
    onSelectionComplete: (cards: SelectedCard[]) => void;
    readingType: ReadingType;
    question: string;
    analysis: DomainAnalysis | null;
    sessionId: string;
  }) {
const { t, language } = useLanguage();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const allCards = useReadingStore(state => state.deck);
    const setSelectedCardsWithDetails = useReadingStore(state => state.setSelectedCardsWithDetails);

    // Get 9 cards from deck
    const displayCards = allCards.length > 0 ? allCards.slice(0, 9) : [];

    const handleCardClick = (cardId: string) => {
      vibrate();
      const newSelection = new Set(selectedIds);
      if (newSelection.has(cardId)) {
        newSelection.delete(cardId);
      } else if (newSelection.size < 3) {
        newSelection.add(cardId);
      }
      setSelectedIds(newSelection);

      if (newSelection.size === 3) {
        // 1. Get the actual card objects for the selected IDs
        const selectedCardObjects = finalizeReadingCards(
          Array.from(newSelection),
          displayCards,
          analysis!,
          undefined, // userId would come from auth in real app
          sessionId
        );

        // 2. Record selection in history for repetition control
        recordReadingSelection(
          undefined, // userId
          sessionId,
          selectedCardObjects.map(sc => ({
            cardId: sc.card.id,
            timestamp: Date.now(),
            position: sc.position,
          }))
        );

        // 3. Save to store
        setSelectedCardsWithDetails(selectedCardObjects);

        // 4. Small pause then proceed
        setTimeout(() => {
          onSelectionComplete(selectedCardObjects);
        }, 600);
      }
    };

    if (displayCards.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-foreground-secondary">{t('common.loading')}</p>
        </div>
      );
    }

    // Intent-aware messaging
    const getIntentMessage = () => {
      if (!analysis) return t('ritualHub.cardSelect.title');

      const domain = analysis.primaryDomain;
      const keyMap: Record<string, string> = {
        love: 'ritualHub.intent.love',
        career: 'ritualHub.intent.career',
        finance: 'ritualHub.intent.finance',
        conflict: 'ritualHub.intent.conflict',
        action: 'ritualHub.intent.action',
        spiritual: 'ritualHub.intent.spiritual',
        no_contact: 'ritualHub.intent.noContact',
        general: 'ritualHub.intent.general',
      };
      const tKey = keyMap[domain] || 'ritualHub.intent.general';
      return t(tKey);
    };

 return (
     <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
            {t('ritualHub.cardSelect.title')}
          </h2>
          <p className="text-foreground-secondary text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            {getIntentMessage()}
          </p>
          {analysis && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-3 text-xs text-purple-400/60"
            >
              Energy detected: {analysis.emotionalTone} • Domain: {analysis.primaryDomain}
            </motion.p>
          )}
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-4">
          {displayCards.map((card, index) => {
            const isSelected = selectedIds.has(card.id);
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleCardClick(card.id)}
                className="relative"
              >
                {/* Visual trust layer: glow and scale on selection */}
                {isSelected && (
                  <motion.div
                    layoutId="selectedGlow"
                    className="absolute inset-0 rounded-2xl bg-purple-500/20 blur-xl -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <TarotCardComponent
                  card={card}
                  isFlipped={false}
                  isSelected={isSelected}
                  size="lg"
                  showMeaning={false}
                />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-xs font-bold">✓</span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {selectedIds.size > 0 && selectedIds.size < 3 && (
          <p className="text-center text-foreground-muted text-sm">
            {t('ritualHub.cardSelect.selectionMessage', { count: selectedIds.size.toString(), remaining: (3 - selectedIds.size).toString() })}
          </p>
        )}

        {selectedIds.size === 3 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-purple-300 font-medium"
          >
            {t('ritualHub.cardSelect.complete')}
          </motion.p>
        )}
      </div>
    );
  }

// ========== STEP 6: SUSPENSE PAUSE ==========
function SuspensePause({ domain }: { domain?: DomainAnalysis }) {
  const { t } = useLanguage();
  
  // Intent-aware suspense messages
  const getSuspenseMessage = () => {
    if (!domain) return t('ritualHub.suspense.default');

    const keyMap: Record<string, string> = {
      love: 'ritualHub.suspense.love',
      career: 'ritualHub.suspense.career',
      finance: 'ritualHub.suspense.finance',
      conflict: 'ritualHub.suspense.conflict',
      action: 'ritualHub.suspense.action',
      spiritual: 'ritualHub.suspense.spiritual',
      general: 'ritualHub.suspense.general',
    };
    const tKey = keyMap[domain.primaryDomain] || 'ritualHub.suspense.general';
    return t(tKey);
  };

  return (
    <div className="text-center py-20">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex rounded-full p-8 bg-purple-900/20 mb-8 border-2 border-purple-500/30"
      >
        <Sparkles className="h-16 w-16 text-gold animate-pulse" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-2xl md:text-4xl text-foreground leading-relaxed max-w-xl mx-auto"
      >
        &quot;{getSuspenseMessage()}&quot;
      </motion.p>

      {domain && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm text-purple-400/60"
        >
          Pattern detected: {domain.emotionalTone} • {domain.primaryDomain}
        </motion.p>
      )}
    </div>
  );
}

// ========== STEP 7: CARD REVEAL ==========
function CardReveal({
  onComplete,
  readingType,
  question,
  domain,
}: {
  onComplete: () => void;
  readingType: ReadingType;
  question: string;
  domain?: DomainAnalysis | null;
}) {
  const { t } = useLanguage();
  const [revealState, setRevealState] = useState<'idle' | 'flipping' | 'done'>('idle');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const selectedCardsDetails = useReadingStore(state => state.selectedCardsWithDetails);
  const revealMessages = getRevealMessages(t);

  // Get the actual card objects from selectedCardsWithDetails
  const selectedCards = selectedCardsDetails.map(sc => sc.card);

  useEffect(() => {
    // Start flipping after brief hover
    const startTimer = setTimeout(() => {
      setRevealState('flipping');
    }, 500);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (revealState !== 'flipping') return;

    if (currentCardIndex < selectedCards.length - 1) {
      const timer = setTimeout(() => {
        setCurrentCardIndex(prev => prev + 1);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      // All cards revealed
      const doneTimer = setTimeout(() => {
        setRevealState('done');
        setTimeout(onComplete, 1500);
      }, 2500);
      return () => clearTimeout(doneTimer);
    }
  }, [currentCardIndex, selectedCards.length, revealState, onComplete]);

  const getRevealMessage = (cardIndex: number, card: any) => {
    const messages = revealMessages;
    // Make message personal to the card if we have domain info
    if (domain && card) {
      return `Card ${cardIndex + 1}: ${card.name} — ${card.keywords?.[0] || 'energy'} ${messages[cardIndex % messages.length].replace('Yeh', 'is card mein').replace('Ab jo aa raha hai', 'energy')}`;
    }
    return messages[cardIndex % messages.length];
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <AnimatePresence mode="wait">
          {currentCardIndex < selectedCards.length && revealState === 'flipping' && (
            <motion.p
              key={currentCardIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="font-serif text-xl md:text-2xl text-gold mb-6 italic"
            >
              {getRevealMessage(currentCardIndex, selectedCards[currentCardIndex])}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Cards stacked for reveal */}
        <div className="flex justify-center gap-4 md:gap-6 relative">
          {selectedCards.map((card, index) => {
            const shouldShow = index <= currentCardIndex;
            const isCurrent = index === currentCardIndex && revealState === 'flipping';
            
            return (
              <motion.div
                key={`${card.id}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: shouldShow ? 1 : 0.3,
                  scale: isCurrent ? 1.05 : 1,
                }}
                transition={{
                  duration: isCurrent ? 1.2 : 0.8,
                  ease: 'easeInOut',
                  delay: isCurrent ? 0.3 : 0,
                }}
                className={`w-32 h-48 md:w-40 md:h-60 ${index > currentCardIndex ? 'opacity-30' : ''}`}
              >
                <TarotCardComponent
                  card={card}
                  isFlipped={shouldShow}
                  size="lg"
                  showMeaning={shouldShow}
                />
              </motion.div>
            );
          })}
        </div>

        {revealState === 'flipping' && currentCardIndex < selectedCards.length && (
          <p className="text-foreground-muted text-sm mt-6 animate-pulse">
            {t('ritualHub.cardReveal.progress', { current: (currentCardIndex + 1).toString(), total: selectedCards.length.toString() })}
          </p>
        )}
      </motion.div>
    </div>
  );
}

// ========== STEP 8: LOADING STATE ==========
function LoadingState({ text }: { text: string }) {
  const { t } = useLanguage();
  return (
    <div className="text-center py-20">
      <Loader2 className="h-12 w-12 text-gold animate-spin mx-auto mb-6" />
      <p className="font-serif text-2xl md:text-3xl text-foreground mb-2">
        {text}
      </p>
      <p className="text-foreground-secondary">
        {t('ritualHub.loadingMessage')}
      </p>
    </div>
  );
}

// ========== COMPONENT: Pre-stream message ==========
function PreStreamMessage() {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 md:p-8 rounded-2xl bg-surface/50 border border-gold/20 backdrop-blur-sm text-center"
    >
      <p className="font-serif text-xl md:text-2xl text-foreground/80 leading-relaxed">
        {t('ritualHub.preStreamText')}
      </p>
    </motion.div>
  );
}

// ========== COMPONENT: Final Interactive Closing Block ==========
function FinalInteractiveBlock({
  onStartOver,
  reminderOptIn,
  setReminderOptIn,
  returnMessage,
  streakMessage,
  getDailyHook,
  showPremiumTrigger,
  readingCount,
}: {
  onStartOver: () => void;
  reminderOptIn: boolean;
  setReminderOptIn: (value: boolean) => void;
  returnMessage: string | null;
  streakMessage: string | null;
  getDailyHook: () => string;
  showPremiumTrigger: boolean;
  readingCount: number;
}) {
  const { t } = useLanguage();

  return (
    <div className="text-center space-y-6 mt-10">

      {/* Hook – Direct, personal */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xl md:text-2xl font-serif text-white/90"
      >
        Before you leave…
      </motion.p>

      {/* Engagement Question */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-lg text-white/80 max-w-lg mx-auto"
      >
        What&apos;s one word that describes how that reading felt to you?
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-sm italic text-white/60 max-w-md mx-auto"
      >
         Don&apos;t think too much. The first thing that came to your mind — that&apos;s the truth.
      </motion.p>

      {/* Behavioral Hook + Timer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="p-6 rounded-xl border border-gold/20 bg-gradient-to-r from-purple-900/20 to-black/30 space-y-4"
      >
        <p className="text-gold font-medium">
          {t('ritualHub.behavioral.dailyHook')}
        </p>

        <p className="text-white/70 text-sm max-w-md mx-auto">
          {getDailyHook()}
        </p>

        <p className="text-white/50 text-xs italic">
          {t('ritualHub.behavioral.timerContext')}
        </p>

        <div className="flex justify-center mt-3">
          <CountdownTimer hours={24} minutes={0} seconds={0} />
        </div>

        {/* Reminder opt-in */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setReminderOptIn(!reminderOptIn)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm ${
              reminderOptIn
                ? 'bg-gold/20 text-gold border border-gold/40'
                : 'bg-surface/50 text-foreground-muted border border-gold/10 hover:border-gold/30'
            }`}
          >
            {reminderOptIn ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            <span>
              {reminderOptIn ? t('ritualHub.reminder.optInActive') : t('ritualHub.reminder.optIn')}
            </span>
          </button>
        </div>

        {/* Return/Streak messages */}
        {returnMessage && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/70 italic text-sm text-center max-w-lg mx-auto"
          >
            {returnMessage}
          </motion.p>
        )}

        {streakMessage && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-amber-400 font-medium text-center text-sm"
          >
            {streakMessage}
          </motion.p>
        )}
      </motion.div>

      {/* Premium Trigger */}
      {showPremiumTrigger && readingCount >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-6"
        >
          <SoftPaywall triggerReason="deep_engagement" />
        </motion.div>
      )}

      {/* CTAs – continuation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={onStartOver}
          className="px-6 py-2 border border-gold rounded-full text-gold hover:bg-gold/10 transition"
        >
          {t('ritualHub.startOver')}
        </button>

        <button
          onClick={() => window.location.href = '/premium'}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 text-black font-semibold shadow-lg hover:shadow-xl transition"
        >
          {t('ritualHub.unlockAccess')}
        </button>
      </motion.div>

      {/* Micro-trust trigger */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-xs text-white/40 italic max-w-sm mx-auto"
      >
        The first thought you had… that&apos;s the answer your mind was trying to show you.
      </motion.p>

    </div>
  );
}

// ========== STEP 9: READING DELIVERY (CLEAN STATE ARCHITECTURE) ==========
function ReadingDelivery({
  result,
  onStartOver,
  reminderOptIn,
  setReminderOptIn,
  showPremiumTrigger,
  userId,
}: {
  result: any;
  onStartOver: () => void;
  reminderOptIn: boolean;
  setReminderOptIn: (value: boolean) => void;
  showPremiumTrigger: boolean;
  userId?: string | null;
}) {
  const [streamText, setStreamText] = useState('');
  const [finalText, setFinalText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const { t, language } = useLanguage();
  const { readingCount } = useFunnelStore();
  const { returnMessage, streakMessage } = useReadingFlow();

  // Get lines for streaming
  const lines = useMemo(() => {
    if (result.streamingLines && result.streamingLines.length > 0) {
      return result.streamingLines;
    }
    return [result.reading || t('ritualHub.readingFallback')];
  }, [result.streamingLines, result.reading, t]);

  // Streaming handler – STRICT REPLACE, NOT APPEND
  const handleStreamChunk = useCallback((chunk: string) => {
    setIsStreaming(true);
    setStreamText(prev => prev + chunk);
  }, []);

  // Stream end – CLEAN STATE SWITCH
  const handleStreamEnd = useCallback(() => {
    setIsStreaming(false);
    setIsComplete(true);

    // CRITICAL: Replace buffer with final text
    setFinalText(result.reading || t('ritualHub.readingFallback'));

    // Clear streaming buffer (prevents duplicate renders)
    setStreamText('');
  }, [result.reading, t]);

  // Display logic – ONLY ONE SOURCE OF TRUTH
  const displayText = isComplete ? finalText : streamText;

  // Generate behavioral hooks after reading completes
  const getDailyHook = (): string => {
    // Use the nextHook from the new reading result if available
    if (result?.nextHook) {
      return result.nextHook;
    }

    // Fallback hooks
    const firstName = result?.name?.split(' ')[0] || 'friend';
    const hooks: Record<string, string[]> = {
      en: [
        `${firstName}, there's an energy shift coming in the next 48 hours. Come back tomorrow — I'll have decoded it for you.`,
        `This isn't the full picture yet. Something's in motion. Return tomorrow and I'll guide you through the next phase.`,
      ],
      hi: [
        `${firstName}, aage 48 hours mein energy shift aa raha hai. Kal wapas aana — main decode kar ke batati hoon.`,
        `Yeh complete picture nahi hai. Kuch chal raha hai. Kal wapas aana, main next phase guide karti hoon.`,
      ],
      hinglish: [
        `${firstName}, next 48 hours mein energy shift aa raha hai. Kal aana — main decode kar ke bataungi.`,
        `Yeh picture incomplete hai. Kuch chal raha hai. Kal wapas aana, next phase guide karti hoon.`,
      ],
    };
    const pool = hooks[language] || hooks.en;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  return (
    <div className="reading-delivery space-y-8 relative">
      {/* Pre-stream message */}
      <PreStreamMessage />

      {/* Main reading content – SINGLE OUTPUT COMPONENT */}
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 md:p-8 rounded-2xl bg-surface/50 border border-gold/20 backdrop-blur-sm"
        >
          <StreamingOutput
            lines={lines}
            onComplete={handleStreamEnd}
            startDelay={0}
          />
        </motion.div>
      )}

      {/* Final rendered text – ONLY SHOWN AFTER COMPLETION */}
      {isComplete && !isStreaming && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 md:p-8 rounded-2xl bg-surface/50 border border-gold/20 backdrop-blur-sm"
        >
          <ReadingOutput text={displayText} />
        </motion.div>
      )}

      {/* Guidance Box – appears after stream completes */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gold/5 border border-gold/30 shadow-lg shadow-gold/10"
        >
          <h3 className="font-heading text-lg text-gold mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {t('ritualHub.guidanceIntro')}
          </h3>
          <p className="text-foreground leading-relaxed font-serif">
            {result.guidance}
          </p>
        </motion.div>
      )}

      {/* ✅ INTERACTIVE CLOSING SECTION – isolated final block */}
      {isComplete && !isStreaming && (
        <FinalInteractiveBlock
          onStartOver={onStartOver}
          reminderOptIn={reminderOptIn}
          setReminderOptIn={setReminderOptIn}
          returnMessage={returnMessage}
          streakMessage={streakMessage}
          getDailyHook={getDailyHook}
          showPremiumTrigger={showPremiumTrigger}
          readingCount={readingCount}
        />
      )}

      {/* WATERMARK */}
      {isComplete && !isStreaming && <Watermark userId={userId} />}
    </div>
  );
}

