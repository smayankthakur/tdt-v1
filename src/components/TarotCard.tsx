'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TarotCard as TarotCardType } from '@/data/tarot';
import { Sparkles, Moon } from 'lucide-react';

interface TarotCardProps {
  card: TarotCardType;
  isFlipped?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function TarotCard({
  card,
  isFlipped = false,
  isSelected = false,
  onClick,
  size = 'md',
}: TarotCardProps) {
  const sizeClasses = {
    sm: 'w-28 h-40',
    md: 'w-36 h-52',
    lg: 'w-44 h-64',
  };

  return (
    <motion.div
      className={cn(
        'relative cursor-pointer card-flip',
        sizeClasses[size],
        isSelected && 'z-10'
      )}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className={cn('card-flip-relative h-full w-full preserve-3d', isFlipped && '[transform:rotateY(180deg)]')}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={cn(
            'absolute inset-0 backface-hidden rounded-2xl overflow-hidden',
            'bg-gradient-to-br from-[#2D2A26] to-[#4A4540]',
            'flex items-center justify-center',
            'border-2 border-amber-900/30 shadow-xl',
            isSelected && 'ring-2 ring-amber-400/50 shadow-amber-400/20'
          )}
        >
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/40 via-transparent to-transparent" />
          <div className="grid grid-cols-3 gap-1 p-4 opacity-30">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-sm bg-amber-950/50" />
            ))}
          </div>
          <div className="absolute top-4 left-4 right-4 h-8 rounded-full bg-amber-900/20 flex items-center justify-center">
            <Moon className="w-4 h-4 text-amber-600/50" />
          </div>
          <Sparkles className="absolute bottom-4 w-6 h-6 text-amber-600/40" />
        </div>

        <div
          className={cn(
            'absolute inset-0 backface-hidden rounded-2xl overflow-hidden',
            'bg-card flex flex-col',
            'border-2 border-primary/20 shadow-xl',
            isSelected && 'ring-2 ring-primary/50 shadow-primary/20',
            '[transform:rotateY(180deg)]'
          )}
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100/50" />
          <div className="relative z-10 flex flex-col items-center justify-between h-full p-4">
            <div className="w-full text-center">
              <span className="text-3xl mb-2 block">{getCardEmoji(card.id)}</span>
              <h4 className="font-heading text-sm font-semibold text-foreground leading-tight">
                {card.name}
              </h4>
            </div>
            <p className="text-xs text-center text-foreground-secondary leading-relaxed">
              {card.meaning.split(',')[0]}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function getCardEmoji(cardId: string): string {
  const emojis: Record<string, string> = {
    'fool': '🌟',
    'magician': '✨',
    'high-priestess': '🌙',
    'empress': '👑',
    'emperor': '🏛️',
    'lovers': '💕',
    'chariot': '⚔️',
    'strength': '🦁',
    'hermit': '🕯️',
    'wheel': '🎡',
    'justice': '⚖️',
    'hanged-man': '🌀',
  };
  return emojis[cardId] || '🃏';
}