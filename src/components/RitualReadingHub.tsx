'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, Heart, Briefcase, TrendingUp, Users, Home, Compass } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAutoLanguage } from '@/hooks/useAutoLanguage';
import { useReadingFlow } from '@/hooks/useReadingFlow';
import { useReadingStore } from '@/store/reading-store';
import { useFunnelStore } from '@/store/funnel-store';
import { READING_TYPES, type ReadingType } from '@/store/reading-types';
import { SelectedCard } from '@/lib/tarot/logic';
import { generateCardSet, analyzeIntent, recordReadingSelection, finalizeReadingCards, type DomainAnalysis } from '@/lib/cardEngine';
import Button from '@/components/ui/button';
import TarotCardComponent from '@/components/TarotCard';
import { FloatingTextarea } from '@/components/ui/FloatingInput';
import StreamingOutput from './StreamingOutput';

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

const SHUFFLE_MESSAGES = [
  "Thoda ruk jao…",
  "Energy align ho rahi hai…",
  "Jo aana hai… woh aa raha hai…",
  "Cards bat rahe hain tumhare liye…",
  "Signal pakad rahe hain…",
];

const REVEAL_MESSAGES = [
  "Yeh pehla signal hai…",
  "Ab jo aa raha hai woh important hai…",
  "Dekho kya hidden hai…",
  "Energy clear ho rahi hai…",
  "Jo tum dhundh rahe the woh yahi hai…",
];

// Micro-interaction: vibration effect
const vibrate = () => {
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
};

export default function RitualReadingHub() {
  const [step, setStep] = useState<RitualStep>('topic-select');
  const [selectedTopic, setSelectedTopic] = useState<ReadingType | null>(null);
  const [question, setQuestion] = useState('');
  const [shuffleMessage, setShuffleMessage] = useState('');
  const [loadingText, setLoadingText] = useState('Bas dekhte hain kya aa raha hai…');
  const [sessionId] = useState(() => generateSessionId());
  const [domainAnalysis, setDomainAnalysis] = useState<DomainAnalysis | null>(null);

  const { t } = useLanguage();
  const { handleUserInput } = useAutoLanguage();
  const { generateReading, result, isLoading, error } = useReadingFlow();
  const { reset: resetReadingStore, setDeck, setSelectedCardsWithDetails, selectedCardsWithDetails } = useReadingStore();
  const { setCurrentStage, setQuestion: setFunnelQuestion, incrementReadingCount } = useFunnelStore();

  useEffect(() => {
    if (step === 'topic-select') setCurrentStage('input');
    else if (step === 'card-select') setCurrentStage('selection');
    else if (step === 'reading-delivery') setCurrentStage('reading');
  }, [step, setCurrentStage]);

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

  // Question submission - with auto language detection
  const handleQuestionSubmit = async () => {
    if (!question.trim() || question.length < 5) return;
    vibrate();

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
      msgIndex = (msgIndex + 1) % SHUFFLE_MESSAGES.length;
      setShuffleMessage(SHUFFLE_MESSAGES[msgIndex]);
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
    setLoadingText('Jo tum pooch rahe ho… uski clarity aa rahi hai…');

    // Use the selected cards from store
    const { selectedCardsWithDetails } = useReadingStore.getState();

    generateReading({
      name: 'Seeker',
      question: question,
      readingType: selectedTopic!,
      selectedCards: selectedCardsWithDetails,
      domainAnalysis: domainAnalysis!,
    }).then(() => {
      incrementReadingCount();
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
    setDomainAnalysis(null);
    setStep('topic-select');
    // No need to manually set deck - fresh reading will generate new cards
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
          />
        );

      case 'shuffle':
        return (
          <ShuffleAnimation
            message={shuffleMessage}
            messages={SHUFFLE_MESSAGES}
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
        return <ReadingDelivery result={result!} onStartOver={handleStartOver} />;

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
        Theek hai… focus wahi ja raha hai
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-foreground-secondary mt-6"
      >
        Topic: <span className="text-gold font-medium">{topicLabel}</span>
      </motion.p>
    </div>
  );
}

// ========== STEP 3: GUIDED QUESTION ==========
function QuestionInput({
  question,
  onQuestionChange,
  onSubmit,
}: {
  question: string;
  onQuestionChange: (q: string) => void;
  onSubmit: () => void;
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

       <FloatingTextarea
         label="Tumhara sawal"
         value={question}
         onChange={onQuestionChange}
         placeholder={t('ritualHub.question.placeholder')}
         maxLength={500}
         autoFocus
       />

      <p className="text-center text-foreground-muted text-sm">
        {t('ritualHub.question.hint')}
      </p>

      <div className="pt-4">
        <Button 
          size="lg" 
          className="w-full"
          onClick={onSubmit}
          disabled={!question.trim() || question.length < 5}
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
    const { t } = useLanguage();
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
      const emotion = analysis.emotionalTone;

      const messages: Record<string, string> = {
        love: "Tumhare dil ke baare mein jo baar baar soch rahe ho… woh energy inme hai. Jo cards tumhe attract kar rahe hain, woh tumhare pyaar ki energy se connected hain.",
        career: "Tumhare professional life ka sawal tumhare mann mein chal raha hai. Jo cards tum feel kar rahe ho, woh tumhari career ki energy reflect kar rahe hain.",
        finance: "Tum financial clarity chahte ho. Jo cards attract kar rahe hain, woh tumhare money matters ke signals lae rahe hain.",
        conflict: "Tension ya conflict jo tum feel kar rahe ho… uski energy cards mein dikh rahi hai. Jo chuno, woh meaningful hai.",
        action: "Kya karna chahiye? Tumhara internal signal har card mein hai. Jo attract kar raha hai, woh tumhara next step indication kar raha hai.",
        spiritual: "Tum spiritual clarity dhundh rahe ho. Jo cards tumhe pull kar rahe hain, woh universe ke messages lae rahe hain.",
        general: "Tumhare question ki energy tumhare saath hai. Jo cards chuno, woh tumhare liye meaningful signals hain.",
      };

      return messages[domain] || messages.general;
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
            {t('ritualHub.cardSelect.selectionMessage', { count: selectedIds.size, remaining: 3 - selectedIds.size })}
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

    const messages: Record<string, string> = {
      love: "Jo tumne select kiye… woh tumhare pyaar ke signals hain. Ab dekhte hain kya keh rahe hai.",
      career: "Tumhare career ki energy select hui hai. Thoda or wait karo… clarity aa rahi hai.",
      finance: "Financial signals card mein capture huye hain. Ab signal clear ho raha hai…",
      conflict: "Conflict ki energy capture hui hai. Dekhte hain kya nature ke paas kehna hai.",
      action: "Tumhara next step card mein chhupa hai… bas thoda or wait karo.",
      spiritual: "Universe ke messages tumhare cards mein hai. Ab unhe decode kar rahe hain…",
      general: "Jo tumne choose kiya… woh tumhare question ke liye meaningful hai. Ab dekhte hain kya bataya ja raha hai.",
    };

    return messages[domain.primaryDomain] || messages.general;
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
  const [revealState, setRevealState] = useState<'idle' | 'flipping' | 'done'>('idle');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const selectedCardsDetails = useReadingStore(state => state.selectedCardsWithDetails);

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
    const messages = REVEAL_MESSAGES;
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
            Card {currentCardIndex + 1} of {selectedCards.length} — thoda or wait karo…
          </p>
        )}
      </motion.div>
    </div>
  );
}

// ========== STEP 8: LOADING STATE ==========
function LoadingState({ text }: { text: string }) {
  return (
    <div className="text-center py-20">
      <Loader2 className="h-12 w-12 text-gold animate-spin mx-auto mb-6" />
      <p className="font-serif text-2xl md:text-3xl text-foreground mb-2">
        {text}
      </p>
      <p className="text-foreground-secondary">
        Thoda ruk jao… signals pakad rahe hain
      </p>
    </div>
  );
}

// ========== STEP 9: READING DELIVERY (HUMANIZED, STREAMING) ==========
function ReadingDelivery({
  result,
  onStartOver,
}: {
  result: any;
  onStartOver: () => void;
}) {
  const [streamComplete, setStreamComplete] = useState(false);
  const [showPreStream, setShowPreStream] = useState(true);
  
  // Pre-stream message then start streaming after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreStream(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* Pre-stream message */}
      <AnimatePresence>
        {showPreStream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 md:p-8 rounded-2xl bg-surface/50 border border-gold/20 backdrop-blur-sm text-center"
          >
            <p className="font-serif text-xl md:text-2xl text-foreground/80 leading-relaxed">
              Thoda dhyaan se dekhna… jo aa raha hai woh important hai.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main reading content - streamed */}
      {!showPreStream && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 md:p-8 rounded-2xl bg-surface/50 border border-gold/20 backdrop-blur-sm"
        >
          <StreamingOutput 
            lines={result.streamingLines || [
              result.reading || "Jo tum pooch rahe ho… usme confusion hai, par direction clear ho rahi hai."
            ]}
            onComplete={() => setStreamComplete(true)}
            startDelay={0}
          />
        </motion.div>
      )}

      {/* Guidance Box - appears after stream */}
      {streamComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gold/5 border border-gold/30 shadow-lg shadow-gold/10"
        >
          <h3 className="font-heading text-lg text-gold mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Tumhare cards yeh keh rahe hain:
          </h3>
          <p className="text-foreground leading-relaxed font-serif">
            {result.guidance}
          </p>
        </motion.div>
      )}

      {/* Closing - appears after guidance */}
      {streamComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-6"
        >
          <p className="font-serif text-xl md:text-2xl text-foreground-secondary leading-relaxed">
            &quot;Ab jo next step hai… woh tum already feel kar rahe ho.&quot;
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="md" onClick={onStartOver}>
              Phir se shuru karein
            </Button>
            <Button variant="primary" size="md" onClick={() => window.location.href = '/premium'}>
              Full Access 🔓
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

