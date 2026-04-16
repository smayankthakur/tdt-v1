'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReadingStore } from '@/store/reading-store';
import { useGinniStore } from '@/store/ginni-store';
import { analyzeQuestion } from '@/lib/tarot/logic';
import EnergyLoader from '@/components/EnergyLoader';
import CardDeck from '@/components/CardDeck';
import ReadingResult from '@/components/ReadingResult';
import CTAButton from '@/components/CTAButton';
import { Textarea } from '@/components/ui/textarea';
import { useStreamReading, useTypingEffect } from '@/hooks/useStreamReading';

export default function ReadingPage() {
  const {
    question,
    deck,
    selectedCards,
    selectedCardsWithDetails,
    currentStep,
    setQuestion,
    selectCard,
    setCurrentStep,
    setSelectedCardsWithDetails,
    reset: resetStore,
  } = useReadingStore();

  const { setContext, setTriggerOpen, triggerOpen, clearContext } = useGinniStore();

  const [error, setError] = useState('');
  
  // Streaming hook
  const {
    isLoading,
    isStreaming,
    cards: streamedCards,
    content: streamedContent,
    error: streamError,
    startReading,
    reset: resetStream,
  } = useStreamReading();

  // Typing effect for display
  const { displayText, isTyping, startTyping, clearTyping } = useTypingEffect('', 30);
  
  // Auto-scroll ref
  const contentRef = useRef<HTMLDivElement>(null);

  // Start typing when content changes
  useEffect(() => {
    if (streamedContent && currentStep === 2) {
      startTyping(streamedContent);
    }
  }, [streamedContent, currentStep, startTyping]);

  // Auto-scroll to bottom when typing
  useEffect(() => {
    if (contentRef.current && isTyping) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [displayText, isTyping]);

  // Transition to card selection after energy loading
  useEffect(() => {
    if (currentStep === 2 && !isLoading && !isStreaming && streamedCards) {
      const timer = setTimeout(() => {
        setSelectedCardsWithDetails(streamedCards.map((sc, index) => ({
          card: sc.card,
          position: ['Past', 'Present', 'Future'][index],
          isReversed: sc.isReversed,
          weight: [10, 20, 30][index],
        })));
        setCurrentStep(3);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isLoading, isStreaming, streamedCards, setSelectedCardsWithDetails, setCurrentStep]);

  const handleStartReading = async () => {
    if (question.length < 10) {
      setError('Please ask a more detailed question (at least 10 characters)');
      return;
    }
    setError('');
    
    // Get topic from question
    const analysis = analyzeQuestion(question);
    
    // Start streaming reading
    try {
      await startReading({
        question,
        topic: analysis.theme,
        selectedCards: undefined, // API will select cards
        onCardsReceived: (cards) => {
          console.log('Cards received:', cards);
        },
        onChunk: (chunk) => {
          // Content is being streamed
        },
        onComplete: (fullText) => {
          console.log('Reading complete');
        },
        onError: (err) => {
          setError(err);
          setCurrentStep(1);
        },
      });
      
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to start reading');
      setCurrentStep(1);
    }
  };

  const handleViewResult = () => {
    setCurrentStep(4);
  };

  const handleUnlockFull = () => {
    alert('This would lead to payment/pro signup in the full version');
  };

  const handleTalkToGinni = () => {
    const analysis = analyzeQuestion(question);
    const cardNames = selectedCardsWithDetails?.map(c => c.card.name) || [];
    
    setContext({
      question,
      cards: cardNames,
      interpretation: displayText || streamedContent,
      theme: analysis.theme,
      emotion: analysis.emotion
    });
    
    setTriggerOpen(true);
  };

  const handleReset = () => {
    resetStore();
    resetStream();
    clearTyping();
  };

  useEffect(() => {
    if (triggerOpen && currentStep === 4) {
      const timer = setTimeout(() => {
        setTriggerOpen(false);
        clearContext();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [triggerOpen, currentStep, setTriggerOpen, clearContext]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#1A1A2E] to-[#0B0B0F] py-24">
      <div className="mx-auto max-w-4xl px-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Question Input */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="font-heading text-3xl sm:text-4xl text-purple-200 mb-2">
                What troubles your heart?
              </h1>
              <p className="text-purple-200/60 mb-8">
                Ask the universe anything that is on your mind
              </p>

              <div className="mx-auto max-w-xl">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What is troubling your heart right now?"
                  className="min-h-[150px] resize-none rounded-2xl border-purple-800/50 bg-[#1A1A2E] px-6 py-4 text-lg text-purple-100 placeholder:text-purple-300/40 focus:border-purple-500 focus:ring-purple-500/20"
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-400"
                  >
                    {error}
                  </motion.p>
                )}
                <p className="mt-2 text-sm text-purple-300/50">
                  {question.length}/500 characters
                </p>
              </div>

              <div className="mt-8">
                <CTAButton onClick={handleStartReading} isLoading={isLoading}>
                  Reveal My Cards
                </CTAButton>
              </div>
            </motion.div>
          )}

          {/* Step 2: Energy Loading / Streaming */}
          {(currentStep === 2 || isLoading || isStreaming) && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {(isLoading || isStreaming) && !streamedContent ? (
                <EnergyLoader message="The universe is listening..." />
              ) : (
                <div className="text-center mb-8">
                  <EnergyLoader />
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Card Selection */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <CardDeck
                cards={deck}
                selectedCards={selectedCards}
                onCardSelect={selectCard}
              />

              {selectedCards.length === 3 && (
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <CTAButton onClick={handleViewResult}>
                    Reveal My Reading
                  </CTAButton>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 4: Reading Result */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ReadingResult
                question={question}
                cards={selectedCards}
                selectedCardsWithDetails={selectedCardsWithDetails}
                interpretation={displayText || streamedContent}
                isStreaming={isTyping}
                onUnlockFull={handleUnlockFull}
                onTalkToGinni={handleTalkToGinni}
              />

              <div className="mt-12 text-center">
                <button
                  onClick={handleReset}
                  className="text-purple-300/60 hover:text-purple-400 transition-colors"
                >
                  Start a new reading
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
