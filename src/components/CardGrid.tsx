'use client';

import { motion } from 'framer-motion';
import TarotCard from '@/components/TarotCard';
import { TarotCard as TarotCardType } from '@/data/tarot';
import { staggerContainer, staggerItem } from '@/lib/motion';

interface CardGridProps {
  cards: TarotCardType[];
  selectedCards: TarotCardType[];
  onCardSelect: (card: TarotCardType) => void;
  maxSelections?: number;
  columns?: 2 | 3 | 4;
}

const columnsConfig = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
};

export default function CardGrid({
  cards,
  selectedCards,
  onCardSelect,
  maxSelections = 3,
  columns = 3,
}: CardGridProps) {
  const isCardSelected = (cardId: string) => 
    selectedCards.some((c) => c.id === cardId);
  
  const canSelect = selectedCards.length < maxSelections;

  return (
    <motion.div
      className={`grid gap-3 sm:gap-4 ${columnsConfig[columns]}`}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => {
        const selected = isCardSelected(card.id);
        return (
          <motion.div
            key={card.id}
            variants={staggerItem}
            className="flex justify-center"
          >
            <TarotCard
              card={card}
              isFlipped={selected}
              isSelected={selected}
              onClick={() => canSelect && !selected && onCardSelect(card)}
              size="md"
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function SelectedCardsIndicator({ 
  count, 
  max = 3 
}: { 
  count: number; 
  max?: number;
}) {
  const isComplete = count === max;
  
  return (
    <motion.div
      className={`mt-6 text-center ${isComplete ? 'mb-0' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
        ${isComplete 
          ? 'bg-purple-900/40 border border-purple-500/50 text-purple-300' 
          : 'bg-[#1A1A2E]/60 border border-purple-800/30 text-purple-400/70'
        }
      `}>
        <span>{count}</span>
        <span className="text-purple-400/50">/</span>
        <span>{max}</span>
        {isComplete && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-1"
          >
            ✓
          </motion.span>
        )}
      </div>
      {isComplete && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-sm text-purple-300/80"
        >
          All cards selected - proceed to reveal your reading
        </motion.p>
      )}
    </motion.div>
  );
}
