'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TarotCard as TarotCardType, SelectedCard } from '@/data/tarot';
import TarotCardComponent from './TarotCard';
import CTAButton from './CTAButton';

interface ReadingResultProps {
  question: string;
  cards: TarotCardType[];
  selectedCardsWithDetails?: SelectedCard[];
  interpretation?: string;
  onUnlockFull?: () => void;
  onTalkToGinni?: () => void;
}

export default function ReadingResult({ question, cards, selectedCardsWithDetails, interpretation, onUnlockFull, onTalkToGinni }: ReadingResultProps) {
  const [displayedText, setDisplayedText] = useState('');

  const fullText = interpretation || `I sense that this situation has been weighing on you more than you admit. The cards reveal that you are at a pivotal moment. Trust your intuition—it is guiding you toward the answer you seek. The clarity you desire is coming, but you must be patient with yourself and trust the journey.`;

  useEffect(() => {
    setDisplayedText('');
    const timer = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedText(fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }, 1000);
    return () => clearTimeout(timer);
  }, [fullText]);

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl mb-2">Your Reading</h2>
          <p className="text-foreground-secondary italic">&ldquo;{question}&rdquo;</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3 }}
              className="flex flex-col items-center"
            >
              <TarotCardComponent card={card} isFlipped size="md" />
              {selectedCardsWithDetails && selectedCardsWithDetails[index] && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.3 }}
                  className="mt-2 text-xs text-foreground-secondary text-center"
                >
                  {selectedCardsWithDetails[index].position}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="p-8 rounded-2xl bg-card border border-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/5" />
          <div className="relative">
            <h3 className="font-heading text-xl mb-4 flex items-center gap-2">
              <span>✨</span> Interpretation
            </h3>
            <p className="text-foreground-secondary leading-relaxed whitespace-pre-line">
              {displayedText}
              <span className="animate-pulse">|</span>
            </p>
          </div>
        </div>
      </motion.div>

      {cards.length > 0 && (
        <motion.div
          className="blur-sm select-none pointer-events-none opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 3 }}
        >
          <div className="p-8 rounded-2xl bg-card border border-primary/20">
            <h3 className="font-heading text-xl mb-4">Full Reading</h3>
            <p className="text-foreground-secondary leading-relaxed">
              The cards reveal a deeper meaning in your situation. There is more the universe
              wants to show you about your path forward...
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="inline-block p-6 bg-amber-50 rounded-2xl border border-amber-200/50">
          <h4 className="font-heading text-lg text-foreground mb-2">
            There is more the universe wants to reveal...
          </h4>
          <p className="text-sm text-foreground-secondary mb-4">
            Unlock your full personalized reading with deeper insights
          </p>
          <div className="flex flex-nowrap gap-3 justify-center">
            <CTAButton onClick={onTalkToGinni}>
              Talk to Ginni
            </CTAButton>
            <CTAButton variant="secondary" onClick={onUnlockFull}>
              Unlock Full Reading
            </CTAButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}