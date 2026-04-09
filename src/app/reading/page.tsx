'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReadingStore } from '@/store/reading-store';
import EnergyLoader from '@/components/EnergyLoader';
import CardDeck from '@/components/CardDeck';
import ReadingResult from '@/components/ReadingResult';
import CTAButton from '@/components/CTAButton';
import { Textarea } from '@/components/ui/textarea';

export default function ReadingPage() {
  const {
    question,
    deck,
    selectedCards,
    currentStep,
    setQuestion,
    selectCard,
    setCurrentStep,
    reset,
  } = useReadingStore();

  const [error, setError] = useState('');

  useEffect(() => {
    if (currentStep === 2) {
      const timer = setTimeout(() => {
        setCurrentStep(3);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, setCurrentStep]);

  const handleStartReading = () => {
    if (question.length < 10) {
      setError('Please ask a more detailed question (at least 10 characters)');
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  const handleViewResult = () => {
    setCurrentStep(4);
  };

  const handleUnlockFull = () => {
    alert('This would lead to payment/pro signup in the full version');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-amber-50/30 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="font-heading text-4xl text-foreground mb-2">
                What troubles your heart?
              </h1>
              <p className="text-foreground-secondary mb-8">
                Ask the universe anything that's on your mind
              </p>

              <div className="mx-auto max-w-xl">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What is troubling your heart right now?"
                  className="min-h-[150px] resize-none rounded-2xl border-primary/20 bg-card px-6 py-4 text-lg focus:border-primary focus:ring-primary/20"
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-500"
                  >
                    {error}
                  </motion.p>
                )}
                <p className="mt-2 text-sm text-foreground-secondary">
                  {question.length}/500 characters
                </p>
              </div>

              <div className="mt-8">
                <CTAButton onClick={handleStartReading}>
                  Reveal My Cards
                </CTAButton>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EnergyLoader message="The universe is listening..." />
            </motion.div>
          )}

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
                onUnlockFull={handleUnlockFull}
              />

              <div className="mt-12 text-center">
                <button
                  onClick={reset}
                  className="text-foreground-secondary hover:text-primary transition-colors"
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