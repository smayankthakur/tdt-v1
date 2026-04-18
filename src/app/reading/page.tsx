'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, RefreshCw, ArrowRight } from 'lucide-react';
import { READING_TYPES, type ReadingType, useReadingLimitStore } from '@/store/reading-types';
import { useLanguage } from '@/hooks/useLanguage';

type HubStep = 'select-type' | 'reading' | 'paywall';

export default function ReadingHub() {
  const [step, setStep] = useState<HubStep>('select-type');
  const [selectedType, setSelectedType] = useState<ReadingType | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const { t } = useLanguage();
  
  const { 
    canRead, 
    getRemainingReadings, 
    incrementReading, 
    showPaywall, 
    paywallShown,
    dismissPaywall,
    resetDaily 
  } = useReadingLimitStore();
  
  const remainingReadings = getRemainingReadings();
  
  useEffect(() => {
    resetDaily();
  }, [resetDaily]);
  
  const handleTypeSelect = (type: ReadingType) => {
    if (!canRead()) {
      if (!paywallShown) {
        setStep('paywall');
      }
      return;
    }
    
    setSelectedType(type);
    setIsTransitioning(true);
    incrementReading(type);
    
    if (type === 'yesno') {
      window.location.href = '/yesno';
    } else {
      window.location.href = `/reading?type=${type}`;
    }
  };
  
  const handleUnlock = () => {
    window.location.href = '/premium';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#12121A] to-[#0B0B0F] pt-24 pb-12 md:pt-32 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex rounded-full p-4 bg-gold/10 mb-6">
            <Sparkles className="h-8 w-8 text-gold" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            {t('readingHub.title') || 'What would you like to explore today?'}
          </h1>
          <p className="text-foreground-secondary">
            {t('readingHub.subtitle') || 'Choose your path to clarity'}
          </p>
        </motion.div>
        
        {/* Free readings indicator */}
        {remainingReadings < 3 && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 border border-gold/20">
              <RefreshCw className="h-4 w-4 text-gold" />
              <span className="text-foreground-secondary text-sm">
                {remainingReadings === 3 
                  ? "3 readings free today" 
                  : remainingReadings === 2 
                  ? "2 readings remaining" 
                  : remainingReadings === 1 
                  ? "1 reading remaining" 
                  : "No free readings left"}
              </span>
            </div>
          </div>
        )}
        
        {/* Reading type grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {READING_TYPES.map((type, index) => (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => handleTypeSelect(type.id)}
              disabled={isTransitioning}
              className="group p-4 md:p-6 rounded-2xl bg-surface/50 border border-gold/10 hover:border-gold/30 hover:bg-surface/80 transition-all text-center"
            >
              <span className="text-3xl md:text-4xl block mb-2">
                {type.emoji}
              </span>
              <span className="font-medium text-foreground text-sm md:text-base block group-hover:text-gold transition-colors">
                {type.label}
              </span>
            </motion.button>
          ))}
        </div>
        
        {/* Paywall Overlay */}
        {step === 'paywall' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-full max-w-md p-8 rounded-3xl bg-gradient-to-b from-surface to-background border border-gold/30 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex rounded-full p-4 bg-gold/10 mb-6"
              >
                <Lock className="h-8 w-8 text-gold" />
              </motion.div>
              
              <h2 className="font-heading text-2xl text-foreground mb-4">
                Lagta hai tum seriously answers dhundh rahe ho…
              </h2>
              
              <p className="text-foreground-secondary mb-6">
                Yahan se jo aage aata hai, woh thoda deeper hota hai. 
                Unlimited guidance ke liye upgrade karo.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleUnlock}
                  className="w-full py-4 rounded-xl bg-gold-gradient font-semibold text-black hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Unlock unlimited guidance — ₹199/mo
                </button>
                
                <button
                  onClick={dismissPaywall}
                  className="w-full py-3 rounded-xl border border-gold/20 text-foreground-secondary hover:text-foreground transition-all"
                >
                  Koi mauka nahi, phir se try karta hoon
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}