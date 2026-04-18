'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useReadingFlow } from '@/hooks/useReadingFlow';
import { type ReadingType } from '@/store/reading-types';
import FloatingInput, { FloatingTextarea, FormProgress } from '@/components/ui/FloatingInput';

interface ReadingFormProps {
  readingType: ReadingType;
  onBack: () => void;
}

type FormStep = 'name' | 'question' | 'loading' | 'result';

export default function ReadingForm({ readingType, onBack }: ReadingFormProps) {
  const [step, setStep] = useState<FormStep>('name');
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');
  
  const questionRef = useRef<HTMLTextAreaElement>(null);
  
  const { t } = useLanguage();
  const { generateReading, result, isLoading, error, canRead } = useReadingFlow();
  
  const handleNameSubmit = () => {
    if (!name.trim() || name.length < 2) return;
    setStep('question');
    setTimeout(() => questionRef.current?.focus(), 300);
  };
  
  const handleQuestionSubmit = async () => {
    if (!question.trim() || question.length < 5) return;
    if (!canRead()) return;
    
    setStep('loading');
    
    await generateReading({
      name: name.trim(),
      question: question.trim(),
      readingType,
    });
    
    setStep('result');
  };
  
  const handleTryAgain = () => {
    setStep('name');
    setName('');
    setQuestion('');
  };
  
  const nameError = name.length > 0 && name.length < 2;
  const questionError = question.length > 0 && question.length < 5;
  
  const progress = step === 'name' ? 1 : step === 'question' ? 2 : step === 'loading' ? 2 : 2;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#12121A] to-[#0B0B0F] pt-24 pb-12 md:pt-32 md:py-24">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {/* Name Step */}
          {step === 'name' && (
            <motion.div
              key="name-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex rounded-full p-4 bg-gold/10 mb-6"
                >
                  <Sparkles className="h-8 w-8 text-gold" />
                </motion.div>
                <h1 className="font-heading text-2xl text-foreground mb-2">
                  Tumhe kis naam se bulaun?
                </h1>
                <p className="text-foreground-secondary text-sm">
                  Naam ke basis pe reading banayenge
                </p>
              </div>
              
              <FormProgress
                currentStep={1}
                totalSteps={2}
                labels={['Naam', 'Sawal']}
              />
              
              <FloatingInput
                label="Tumhara naam"
                value={name}
                onChange={setName}
                error={nameError ? 'Naam ke bina thoda connection missing lagta hai...' : undefined}
                onEnter={handleNameSubmit}
                autoFocus
              />
              
              <button
                onClick={handleNameSubmit}
                disabled={name.length < 2}
                className="w-full py-4 rounded-xl bg-gold-gradient font-semibold text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                Aage badho <ArrowRight className="h-5 w-5" />
              </button>
              
              <button
                onClick={onBack}
                className="w-full py-3 text-foreground-secondary hover:text-foreground transition-colors text-center"
              >
                ← Wapas
              </button>
            </motion.div>
          )}
          
          {/* Question Step */}
          {step === 'question' && (
            <motion.div
              key="question-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex rounded-full p-4 bg-gold/10 mb-6"
                >
                  <Sparkles className="h-8 w-8 text-gold" />
                </motion.div>
                <h1 className="font-heading text-2xl text-foreground mb-2">
                  Jo tumhare mind mein hai…
                </h1>
                <p className="text-foreground-secondary text-sm">
                  Woh likho jise jaan na chahte ho
                </p>
              </div>
              
              <FormProgress
                currentStep={2}
                totalSteps={2}
                labels={['Naam', 'Sawal']}
              />
              
              <FloatingTextarea
                label="Tumhara sawal"
                value={question}
                onChange={setQuestion}
                error={questionError ? 'Sawal clear hoga tabhi answer bhi clear aayega' : undefined}
                maxLength={500}
                showCount
              />
              
              <button
                onClick={handleQuestionSubmit}
                disabled={question.length < 5}
                className="w-full py-4 rounded-xl bg-gold-gradient font-semibold text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                Reveal My Reading
              </button>
              
              <button
                onClick={() => setStep('name')}
                className="w-full py-3 text-foreground-secondary hover:text-foreground transition-colors text-center"
              >
                ← Wapas
              </button>
            </motion.div>
          )}
          
          {/* Loading Step */}
          {step === 'loading' && (
            <motion.div
              key="loading-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Loader2 className="h-12 w-12 text-gold animate-spin mx-auto mb-6" />
              <p className="text-foreground text-lg font-medium">
                Bas dekhte hain kya aa raha hai…
              </p>
              <p className="text-foreground-secondary text-sm mt-2">
                Thoda patience rakhho…
              </p>
            </motion.div>
          )}
          
          {/* Result Step */}
          {step === 'result' && result && (
            <motion.div
              key="result-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex rounded-full p-3 bg-gold/10 mb-4"
                >
                  <Sparkles className="h-6 w-6 text-gold" />
                </motion.div>
                <p className="text-gold font-medium">
                  {result.greeting}
                </p>
              </div>
              
              <div className="p-6 rounded-2xl bg-surface/50 border border-gold/20">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {result.reading}
                </p>
              </div>
              
              {result.guidance && (
                <div className="p-5 rounded-2xl bg-gold/5 border border-gold/30">
                  <p className="text-sm text-gold mb-2">Guidance ✨</p>
                  <p className="text-foreground-secondary">
                    {result.guidance}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleTryAgain}
                  className="flex-1 py-3 rounded-xl border border-gold/30 text-foreground hover:border-gold/50 transition-colors text-center"
                >
                  Naya reading
                </button>
                <button
                  onClick={() => window.location.href = '/premium'}
                  className="flex-1 py-3 rounded-xl bg-gold-gradient text-black font-medium hover:opacity-90 transition-opacity text-center"
                >
                  Full access lo
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Error State */}
          {step === 'result' && error && (
            <motion.div
              key="error-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-red-400 mb-4">
                Kuch galat ho gaya
              </p>
              <button
                onClick={() => setStep('name')}
                className="px-6 py-2 rounded-xl border border-gold/30"
              >
                Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}