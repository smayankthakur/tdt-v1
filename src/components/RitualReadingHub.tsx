'use client';

import { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, Heart, Briefcase, TrendingUp, Users, Home, Compass } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useReadingFlow } from '@/hooks/useReadingFlow';
import { useReadingStore } from '@/store/reading-store';
import { READING_TYPES, type ReadingType } from '@/store/reading-types';
import { pickCards, SelectedCard } from '@/lib/tarot/logic';
import TarotCardComponent from '@/components/TarotCard';
import { FloatingTextarea } from '@/components/ui/FloatingInput';

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
  { id: 'detailed', label: 'Detailed Reading', emoji: '🔮', icon: Sparkles, color: 'from-purple-500/20 to-blue-500/20' },
  { id: 'yesno', label: 'Yes / No', emoji: '⚡', icon: TrendingUp, color: 'from-yellow-500/20 to-orange-500/20' },
  { id: 'daily', label: 'Aaj ka din', emoji: '☀️', icon: Sparkles, color: 'from-amber-500/20 to-yellow-500/20' },
  { id: 'union', label: 'Union Kab', emoji: '💕', icon: Heart, color: 'from-pink-500/20 to-rose-500/20' },
  { id: 'thirdparty', label: 'Third Party End', emoji: '🚫', icon: Users, color: 'from-red-500/20 to-rose-500/20' },
  { id: 'shaadi', label: 'Shaadi Kab', emoji: '💒', icon: Home, color: 'from-emerald-500/20 to-teal-500/20' },
  { id: 'soulmate', label: 'Soulmate Kab', emoji: '✨', icon: Heart, color: 'from-indigo-500/20 to-purple-500/20' },
  { id: 'baby', label: 'Baby Kab', emoji: '👶', icon: Sparkles, color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'partner', label: 'Partner Feelings', emoji: '💭', icon: Users, color: 'from-violet-500/20 to-purple-500/20' },
  { id: 'spiritual', label: 'Spiritual Journey', emoji: '🧘', icon: Compass, color: 'from-cyan-500/20 to-teal-500/20' },
  { id: 'month', label: 'This Month', emoji: '📅', icon: TrendingUp, color: 'from-green-500/20 to-emerald-500/20' },
  { id: 'universe', label: 'Universe Guidance', emoji: '🌟', icon: Compass, color: 'from-sky-500/20 to-blue-500/20' },
  { id: 'action', label: 'Partner Next Action', emoji: '👁️', icon: Briefcase, color: 'from-amber-500/20 to-orange-500/20' },
  { id: 'relationship', label: 'Relationship (Past-Present-Future)', emoji: '📈', icon: Heart, color: 'from-rose-500/20 to-pink-500/20' },
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

  const { t } = useLanguage();
  const { generateReading, result, isLoading, error } = useReadingFlow();
  const { reset: resetReadingStore, setDeck, setSelectedCardsWithDetails, selectedCardsWithDetails } = useReadingStore();

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

  // Question submission
  const handleQuestionSubmit = () => {
    if (!question.trim() || question.length < 5) return;
    vibrate();

    // Generate card pool based on topic + question (6-9 cards)
    const cardPool = pickCards({
      topic: selectedTopic,
      question: question,
      count: 9, // Show 9 cards for selection
    });

    // Set the deck for this reading (first 9 will be shown)
    setDeck(cardPool.map(sc => sc.card));

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

    generateReading({
      name: 'Seeker',  // Generic name for ritual feel
      question: question,
      readingType: selectedTopic!,
      selectedCards: selectedCardsWithDetails,
    }).then(() => {
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
    setStep('topic-select');
  };

  // Question submission
  const handleQuestionSubmit = () => {
    if (!question.trim() || question.length < 5) return;
    vibrate();

    // Generate card pool based on topic + question (6-9 cards)
    const cardPool = pickCards({
      topic: selectedTopic,
      question: question,
      count: 9, // Show 9 cards for selection
    });

    // Set the deck for this reading (first 9 will be shown)
    const { setDeck } = useReadingStore.getState();
    setDeck(cardPool.map(sc => sc.card));

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

    generateReading({
      name: 'Seeker',  // Generic name for ritual feel
      question: question,
      readingType: selectedTopic!,
    }).then(() => {
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
    setStep('topic-select');
    // Also re-randomize deck on fresh start
    const { setDeck } = useReadingStore.getState();
    const allCards = useReadingStore.getState().deck;
    // Shuffle deck again
    setDeck([...allCards].sort(() => Math.random() - 0.5).slice(0, 9));
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
          />
        );

      case 'suspense':
        return <SuspensePause />;

      case 'card-reveal':
        return (
          <CardReveal
            onComplete={handleCardRevealComplete}
            readingType={selectedTopic!}
            question={question}
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
          Aaj tum kis baare mein clarity chahte ho?
        </h1>
        <p className="text-foreground-secondary max-w-xl mx-auto">
          Inme se woh topic choose karo jo tumhare dil ke kareeb hai…
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
          Jo tumhare mind mein baar baar aa raha hai…
        </h1>
        <p className="text-foreground-secondary text-sm md:text-base">
          Usse likho. Pure dil se likho.
        </p>
      </motion.div>

       <FloatingTextarea
         label="Tumhara sawal"
         value={question}
         onChange={onQuestionChange}
         placeholder="Kya janna chahte ho?"
         maxLength={500}
         autoFocus
       />

      <p className="text-center text-foreground-muted text-sm">
        Jitna clear sawal… utni clear direction
      </p>

      <motion.button
        onClick={onSubmit}
        disabled={!question.trim() || question.length < 5}
        className="w-full py-4 rounded-full bg-gradient-to-r from-red-600 via-[rgb(var(--gold))] to-yellow-400 font-medium tracking-wide text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Continue</span>
        <ArrowRight className="h-5 w-5" />
      </motion.button>

      <button
        onClick={() => window.history.back()}
        className="w-full py-3 text-foreground-secondary hover:text-foreground transition-colors text-center text-sm"
      >
        ← Wapas
      </button>
    </div>
  );
});

QuestionInput.displayName = 'QuestionInput';

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
}: {
  onSelectionComplete: (cards: SelectedCard[]) => void;
  readingType: ReadingType;
  question: string;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const allCards = useReadingStore(state => state.deck);
  const setSelectedCardsWithDetails = useReadingStore(state => state.setSelectedCardsWithDetails);

  // Get 9 random cards from deck
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
      // Get full card objects with metadata
      const selectedCardObjects: SelectedCard[] = displayCards
        .filter(c => newSelection.has(c.id))
        .map((card, idx) => ({
          card,
          position: ['Past', 'Present', 'Future'][idx] || `Position ${idx + 1}`,
          isReversed: Math.random() < 0.2,
          weight: 1,
        }));

      // Save to store
      setSelectedCardsWithDetails(selectedCardObjects);

      setTimeout(() => {
        onSelectionComplete(selectedCardObjects);
      }, 500);
    }
  };

  if (displayCards.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-foreground-secondary">Loading cards…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
          Inme se woh cards chuno jo tumhe attract kar rahe hain…
        </h2>
        <p className="text-foreground-secondary">
          {3 - selectedIds.size} cards baki hain
        </p>
      </motion.div>

      <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-6">
        {displayCards.map((card, index) => {
          const isSelected = selectedIds.has(card.id);
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCardClick(card.id)}
            >
              <TarotCardComponent
                card={card}
                isFlipped={false}
                isSelected={isSelected}
                size="lg"
                showMeaning={false}
              />
            </motion.div>
          );
        })}
      </div>

      {selectedIds.size > 0 && selectedIds.size < 3 && (
        <p className="text-center text-foreground-muted text-sm">
          {selectedIds.size} cards selected — abhi 3 cards chuno total
        </p>
      )}
    </div>
  );
}
    setSelectedIds(newSelection);

    if (newSelection.size === 3) {
      // Get full card objects with metadata
      const selectedCardObjects: SelectedCard[] = displayCards
        .filter(c => newSelection.has(c.id))
        .map((card, idx) => ({
          card,
          position: ['Past', 'Present', 'Future'][idx] || `Position ${idx + 1}`,
          isReversed: Math.random() < 0.2,
          weight: 1,
        }));

      // Save to store
      setSelectedCardsWithDetails(selectedCardObjects);

      setTimeout(() => {
        onSelectionComplete(selectedCardObjects);
      }, 500);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
          Inme se woh cards chuno jo tumhe attract kar rahe hain…
        </h2>
        <p className="text-foreground-secondary">
          {3 - selectedIds.size} cards baki hain
        </p>
      </motion.div>

      <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-6">
        {displayCards.map((card, index) => {
          const isSelected = selectedIds.has(card.id);
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCardClick(card.id)}
            >
              <TarotCardComponent
                card={card}
                isFlipped={false}
                isSelected={isSelected}
                size="lg"
                showMeaning={false}
              />
            </motion.div>
          );
        })}
      </div>

      {selectedIds.size > 0 && selectedIds.size < 3 && (
        <p className="text-center text-foreground-muted text-sm">
          {selectedIds.size} cards selected — abhi 3 cards chuno total
        </p>
      )}
    </div>
  );
}
    setSelectedIds(newSelection);

    if (newSelection.size === 3) {
      // Get full card objects
      const selectedCardObjects = displayCards
        .filter(c => newSelection.has(c.id))
        .map(card => ({
          card,
          position: 'Present',
          isReversed: Math.random() < 0.2,
          weight: 1,
        }));

      setTimeout(() => {
        onSelectionComplete(selectedCardObjects);
      }, 500);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
          Inme se woh cards chuno jo tumhe attract kar rahe hain…
        </h2>
        <p className="text-foreground-secondary">
          {3 - selectedIds.size} cards baki hain
        </p>
      </motion.div>

      <div
        ref={cardSelectRef}
        className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-6"
      >
        {displayCards.map((card, index) => {
          const isSelected = selectedIds.has(card.id);
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCardClick(card.id)}
            >
              <TarotCardComponent
                card={card}
                isFlipped={false}
                isSelected={isSelected}
                size="lg"
                showMeaning={false}
              />
            </motion.div>
          );
        })}
      </div>

      {selectedIds.size > 0 && selectedIds.size < 3 && (
        <p className="text-center text-foreground-muted text-sm">
          {selectedIds.size} cards selected — 3 cards chuno total
        </p>
      )}
    </div>
  );
}

// ========== STEP 6: SUSPENSE PAUSE ==========
function SuspensePause() {
  return (
    <div className="text-center py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex rounded-full p-8 bg-purple-900/20 mb-8 border-2 border-purple-500/30"
      >
        <Sparkles className="h-16 w-16 text-gold animate-pulse" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-2xl md:text-4xl text-foreground leading-relaxed max-w-xl mx-auto"
      >
        "Jo tumne choose kiya hai… woh random nahi hota"
      </motion.p>
    </div>
  );
}

// ========== STEP 7: CARD REVEAL ==========
function CardReveal({
  onComplete,
  readingType,
  question,
}: {
  onComplete: () => void;
  readingType: ReadingType;
  question: string;
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

  const getRevealMessage = () => {
    const messages = REVEAL_MESSAGES;
    return messages[currentCardIndex % messages.length];
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
              {getRevealMessage()}
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

// ========== STEP 9: READING DELIVERY ==========
function ReadingDelivery({
  result,
  onStartOver,
}: {
  result: any;
  onStartOver: () => void;
}) {
  const fullText = result.reading || "Jo tum pooch rahe ho… usme confusion hai, par direction clear ho rahi hai.";
  const [displayedText, setDisplayedText] = useState('');
  const [showGuidance, setShowGuidance] = useState(false);
  const [showClosing, setShowClosing] = useState(false);

  // Streaming effect
  useEffect(() => {
    let mounted = true;
    const words = fullText.split(/(\s+)/);
    let index = 0;

    const interval = setInterval(() => {
      if (index < words.length && mounted) {
        setDisplayedText(prev => prev + words[index]);
        index++;
      } else if (mounted) {
        clearInterval(interval);
        setTimeout(() => setShowGuidance(true), 1000);
        setTimeout(() => setShowClosing(true), 3000);
      }
    }, 40);

    return () => { mounted = false; clearInterval(interval); };
  }, [fullText]);

  return (
    <div className="space-y-8">
      {/* Personal Opening */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex rounded-full p-3 bg-gold/10 mb-4"
        >
          <Sparkles className="h-6 w-6 text-gold" />
        </motion.div>
        <p className="text-gold font-medium mb-2">{result.greeting}</p>
      </motion.div>

      {/* Main Reading - Streaming */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-6 md:p-8 rounded-2xl bg-surface/50 border border-gold/20 backdrop-blur-sm"
      >
        <div className="font-serif text-lg md:text-xl text-foreground leading-relaxed whitespace-pre-wrap">
          {displayedText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-5 bg-gold ml-1 align-middle"
          />
        </div>
      </motion.div>

      {/* Card-wise Interpretation */}
      {showGuidance && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gold/5 border border-gold/30"
        >
          <h3 className="font-heading text-lg text-gold mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Tumhare cards yeh keh rahe hain:
          </h3>
          <p className="text-foreground leading-relaxed">
            {result.guidance}
          </p>
        </motion.div>
      )}

      {/* Closing */}
      {showClosing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <p className="font-serif text-xl md:text-2xl text-foreground-secondary leading-relaxed">
            "Ab jo next step hai… woh tum already feel kar rahe ho."
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartOver}
              className="px-6 py-3 rounded-xl border border-gold/30 text-foreground hover:border-gold/50 transition-all"
            >
              Phir se shuru karein
            </button>
            <button
              onClick={() => window.location.href = '/premium'}
              className="px-6 py-3 rounded-xl bg-gold-gradient text-black font-semibold hover:opacity-90 transition-opacity"
            >
              Full Access 🔓
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
