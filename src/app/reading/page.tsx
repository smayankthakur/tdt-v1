'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReadingStore } from '@/store/reading-store';
import { useGinniStore } from '@/store/ginni-store';
import { analyzeQuestion, pickCards, getAllCards, TarotCard as TarotCardType, SelectedCard } from '@/lib/tarot/logic';
import EnergyLoader from '@/components/EnergyLoader';
import TarotCardComponent from '@/components/TarotCard';
import CTAButton from '@/components/CTAButton';
import { useTypingEffect } from '@/hooks/useStreamReading';
import { Sparkles, Heart, Briefcase, TrendingUp, Wallet, HelpCircle, Moon, ArrowRight, X } from 'lucide-react';

type ReadingStep = 'entry' | 'topic' | 'cards' | 'question' | 'suspense' | 'reveal' | 'complete';

const TOPICS = [
  { id: 'love', label: 'Love', icon: Heart, description: 'Heart matters & relationships' },
  { id: 'career', label: 'Career', icon: Briefcase, description: 'Work & professional path' },
  { id: 'no_contact', label: 'No Contact', icon: Moon, description: 'Someone who hasn\'t reached out' },
  { id: 'finance', label: 'Finance', icon: Wallet, description: 'Money & abundance' },
  { id: 'general', label: 'General', icon: HelpCircle, description: 'Any question' },
];

const PLACEHOLDERS = [
  "Will they come back?",
  "What's next in my career?",
  "Why am I feeling this way?",
  "What does my future hold?",
  "Should I wait or act?",
];

const SUSPENSE_MESSAGES = [
  { delay: 0, text: "Connecting with your energy..." },
  { delay: 2500, text: "Interpreting the cards you've chosen..." },
  { delay: 5500, text: "Something significant is coming through..." },
];

const REVEAL_MICROCOPY = [
  "This is not random...",
  "Your energy is very clear...",
  "This came through strongly...",
];

export default function ReadingPage() {
  const {
    question,
    selectedCardsWithDetails,
    currentStep: storeStep,
    setQuestion,
    setSelectedCardsWithDetails,
    reset: resetStore,
  } = useReadingStore();

  const { setContext, setTriggerOpen, clearContext } = useGinniStore();

  const [step, setStep] = useState<ReadingStep>('entry');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [deckCards, setDeckCards] = useState<TarotCardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<TarotCardType[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [suspenseMessage, setSuspenseMessage] = useState(SUSPENSE_MESSAGES[0].text);
  const [revealIndex, setRevealIndex] = useState(-1);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [interpretation, setInterpretation] = useState('');
  const [error, setError] = useState('');
  
  const placeholderRef = useRef<NodeJS.Timeout | null>(null);
  const suspenseTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const { displayText, isTyping, startTyping, clearTyping } = useTypingEffect('', 25);

  // Step 0: Entry - 3 second pause before enabling
  useEffect(() => {
    if (step === 'entry') {
      const timer = setTimeout(() => setIsReady(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Initialize deck with shuffled cards
  useEffect(() => {
    const allCards = getAllCards();
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    setDeckCards(shuffled.slice(0, 8));
  }, []);

  // Placeholder rotation for question input
  useEffect(() => {
    if (step === 'question') {
      placeholderRef.current = setInterval(() => {
        setPlaceholderIndex(prev => (prev + 1) % PLACEHOLDERS.length);
      }, 3000);
      return () => {
        if (placeholderRef.current) clearInterval(placeholderRef.current);
      };
    }
  }, [step]);

  // Handle card selection
  const handleCardSelect = (card: TarotCardType) => {
    if (selectedCards.length >= 3) return;
    if (selectedCards.find(c => c.id === card.id)) return;
    
    setSelectedCards([...selectedCards, card]);
  };

  // Handle remove card
  const handleRemoveCard = (cardId: string) => {
    setSelectedCards(selectedCards.filter(c => c.id !== cardId));
  };

  // Start the reading flow
  const handleBeginReading = () => {
    setStep('topic');
  };

  // Handle topic selection
  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setStep('cards');
  };

  // Handle question submit and start suspense
  const handleQuestionSubmit = async () => {
    if (question.length < 5) {
      setError('Take a moment to form your question in your mind...');
      return;
    }
    if (selectedCards.length !== 3) {
      setError('Please select 3 cards - let your intuition guide you');
      return;
    }
    setError('');
    setStep('suspense');

    // Clear any existing timeouts
    suspenseTimeoutRef.current.forEach(clearTimeout);
    suspenseTimeoutRef.current = [];

    // Set up suspense message progression
    suspenseTimeoutRef.current.push(
      setTimeout(() => setSuspenseMessage(SUSPENSE_MESSAGES[1].text), SUSPENSE_MESSAGES[1].delay),
      setTimeout(() => setSuspenseMessage(SUSPENSE_MESSAGES[2].text), SUSPENSE_MESSAGES[2].delay),
      setTimeout(() => generateReading(), 8000)
    );
  };

  // Generate the reading (called after suspense)
  const generateReading = async () => {
    const analysis = analyzeQuestion(question);
    
    try {
      const response = await fetch('/api/reading/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          topic: selectedTopic || analysis.theme,
          selectedCards: selectedCards.map((card, i) => ({
            card,
            position: ['Past', 'Present', 'Future'][i],
            isReversed: Math.random() < 0.2,
            weight: [10, 20, 30][i],
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate reading');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (!reader) throw new Error('No response available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'content') {
              fullContent += data.content;
            }
          } catch {}
        }
      }

      setInterpretation(fullContent);
      setSelectedCardsWithDetails(selectedCards.map((card, i) => ({
        card,
        position: ['Past', 'Present', 'Future'][i],
        isReversed: Math.random() < 0.2,
        weight: [10, 20, 30][i],
      })));
      
      // Start reveal sequence
      setStep('reveal');
      setRevealIndex(0);
      
    } catch (err) {
      setError('The cards are having difficulty connecting. Please try again.');
      setStep('question');
    }
  };

  // Handle reveal sequence timing
  useEffect(() => {
    if (step === 'reveal') {
      if (revealIndex === 0) {
        const t1 = setTimeout(() => setRevealIndex(1), 1500);
        const t2 = setTimeout(() => startTyping(interpretation), 2000);
        suspenseTimeoutRef.current.push(t1, t2);
      } else if (revealIndex >= 1) {
        const t = setTimeout(() => setRevealIndex(prev => prev + 1), 1500);
        suspenseTimeoutRef.current.push(t);
      }
    }
    
    return () => {
      suspenseTimeoutRef.current.forEach(clearTimeout);
    };
  }, [step, revealIndex, interpretation, startTyping]);

  // Reset everything
  const handleReset = () => {
    setStep('entry');
    setSelectedTopic(null);
    setSelectedCards([]);
    setQuestion('');
    setInterpretation('');
    setRevealIndex(-1);
    setIsReady(false);
    clearTyping();
    resetStore();
  };

  // Handle talking to Ginni
  const handleTalkToGinni = () => {
    const analysis = analyzeQuestion(question);
    setContext({
      question,
      cards: selectedCards.map(c => c.name),
      interpretation: displayText || interpretation,
      theme: analysis.theme,
      emotion: analysis.emotion
    });
    setTriggerOpen(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const cardFloatVariants = {
    initial: { y: 0 },
    hover: { y: -8, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#12121A] to-[#0B0B0F] py-12 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {/* STEP 0: ENTRY - Intention Setting */}
          {step === 'entry' && (
            <motion.div
              key="entry"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <Sparkles className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h1 className="font-heading text-3xl md:text-4xl text-purple-200 mb-4">
                  Take a moment...
                </h1>
                <p className="text-lg text-purple-300/60 max-w-md mx-auto">
                  Focus on your question in your mind. Let it become clear. When you're ready, the cards will listen.
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-purple-400/50 text-sm mb-8"
              >
                {isReady ? 'You may proceed...' : 'Still in 3...'}
              </motion.p>

              <CTAButton 
                onClick={handleBeginReading} 
                disabled={!isReady}
                className={!isReady ? 'opacity-50 cursor-not-allowed' : ''}
              >
                I&apos;m Ready
              </CTAButton>
            </motion.div>
          )}

          {/* STEP 1: Topic Selection - Emotional Priming */}
          {step === 'topic' && (
            <motion.div
              key="topic"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              <div className="text-center">
                <motion.h2 
                  className="font-heading text-2xl md:text-3xl text-purple-200 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Choose what&apos;s weighing on your heart
                </motion.h2>
                <motion.p 
                  className="text-purple-300/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Don&apos;t overthink. Your intuition already knows.
                </motion.p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TOPICS.map((topic, index) => {
                  const Icon = topic.icon;
                  const isSelected = selectedTopic === topic.id;
                  
                  return (
                    <motion.button
                      key={topic.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleTopicSelect(topic.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-2xl border-2 transition-all text-center ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-900/30 shadow-lg shadow-purple-500/20' 
                          : 'border-purple-800/30 bg-[#1A1A2E]/50 hover:border-purple-600/50 hover:bg-purple-900/20'
                      }`}
                    >
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${isSelected ? 'text-purple-400' : 'text-purple-400/70'}`} />
                      <span className="font-medium text-purple-200 block">{topic.label}</span>
                      <span className="text-xs text-purple-400/50 hidden sm:block">{topic.description}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Card Selection */}
          {step === 'cards' && (
            <motion.div
              key="cards"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="font-heading text-2xl md:text-3xl text-purple-200 mb-2">
                  Select 3 cards
                </h2>
                <p className="text-purple-300/60">
                  Don&apos;t overthink. Your intuition already knows which ones call to you.
                </p>
              </div>

              {/* Selected cards display */}
              {selectedCards.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center gap-2 flex-wrap"
                >
                  {selectedCards.map((card, i) => (
                    <motion.button
                      key={card.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => handleRemoveCard(card.id)}
                      className="relative group"
                    >
                      <div className="w-16 h-24 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xs text-white/80 text-center p-1 border border-purple-400/30">
                        {card.name}
                      </div>
                      <X className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </motion.div>
              )}

              <p className="text-center text-purple-300/50 text-sm">
                {selectedCards.length}/3 selected
              </p>

              {/* Card deck */}
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3 justify-center">
                {deckCards.map((card, index) => {
                  const isSelected = selectedCards.find(c => c.id === card.id);
                  
                  return (
                    <motion.button
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      variants={cardFloatVariants}
                      initialVariants="initial"
                      whileHover="hover"
                      onClick={() => handleCardSelect(card)}
                      disabled={isSelected || selectedCards.length >= 3}
                      className={`relative w-20 h-28 md:w-24 md:h-36 rounded-xl transition-all ${
                        isSelected 
                          ? 'opacity-30 scale-95' 
                          : 'hover:shadow-lg hover:shadow-purple-500/30'
                      }`}
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#1a1a2e] to-[#0d0d12] border border-purple-800/50 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/tarot-pattern.svg')] opacity-10" />
                        <motion.div 
                          className="w-full h-full flex items-center justify-center"
                          animate={!isSelected ? { 
                            y: [0, -3, 0],
                          } : {}}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: index * 0.2 
                          }}
                        >
                          <div className="w-16 h-24 md:w-20 md:h-28 rounded-lg bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-700/30 flex items-center justify-center">
                            <span className="text-purple-500/30 text-2xl">✦</span>
                          </div>
                        </motion.div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="text-center mt-8">
                <CTAButton 
                  onClick={() => setStep('question')} 
                  disabled={selectedCards.length !== 3}
                  className={selectedCards.length !== 3 ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  Continue
                </CTAButton>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Question Input */}
          {step === 'question' && (
            <motion.div
              key="question"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6 max-w-xl mx-auto"
            >
              <div className="text-center">
                <h2 className="font-heading text-2xl md:text-3xl text-purple-200 mb-2">
                  What would you like to know?
                </h2>
                <p className="text-purple-300/60">
                  Speak your question silently in your mind. The cards will hear you.
                </p>
              </div>

              <div className="relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={PLACEHOLDERS[placeholderIndex]}
                  className="w-full min-h-[140px] p-4 rounded-2xl border-2 border-purple-800/50 bg-[#1A1A2E]/80 text-purple-100 placeholder:text-purple-400/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none transition-all"
                  maxLength={500}
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-400 text-center"
                  >
                    {error}
                  </motion.p>
                )}
                <p className="mt-2 text-sm text-purple-400/40 text-right">
                  {question.length}/500
                </p>
              </div>

              <div className="text-center">
                <CTAButton onClick={handleQuestionSubmit}>
                  Reveal My Destiny
                </CTAButton>
              </div>

              <motion.button
                onClick={() => setStep('cards')}
                className="block mx-auto text-sm text-purple-400/50 hover:text-purple-300"
              >
                ← Back to card selection
              </motion.button>
            </motion.div>
          )}

          {/* STEP 4: Suspense Engine */}
          {step === 'suspense' && (
            <motion.div
              key="suspense"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[50vh]"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none"
              />
              
              <motion.div
                key={suspenseMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-pulse" />
                <p className="font-heading text-xl md:text-2xl text-purple-200">
                  {suspenseMessage}
                </p>
              </motion.div>

              <motion.div 
                className="mt-8 flex gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-purple-500"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{ 
                      duration: 1, 
                      repeat: Infinity, 
                      delay: i * 0.2 
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* STEP 5: Reveal */}
          {step === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Microcopy before cards */}
              {revealIndex === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-purple-300/60 italic"
                >
                  {REVEAL_MICROCOPY[Math.floor(Math.random() * REVEAL_MICROCOPY.length)]}
                </motion.p>
              )}

              {/* Cards reveal */}
              <div className="flex justify-center gap-4 flex-wrap">
                {selectedCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 30, rotateY: -90 }}
                    animate={{ 
                      opacity: revealIndex >= index ? 1 : 0,
                      y: revealIndex >= index ? 0 : 30,
                      rotateY: revealIndex >= index ? 0 : -90,
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: revealIndex === index ? 0 : 0,
                      type: 'spring',
                      stiffness: 100,
                    }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="w-24 h-36 md:w-28 md:h-40 rounded-xl bg-gradient-to-br from-[#1a1a2e] to-[#0d0d12] border border-purple-700/50 flex items-center justify-center shadow-lg shadow-purple-900/20"
                    >
                      <div className="text-center p-2">
                        <p className="font-heading text-sm text-purple-200">{card.name}</p>
                        <p className="text-xs text-purple-400/60 mt-1">
                          {['Past', 'Present', 'Future'][index]}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Interpretation reveal */}
              {revealIndex >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 p-6 rounded-2xl bg-[#1A1A2E]/50 border border-purple-800/30"
                >
                  <h3 className="font-heading text-xl text-purple-200 mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    Interpretation
                  </h3>
                  <div className="text-purple-200/80 leading-relaxed whitespace-pre-wrap">
                    {displayText || interpretation}
                    {isTyping && (
                      <motion.span
                        className="inline-block w-0.5 h-5 bg-purple-400 ml-1"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 6: Post-reading hooks */}
              {revealIndex >= 2 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <p className="text-center text-purple-300/60 italic">
                    Your energy may shift soon. Check again tomorrow.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <CTAButton onClick={handleTalkToGinni}>
                      Talk to Ginni ✨
                    </CTAButton>
                    <CTAButton 
                      onClick={() => window.location.href = '/premium'}
                      variant="secondary"
                    >
                      Unlock Full Reading
                    </CTAButton>
                  </div>

                  <button
                    onClick={handleReset}
                    className="block mx-auto mt-4 text-purple-400/50 hover:text-purple-300 text-sm"
                  >
                    Start a new reading
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
