'use client';

import { useEffect, useState, useCallback } from 'react';
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
}

const loaderPhrases = [
  "Aligning with your energy...",
  "Tuning into your situation...",
  "Reading the patterns around you...",
  "Connecting to the universe...",
  "Translating the message...",
];

export default function ReadingResult({ 
  question, 
  cards, 
  selectedCardsWithDetails, 
  interpretation, 
  isStreaming: externalIsStreaming,
  onUnlockFull, 
  onTalkToGinni 
}: ReadingResultProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [internalIsTyping, setInternalIsTyping] = useState(true);
  const [showGinniPrompt, setShowGinniPrompt] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Use external streaming state if provided, otherwise use internal
  const isTyping = externalIsStreaming ?? internalIsTyping;
  const setIsTyping = externalIsStreaming !== undefined 
    ? () => {} 
    : setInternalIsTyping;

  const fullText = interpretation || `I sense that this situation has been weighing on you more than you admit. The cards reveal that you are at a pivotal moment. Trust your intuition—it is guiding you toward the answer you seek. The clarity you desire is coming, but you must be patient with yourself and trust the journey.`;

  // Calculate partial reveal (show 65% of content)
  const revealThreshold = Math.floor(fullText.length * 0.65);
  const revealedText = fullText.substring(0, revealThreshold);
  const lockedText = fullText.substring(revealThreshold);

  // If interpretation is provided externally (streaming), use it directly
  useEffect(() => {
    if (interpretation && externalIsStreaming) {
      // When streaming, display directly as it comes
      setDisplayedText(interpretation);
      setIsTyping(false);
      setTimeout(() => {
        setShowGinniPrompt(true);
        setShowPaywall(true);
      }, 2000);
      return;
    }

    // Otherwise, use internal typing effect
    setDisplayedText('');
    setIsTyping(true);
    setShowGinniPrompt(false);
    setShowPaywall(false);
    
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
          
          setTimeout(() => {
            setShowGinniPrompt(true);
            setShowPaywall(true);
          }, 3000);
        }
      }, 35);
      
      return () => clearInterval(interval);
    }, 800);
    
    return () => clearTimeout(startDelay);
  }, [fullText, interpretation, externalIsStreaming, setIsTyping]);

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8 text-center">
          <motion.h2 
            className="font-heading text-3xl mb-2 text-purple-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Your Reading
          </motion.h2>
          <motion.p 
            className="text-purple-300/60 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            &ldquo;{question}&rdquo;
          </motion.p>
        </div>

        <div className="flex justify-center gap-4 mb-10">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30, rotateY: -90 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ 
                delay: index * 0.25, 
                duration: 0.6,
                type: 'spring',
                stiffness: 100
              }}
              className="flex flex-col items-center"
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <TarotCardComponent card={card} isFlipped size="md" />
              </motion.div>
              {selectedCardsWithDetails && selectedCardsWithDetails[index] && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 + index * 0.2 }}
                  className="mt-3 text-xs text-purple-300/60 text-center font-medium"
                >
                  {selectedCardsWithDetails[index].position}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="p-8 rounded-2xl bg-[#1A1A2E]/50 backdrop-blur-sm border border-purple-800/30 shadow-lg shadow-purple-900/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
          <div className="relative">
            <motion.h3 
              className="font-heading text-xl mb-5 flex items-center gap-2 text-purple-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
            >
              <span className="text-xl">✨</span> Interpretation
            </motion.h3>
            
            <div className="text-purple-200/80 leading-relaxed text-lg whitespace-pre-wrap relative">
              {showPaywall ? (
                <>
                  <span>{revealedText}</span>
                  <span className="blur-sm select-none opacity-50">{lockedText}</span>
                  {/* Paywall overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1A1A2E] via-[#1A1A2E]/95 to-transparent flex flex-col items-center justify-end pb-4">
                    <p className="text-purple-300/80 text-sm mb-3">Unlock the full reading for deeper insights</p>
                    <button
                      onClick={onUnlockFull}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/30"
                    >
                      Unlock Full Reading
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      className="inline-block w-0.5 h-5 bg-purple-400 ml-0.5"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </>
              )}
            </div>
            
            {!isTyping && !showPaywall && (
              <motion.span 
                className="inline-block w-2 h-4 bg-purple-400 ml-1 align-middle"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              />
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showGinniPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="mt-8"
          >
            <div className="text-center">
              <motion.div
                className="inline-block p-5 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl border border-purple-700/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-purple-200/70 text-sm mb-3">
                  There&apos;s more to this... Ginni can guide you deeper
                </p>
                <div className="flex gap-2 justify-center">
                  <CTAButton onClick={onTalkToGinni}>
                    Talk to Ginni ✨
                  </CTAButton>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}