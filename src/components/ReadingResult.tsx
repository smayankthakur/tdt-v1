'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotCard as TarotCardType, SelectedCard } from '@/lib/tarot/logic';
import TarotCardComponent from './TarotCard';
import CTAButton from './CTAButton';

interface ReadingResultProps {
  question: string;
  cards: TarotCardType[];
  selectedCardsWithDetails?: SelectedCard[];
  interpretation?: string;
  isStreaming?: boolean;
  onUnlockFull?: () => void;
  onTalkToGinni?: () => void;
  onBookConsultation?: () => void;
  onSubscribe?: () => void;
}

const EMOTIONAL_HOOKS = [
  "This is just the surface of what your cards are revealing...",
  "There's more beneath the surface that hasn't fully come through yet...",
  "Your cards are holding back something important...",
  "The deeper pattern is still emerging from your reading...",
];

const RETENTION_HOOKS = [
  "Your energy is shifting... come back tomorrow for updated guidance.",
  "The cards may reveal new insights tomorrow. Your situation is evolving.",
  "Return in 24 hours for your next reading - things will be clearer.",
];

const LOCKED_MESSAGES = [
  "There's something important your cards are holding back...",
  "The full picture includes timing and outcomes you need to see...",
  "Your deeper guidance is locked. Unlock to see what's coming...",
];

export default function ReadingResult({ 
  question, 
  cards, 
  selectedCardsWithDetails, 
  interpretation, 
  isStreaming: externalIsStreaming,
  onUnlockFull, 
  onTalkToGinni,
  onBookConsultation,
  onSubscribe
}: ReadingResultProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [internalIsTyping, setInternalIsTyping] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showConversion, setShowConversion] = useState(false);
  const [showRetention, setShowRetention] = useState(false);
  const [emotionalHook, setEmotionalHook] = useState('');
  const [lockedMessage, setLockedMessage] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  const isTyping = externalIsStreaming ?? internalIsTyping;
  const setIsTyping = externalIsStreaming !== undefined 
    ? () => {} 
    : setInternalIsTyping;

  const fullText = interpretation || `I sense that this situation has been weighing on you more than you admit. The cards reveal that you are at a pivotal moment. Trust your intuition—it is guiding you toward the answer you seek. The clarity you desire is coming, but you must be patient with yourself and trust the journey.`;

  // Calculate partial reveal (show 60% of content)
  const revealThreshold = Math.floor(fullText.length * 0.60);
  const revealedText = fullText.substring(0, revealThreshold);
  const lockedText = fullText.substring(revealThreshold);

  // Initialize hooks
  useEffect(() => {
    setEmotionalHook(EMOTIONAL_HOOKS[Math.floor(Math.random() * EMOTIONAL_HOOKS.length)]);
    setLockedMessage(LOCKED_MESSAGES[Math.floor(Math.random() * LOCKED_MESSAGES.length)]);
  }, []);

  // Handle streaming vs static display
  useEffect(() => {
    if (interpretation && externalIsStreaming) {
      setDisplayedText(interpretation);
      setIsTyping(false);
      
      timerRef.current.push(
        setTimeout(() => setShowPaywall(true), 1500),
        setTimeout(() => setShowConversion(true), 3500),
        setTimeout(() => setShowRetention(true), 10000)
      );
      return;
    }

    // Internal typing effect
    setDisplayedText('');
    setIsTyping(true);
    setShowPaywall(false);
    setShowConversion(false);
    setShowRetention(false);
    
    const startDelay = setTimeout(() => {
      const words = fullText.split(/(\s+)/);
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedText(words.slice(0, currentIndex + 1).join(''));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          
          timerRef.current.push(
            setTimeout(() => setShowPaywall(true), 1500),
            setTimeout(() => setShowConversion(true), 3500),
            setTimeout(() => setShowRetention(true), 10000)
          );
        }
      }, 30);
      
      return () => clearInterval(interval);
    }, 1000);
    
    return () => {
      clearTimeout(startDelay);
      timerRef.current.forEach(clearTimeout);
    };
  }, [fullText, interpretation, externalIsStreaming, setIsTyping]);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Cards Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6 text-center">
          <motion.h2 
            className="font-heading text-2xl md:text-3xl text-purple-200 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Your Reading
          </motion.h2>
          <motion.p 
            className="text-purple-300/60 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            &ldquo;{question}&rdquo;
          </motion.p>
        </div>

        <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30, rotateY: -90 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ 
                delay: index * 0.2, 
                duration: 0.5,
                type: 'spring',
              }}
              className="flex flex-col items-center"
            >
              <motion.div
                whileHover={{ y: -4 }}
              >
                <TarotCardComponent card={card} isFlipped size="md" />
              </motion.div>
              {selectedCardsWithDetails && selectedCardsWithDetails[index] && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.2 }}
                  className="mt-2 text-xs text-purple-400/60 text-center font-medium"
                >
                  {selectedCardsWithDetails[index].position}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Interpretation with Paywall */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="rounded-2xl bg-[#1A1A2E]/50 backdrop-blur-sm border border-purple-800/30 shadow-lg shadow-purple-900/20 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
          
          <div className="relative p-6 md:p-8">
            <motion.h3 
              className="font-heading text-lg md:text-xl mb-4 flex items-center gap-2 text-purple-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span>✨</span> Interpretation
            </motion.h3>
            
            {/* Text Display */}
            <div className="text-purple-200/80 leading-relaxed text-base md:text-lg whitespace-pre-wrap relative">
              {showPaywall ? (
                <div>
                  <span className="text-purple-100">{revealedText}</span>
                  <span className="blur-md select-none text-purple-400/30">{lockedText}</span>
                </div>
              ) : (
                <div>
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      className="inline-block w-0.5 h-5 bg-purple-400 ml-1 align-middle"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </div>
              )}
            </div>
            
            {/* Paywall Overlay */}
            <AnimatePresence>
              {showPaywall && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-0 left-0 right-0 pt-16 pb-4 px-4 bg-gradient-to-t from-[#1A1A2E] via-[#1A1A2E]/95 to-transparent flex flex-col items-center"
                >
                  <p className="text-orange-300/80 text-sm mb-3 text-center">
                    {lockedMessage}
                  </p>
                  <button
                    onClick={onUnlockFull}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 text-white font-semibold text-sm hover:shadow-[0_0_25px_rgba(255,150,0,0.5)] transition-all shadow-lg shadow-orange-500/30"
                  >
                    Unlock Full Reading
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Emotional Hook */}
      <AnimatePresence>
        {showPaywall && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-purple-300/60 italic text-sm"
          >
            {emotionalHook}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Conversion Section */}
      <AnimatePresence>
        {showConversion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Primary CTA */}
            <div className="text-center">
              <CTAButton onClick={onSubscribe || (() => {})}>
                Get Unlimited Readings — ₹199/month
              </CTAButton>
            </div>

            {/* Secondary Options */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onTalkToGinni}
                className="px-5 py-2.5 rounded-full border border-purple-500/40 text-purple-300 text-sm font-medium hover:bg-purple-500/20 transition-all"
              >
                Talk to Ginni ✨
              </button>
              <button
                onClick={onBookConsultation}
                className="px-5 py-2.5 rounded-full border border-purple-500/40 text-purple-300 text-sm font-medium hover:bg-purple-500/20 transition-all"
              >
                Book Personal Reading
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Retention Hook */}
      <AnimatePresence>
        {showRetention && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-4 border-t border-purple-800/20"
          >
            <p className="text-purple-400/50 text-sm">
              {RETENTION_HOOKS[Math.floor(Math.random() * RETENTION_HOOKS.length)]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
