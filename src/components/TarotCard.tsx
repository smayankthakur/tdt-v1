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
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className={cn('card-flip-relative h-full w-full preserve-3d', isFlipped && '[transform:rotateY(180deg)]')}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back */}
        <motion.div
          className={cn(
            'absolute inset-0 backface-hidden rounded-2xl overflow-hidden',
            'bg-gradient-to-br from-[#1A1A2E] to-[#0B0B0F]',
            'flex items-center justify-center',
            isSelected 
              ? 'border-2 border-purple-500 shadow-[0_0_30px_rgba(124,58,237,0.5)]' 
              : 'border-2 border-purple-800/30 shadow-xl',
            isSelected && 'animate-pulse-slow'
          )}
          whileHover={!isSelected ? {
            boxShadow: [
              '0 0 20px rgba(124,58,237,0.3)',
              '0 0 40px rgba(124,58,237,0.5)'
            ],
            borderColor: 'rgba(124,58,237,0.5)'
          } : {}}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent" />
          <div className="grid grid-cols-3 gap-1 p-4 opacity-30">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-sm bg-purple-950/50" />
            ))}
          </div>
          <div className="absolute top-4 left-4 right-4 h-8 rounded-full bg-purple-900/20 flex items-center justify-center">
            <Moon className="w-4 h-4 text-purple-400/50" />
          </div>
          <Sparkles className="absolute bottom-4 w-6 h-6 text-purple-400/40" />
        </motion.div>

        {/* Card Front */}
        <motion.div
          className={cn(
            'absolute inset-0 backface-hidden rounded-2xl overflow-hidden',
            'bg-gradient-to-br from-[#1A1A2E] to-[#0B0B0F] flex flex-col',
            isSelected 
              ? 'border-2 border-purple-500 shadow-[0_0_40px_rgba(124,58,237,0.6)]' 
              : 'border-2 border-purple-800/30 shadow-xl'
          )}
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
          whileHover={{
            boxShadow: [
              '0 0 20px rgba(124,58,237,0.3)',
              '0 0 30px rgba(124,58,237,0.5)'
            ]
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20" />
          <div className="relative z-10 flex flex-col items-center justify-between h-full p-4">
            <div className="w-full text-center">
              <motion.span 
                className="text-3xl mb-2 block"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {getCardEmoji(card.id)}
              </motion.span>
              <h4 className="font-heading text-sm font-semibold text-purple-200 leading-tight">
                {card.name}
              </h4>
            </div>
            <p className="text-xs text-center text-purple-300/60 leading-relaxed">
              {card.meaning.split(',')[0]}
            </p>
          </div>
        </motion.div>
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