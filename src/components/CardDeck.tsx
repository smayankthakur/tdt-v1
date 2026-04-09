'use client';

import { motion } from 'framer-motion';
import { TarotCard as TarotCardType } from '@/data/tarot';
import TarotCardComponent from './TarotCard';

interface CardDeckProps {
  cards: TarotCardType[];
  selectedCards: TarotCardType[];
  onCardSelect: (card: TarotCardType) => void;
}

export default function CardDeck({ cards, selectedCards, onCardSelect }: CardDeckProps) {
  const isCardSelected = (cardId: string) => selectedCards.some((c) => c.id === cardId);
  const canSelect = selectedCards.length < 3;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="font-heading text-2xl text-foreground mb-2">
          Choose Your Cards
        </h3>
        <p className="text-foreground-secondary">
          Select 3 cards from the deck below
        </p>
        <p className="mt-2 text-sm text-primary font-medium">
          {selectedCards.length} / 3 selected
        </p>
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {cards.map((card, index) => {
          const selected = isCardSelected(card.id);
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={canSelect ? { scale: 1.05 } : {}}
            >
              <TarotCardComponent
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

      {selectedCards.length === 3 && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-2 bg-primary/10 rounded-full text-center">
            <span className="text-primary font-medium">
              ✓ All cards selected - proceed to reveal your reading
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}