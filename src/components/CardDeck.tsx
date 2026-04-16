'use client';

import { motion } from 'framer-motion';
import { TarotCard as TarotCardType } from '@/data/tarot';
import CardGrid, { SelectedCardsIndicator } from '@/components/CardGrid';
import { fadeInUp } from '@/lib/motion';

interface CardDeckProps {
  cards: TarotCardType[];
  selectedCards: TarotCardType[];
  onCardSelect: (card: TarotCardType) => void;
  maxSelections?: number;
}

export default function CardDeck({ 
  cards, 
  selectedCards, 
  onCardSelect,
  maxSelections = 3,
}: CardDeckProps) {
  const isComplete = selectedCards.length === maxSelections;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="mb-6 sm:mb-8 text-center"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <h3 className="font-heading text-2xl sm:text-3xl text-purple-200 mb-2">
          Choose Your Cards
        </h3>
        <p className="text-purple-300/60 mb-2">
          Select {maxSelections} cards from the deck below
        </p>
      </motion.div>

      <CardGrid
        cards={cards}
        selectedCards={selectedCards}
        onCardSelect={onCardSelect}
        maxSelections={maxSelections}
        columns={3}
      />

      <SelectedCardsIndicator count={selectedCards.length} max={maxSelections} />
    </div>
  );
}
