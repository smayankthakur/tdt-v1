'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { TarotCard as TarotCardType } from '@/lib/tarot/logic';
import { getCardImage } from '@/lib/cardImageMap';
import { Sparkles, Moon } from 'lucide-react';
import { cardHover, buttonTap, fadeInScale } from '@/lib/motion';

interface TarotCardProps {
  card: TarotCardType;
  isFlipped?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showMeaning?: boolean;
}

const sizeConfig = {
  sm: { width: 112, height: 160, title: 'text-xs' },
  md: { width: 144, height: 208, title: 'text-sm' },
  lg: { width: 176, height: 256, title: 'text-base' },
};

export default function TarotCard({
  card,
  isFlipped = false,
  isSelected = false,
  onClick,
  size = 'md',
  showMeaning = true,
}: TarotCardProps) {
  const sizeStyle = sizeConfig[size];

  return (
    <motion.div
      className={cn(
        'relative cursor-pointer',
        sizeStyle.width ? `w-[${sizeStyle.width}px]` : 'w-36',
        sizeStyle.height ? `h-[${sizeStyle.height}px]` : 'h-52',
        isSelected && 'z-10'
      )}
      style={{ width: sizeStyle.width, height: sizeStyle.height }}
      onClick={onClick}
      variants={cardHover}
      initial="rest"
      animate={isSelected ? 'animate' : 'rest'}
      whileHover="hover"
      whileTap="tap"
      layout
    >
      <motion.div
        className="relative h-full w-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back */}
        <CardBack isSelected={isSelected} sizeStyle={sizeStyle} />

        {/* Card Front */}
        <CardFront 
          card={card} 
          isSelected={isSelected} 
          showMeaning={showMeaning}
          sizeStyle={sizeStyle}
        />
      </motion.div>
    </motion.div>
  );
}

function CardBack({ isSelected, sizeStyle }: { isSelected: boolean; sizeStyle: typeof sizeConfig.md }) {
  return (
    <motion.div
      className={cn(
        'absolute inset-0 backface-hidden rounded-2xl overflow-hidden',
        'bg-gradient-to-br from-[#1A1A2E] to-[#0B0B0F]',
        'flex items-center justify-center',
        isSelected 
          ? 'border-2 border-purple-500 shadow-[0_0_30px_rgba(124,58,237,0.6)]' 
          : 'border-2 border-purple-800/30 shadow-xl',
        isSelected && 'animate-pulse'
      )}
      animate={isSelected ? {
        boxShadow: [
          '0 0 25px rgba(124,58,237,0.5)',
          '0 0 40px rgba(124,58,237,0.8)',
          '0 0 25px rgba(124,58,237,0.5)',
        ],
      } : {}}
      whileHover={!isSelected ? {
        boxShadow: '0 0 20px rgba(124,58,237,0.35)',
        borderColor: 'rgba(124,58,237,0.5)',
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
  );
}

function CardFront({ 
  card, 
  isSelected, 
  showMeaning,
  sizeStyle 
}: { 
  card: TarotCardType; 
  isSelected: boolean;
  showMeaning: boolean;
  sizeStyle: typeof sizeConfig.md;
}) {
  const imageSrc = getCardImage(card.name);

  return (
    <motion.div
      className={cn(
        'absolute inset-0 backface-hidden rounded-2xl overflow-hidden',
        'bg-gradient-to-br from-[#1A1A2E] to-[#0B0B0F] flex flex-col',
        isSelected 
          ? 'border-2 border-purple-500 shadow-[0_0_40px_rgba(124,58,237,0.6)]' 
          : 'border-2 border-purple-800/30 shadow-xl'
      )}
      style={{ 
        transform: 'rotateY(180deg)', 
        backfaceVisibility: 'hidden',
      }}
      animate={isSelected ? {
        boxShadow: [
          '0 0 30px rgba(124,58,237,0.5)',
          '0 0 50px rgba(124,58,237,0.8)',
          '0 0 30px rgba(124,58,237,0.5)',
        ],
      } : {}}
      whileHover={!isSelected ? {
        boxShadow: '0 0 20px rgba(124,58,237,0.35)',
      } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20" />
      
      {/* Card Image - fills the front */}
      <div className="relative flex-1 w-full h-full">
        <Image
          src={imageSrc}
          alt={card.name}
          fill
          className="object-contain p-1"
          sizes={`${sizeStyle.width}px`}
        />
      </div>
      
      {/* Meaning text at bottom (optional) */}
      {showMeaning && (
        <div className="relative z-10 px-2 pb-2">
          <p className="text-[10px] text-purple-300/60 leading-tight text-center line-clamp-2">
            {card.upright.split(',')[0]}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export function getCardEmoji(cardId: string): string {
  const CARD_EMOJIS: Record<string, string> = {
    fool: '🌟',
    magician: '✨',
    'high-priestess': '🌙',
    empress: '👑',
    emperor: '🏛️',
    lovers: '💕',
    chariot: '⚔️',
    strength: '🦁',
    hermit: '🕯️',
    wheel: '🎡',
    justice: '⚖️',
    'hanged-man': '🌀',
  };
  return CARD_EMOJIS[cardId] || '🃏';
}
