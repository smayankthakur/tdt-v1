'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, Clock, ArrowRight, X, Crown, Zap } from 'lucide-react';
import { usePaywallContent, usePersonalizationContext } from '@/components/personalization/PersonalizationProvider';

interface PaywallPersonalizedProps {
  cardsRevealed: number;
  onUnlock: () => void;
  onClose?: () => void;
}

const PAYWALL_MESSAGES = {
  curious: {
    title: "The cards are revealing something powerful...",
    description: "There's more depth to what you're seeing. Would you like to go deeper?",
    cta: "Continue Reading",
  },
  urgent: {
    title: "Your clarity is waiting...",
    description: "This insight could change everything. Don't leave your path uncertain.",
    cta: "Unlock Now",
  },
  soft: {
    title: "A deeper perspective awaits",
    description: "The universe has more to show you. Continue when you're ready.",
    cta: "Continue Journey",
  },
};

const URGENCY_BADGES = [
  "Limited time offer",
  "Only 2 slots left",
  "Ends tonight",
  "Last chance",
];

export default function PaywallPersonalized({ 
  cardsRevealed, 
  onUnlock, 
  onClose 
}: PaywallPersonalizedProps) {
  const { profile, rules } = usePersonalizationContext();
  const paywallContent = usePaywallContent(rules);

  const [showSavings, setShowSavings] = useState(false);
  const [urgencyBadge, setUrgencyBadge] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);

  const shouldShow = cardsRevealed >= paywallContent.triggerAfterCards;

  useEffect(() => {
    if (paywallContent.showTimeLimit && shouldShow) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [paywallContent.showTimeLimit, shouldShow]);

  useEffect(() => {
    if (paywallContent.showTimeLimit) {
      setUrgencyBadge(URGENCY_BADGES[Math.floor(Math.random() * URGENCY_BADGES.length)]);
    }
  }, [paywallContent.showTimeLimit]);

  useEffect(() => {
    if (paywallContent.showSavings) {
      const timer = setTimeout(() => setShowSavings(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [paywallContent.showSavings]);

  if (!shouldShow) return null;

  const messages = PAYWALL_MESSAGES[paywallContent.messageTone];
  const isPaid = profile?.conversionStage === 'paid';

  if (isPaid) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-purple-50 border border-amber-200"
      >
        <div className="flex items-center gap-3">
          <Crown className="h-6 w-6 text-amber-500" />
          <div>
            <p className="font-medium text-[#1A1A1A]">Premium Access Active</p>
            <p className="text-sm text-[#6B6B6B]">Enjoy unlimited readings</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-[#6B6B6B]" />
            </button>
          )}

          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-purple-100 flex items-center justify-center"
                >
                  <Sparkles className="h-8 w-8 text-amber-500" />
                </motion.div>
              </div>
            </div>

            {paywallContent.showTimeLimit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex justify-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-700 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{urgencyBadge}</span>
                  <span className="font-mono">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            )}

            <h2 className="text-center font-heading text-2xl text-[#1A1A1A] mb-3">
              {messages.title}
            </h2>
            <p className="text-center text-[#6B6B6B] mb-8">
              {messages.description}
            </p>

            <motion.button
              onClick={onUnlock}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-full bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400 font-semibold text-white shadow-lg flex items-center justify-center gap-2"
            >
              <Zap className="h-5 w-5" />
              {messages.cta}
              <ArrowRight className="h-5 w-5" />
            </motion.button>

            <AnimatePresence>
              {showSavings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 text-center"
                >
                  <p className="text-sm text-green-600 font-medium">
                    Save 40% with bundle • Instant access
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#9B9B9B]">
              <Lock className="h-4 w-4" />
              <span>Secure payment • 30-day guarantee</span>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-4">
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-[#6B6B6B]">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Instant delivery</span>
              </div>
              <div className="flex items-center gap-2 text-[#6B6B6B]">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Unlimited readings</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}