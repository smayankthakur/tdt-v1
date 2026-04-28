'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Briefcase, Target, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useReadingFlow } from '@/store/reading-store';
import Button from '@/components/ui/button';
import FloatingTextarea from '@/components/ui/FloatingInput';
import { TarotCard } from '@/components/TarotCard';
import { Select } from '@/components/ui/select';

const POSITION_LABELS = {
  past: 'Past Foundation',
  present: 'Current Challenge',
  future: 'Career Trajectory',
};

export default function TarotReadingJobFlow() {
  const [step, setStep] = useState<RitualStep>('topic-select');
  const [selectedTopic, setSelectedTopic] = useState<ReadingType | null>(null);
  const [question, setQuestion] = useState('');
  const [userName, setUserName] = useState('');
  const [shuffleMessage, setShuffleMessage] = useState('');
  const [domainAnalysis, setDomainAnalysis] = useState<DomainAnalysis | null>(null);
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);
  
  const { t, language } = useLanguage();
   
  const { startReading, reset: resetFlow, isActive, isLoading, stage, content, error, hasError } = useTarotReading();
   const { reset: resetStore, setDeck, setSelectedCardsWithDetails } = useReadingStore();

   // Shuffle animation message rotator
  useEffect(() => {
    if (step !== 'shuffle') return;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % SHUFFLE_MESSAGES.length;
      setShuffleMessage(SHUFFLE_MESSAGES[idx]);
    }, 800);
    return () => clearInterval(interval);
  }, [step]);

  const handleTopicSelect = (topic: ReadingType) => {
    vibrate();
    setSelectedTopic(topic);
    setStep('intention-lock');
    setTimeout(() => setStep('question-input'), 1500);
  };

  const handleQuestionSubmit = async () => {
    if (!question.trim() || question.length < 5 || isActive) return;
    vibrate();

    // Auto-detect language if question long enough
    if (question.length > 10) {
      // Language detection no longer needed - handled globally
    }

    // Analyze intent and generate card pool
    const analysis = analyzeIntent(question, selectedTopic || undefined);
    setDomainAnalysis(analysis);

    const { cards } = generateCardSet({
      question,
      readingType: selectedTopic || 'general',
      timestamp: Date.now(),
      sessionId: sessionId.current,
      count: 9,
    });

    setDeck(cards);
    setStep('shuffle');

    // After shuffle, proceed to card selection
    setTimeout(() => {
      setStep('card-select');
    }, 3000);
  };

  const handleCardSelectionComplete = (selectedCards: SelectedCard[]) => {
    setStep('processing'); // Transition to processing state
  };

  const handleCardSelectionConfirmed = async () => {
    if (isActive) return;

    const { selectedCardsWithDetails } = useReadingStore.getState();
    const finalUserName = userName.trim() || 'Seeker';

    try {
      await startReading({
        question,
        userName: finalUserName,
        language,
        readingType: selectedTopic!,
        cards: selectedCardsWithDetails,
      });

      // Reading started, wait for streaming events...
      // The state will update via SSE/polling
    } catch (err: any) {
      console.error('[Reading start error]', err);
      setStep('error');
    }
  };

  // Monitor reading state changes to transition stages
  useEffect(() => {
    if (stage === 'complete' && step === 'processing') {
      setStep('reading-delivery');
    } else if (hasError && step !== 'error') {
      setStep('error');
    }
  }, [stage, hasError, step]);

  const handleStartOver = () => {
    resetFlow();
    resetStore();
    setSelectedTopic(null);
    setQuestion('');
    setUserName('');
    setDomainAnalysis(null);
    setStep('topic-select');
  };

  const handleRetry = () => {
    resetFlow();
    setStep('card-select'); // Go back to card selection to retry
  };

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
        return <ShuffleAnimation message={shuffleMessage} />;
      
      case 'card-select':
        return (
          <CardSelection
            onSelectionComplete={handleCardSelectionComplete}
            onConfirm={handleCardSelectionConfirmed}
            readingType={selectedTopic!}
            question={question}
            analysis={domainAnalysis}
            sessionId={sessionId.current}
            isProcessing={isActive}
          />
        );
      
      case 'processing':
        return <ProcessingState onConfirm={handleCardSelectionConfirmed} isActive={isActive} />;
      
      case 'reading-delivery':
        return (
          <ReadingDelivery
            content={content}
            onStartOver={handleStartOver}
          />
        );
      
      case 'error':
        return (
          <ErrorFallback
            error={error || 'Something went wrong'}
            onRetry={handleRetry}
            onStartOver={handleStartOver}
          />
        );
      
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex rounded-full p-4 bg-gold/10 mb-6">
          <Sparkles className="h-8 w-8 text-gold" />
        </motion.div>
        <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-4">{t('ritualHub.topicSelect.title')}</h1>
        <p className="text-foreground-secondary max-w-xl mx-auto">{t('ritualHub.topicSelect.subtitle')}</p>
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
                <motion.div className="text-4xl mb-3" whileHover={{ scale: 1.2, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                  {topic.emoji}
                </motion.div>
                <h3 className="font-medium text-foreground text-sm md:text-base group-hover:text-gold transition-colors">{topic.label}</h3>
              </div>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'radial-gradient(circle at center, rgba(244,197,66,0.15) 0%, transparent 70%)', filter: 'blur(10px)' }}
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
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex rounded-full p-6 bg-gold/10 mb-8">
        <Sparkles className="h-12 w-12 text-gold animate-pulse" />
      </motion.div>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-2xl md:text-3xl text-foreground leading-relaxed max-w-xl mx-auto">
        {t('ritualHub.intentionLock.message')}
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-foreground-secondary mt-6">
        {t('ritualHub.intentionLock.topicLabel')}: <span className="text-gold font-medium">{topicLabel}</span>
      </motion.p>
    </div>
  );
}

// ========== STEP 3: QUESTION INPUT ==========
function QuestionInput({ question, onQuestionChange, onSubmit, userName, onUserNameChange }: {
  question: string;
  onQuestionChange: (q: string) => void;
  onSubmit: () => void;
  userName: string;
  onUserNameChange: (name: string) => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex rounded-full p-4 bg-gold/10 mb-6"><Sparkles className="h-8 w-8 text-gold" /></div>
        <h1 className="font-heading text-2xl md:text-3xl text-foreground mb-2">{t('ritualHub.question.title')}</h1>
        <p className="text-foreground-secondary text-sm md:text-base">{t('ritualHub.question.subtitle')}</p>
      </motion.div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 text-center">{t('readingForm.name')}</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => onUserNameChange(e.target.value)}
            placeholder={t('readingForm.namePlaceholder')}
            maxLength={50}
            className="w-full px-5 py-4 rounded-2xl bg-[#0B0F1A] border border-[#2A2F3A] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 outline-none transition-all text-white placeholder:text-gray-400 text-center"
            autoFocus
          />
          {!userName.trim() && <p className="text-center text-amber-400 text-sm mt-2">{t('readingForm.nameError')}</p>}
        </div>

        <FloatingTextarea
          label={t('ritualHub.question.label')}
          value={question}
          onChange={onQuestionChange}
          placeholder={t('ritualHub.question.placeholder')}
          maxLength={500}
        />
      </div>

      <p className="text-center text-foreground-muted text-sm">{t('ritualHub.question.hint')}</p>

      <div className="pt-4">
        <Button size="lg" className="w-full" onClick={onSubmit} disabled={!question.trim() || question.length < 5 || !userName.trim()}>
          <span>{t('ritualHub.question.submit')}</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="pt-2">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="w-full">{t('ritualHub.question.back')}</Button>
      </div>
    </div>
  );
}

// ========== STEP 4: SHUFFLE ANIMATION ==========
function ShuffleAnimation({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="text-center space-y-8">
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
              transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
              style={{ left: `${20 + (i % 3) * 30}%`, top: `${20 + Math.floor(i / 3) * 40}%` }}
            />
          ))}
        </div>
        <motion.p key={message} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="font-serif text-2xl md:text-3xl text-foreground">
          {message}
        </motion.p>
        <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto" />
      </div>
    </div>
  );
}

// ========== STEP 5: CARD SELECTION ==========
function CardSelection({
  onSelectionComplete,
  onConfirm,
  readingType,
  question,
  analysis,
  sessionId,
  isProcessing,
}: {
  onSelectionComplete: (cards: SelectedCard[]) => void;
  onConfirm: () => void;
  readingType: ReadingType;
  question: string;
  analysis: DomainAnalysis | null;
  sessionId: string;
  isProcessing: boolean;
}) {
  const { t, language } = useLanguage();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const allCards = useReadingStore(state => state.deck);
  const setSelectedCardsWithDetails = useReadingStore(state => state.setSelectedCardsWithDetails);

  const displayCards = allCards.length > 0 ? allCards.slice(0, 9) : [];

  const handleCardClick = (cardId: string) => {
    if (isProcessing) return;
    vibrate();
    const newSelection = new Set(selectedIds);
    if (newSelection.has(cardId)) {
      newSelection.delete(cardId);
    } else if (newSelection.size < 3) {
      newSelection.add(cardId);
    }
    setSelectedIds(newSelection);

    if (newSelection.size === 3) {
      const selectedCardObjects = finalizeReadingCards(
        Array.from(newSelection),
        displayCards,
        analysis!,
        undefined,
        sessionId
      );
      recordReadingSelection(undefined, sessionId, selectedCardObjects.map(sc => ({ cardId: sc.card.id, timestamp: Date.now(), position: sc.position })));
      setSelectedCardsWithDetails(selectedCardObjects);
      setTimeout(() => onSelectionComplete(selectedCardObjects), 600);
    }
  };

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
    return t(keyMap[domain] || 'ritualHub.intent.general');
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-2">{t('ritualHub.cardSelect.title')}</h2>
        <p className="text-foreground-secondary text-sm md:text-base leading-relaxed max-w-lg mx-auto">{getIntentMessage()}</p>
        {analysis && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-3 text-xs text-purple-400/60">
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
              {isSelected && (
                <motion.div layoutId="selectedGlow" className="absolute inset-0 rounded-2xl bg-purple-500/20 blur-xl -z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />
              )}
                <TarotCard
                  card={card}
                  isFlipped={false}
                  isSelected={isSelected}
                  size="lg"
                  showMeaning={false}
                />
              {isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
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
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
            {isProcessing ? 'Starting your reading...' : t('ritualHub.cardSelect.complete')}
          </Button>
        </div>
      )}
    </div>
  );
}

// ========== STEP 6: PROCESSING STATE ==========
function ProcessingState({ onConfirm, isActive }: { onConfirm: () => void; isActive: boolean }) {
  const { t } = useLanguage();

  useEffect(() => {
    // Auto-trigger reading start on this step
    onConfirm();
  }, []);

  return (
    <div className="text-center py-20">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [1, 1.1, 1], opacity: 1 }}
        transition={{ duration: 2, repeat: Infinity }}
        className="inline-flex rounded-full p-8 bg-purple-900/20 mb-8 border-2 border-purple-500/30"
      >
        <Sparkles className="h-16 w-16 text-gold animate-pulse" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-2xl md:text-4xl text-foreground leading-relaxed max-w-xl mx-auto mb-6"
      >
        The cards are whispering...
      </motion.p>
      <p className="text-foreground-secondary">
        {isActive ? 'Your reading is being prepared by the universe...' : 'Connecting to the cosmic stream...'}
      </p>
      <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto mt-6" />
    </div>
  );
}

// ========== STEP 7: READING DELIVERY ==========
function ReadingDelivery({ content, onStartOver }: { content: string; onStartOver: () => void }) {
  const { t } = useLanguage();
  const [streamComplete, setStreamComplete] = useState(false);

  // Split content into lines for streaming effect - memoized to prevent re-creation
  const lines = useMemo(() => 
    content.split('\n').filter(l => l.trim().length > 0),
    [content]
  );

  // Stable callback to avoid StreamingOutput effect re-run
  const handleComplete = useCallback(() => {
    setStreamComplete(true);
  }, []);

  return (
    <div className="space-y-8 relative">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="p-6 md:p-8 rounded-2xl bg-surface/50 border border-gold/20 backdrop-blur-sm">
        <StreamingOutput lines={lines} onComplete={handleComplete} startDelay={0} />
      </motion.div>

      {streamComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" size="md" onClick={onStartOver}>Start Another Reading</Button>
        </motion.div>
      )}

      {/* Watermark */}
      <Watermark />
    </div>
  );
}

// Helper function to track card selection for repetition control
function recordReadingSelection(userId: string | undefined, sessionId: string, selections: any[]) {
  // In production, send to analytics/backend
  console.log('[Selection]', { userId, sessionId, selections });
}
