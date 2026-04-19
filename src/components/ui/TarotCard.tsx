'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getCardImage } from '@/lib/cardImageMap';

export interface TarotCardProps {
  name: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { width: 100, height: 160 },
  md: { width: 150, height: 240 },
  lg: { width: 200, height: 320 },
};

export default function TarotCard({
  name,
  selected = false,
  onClick,
  disabled = false,
  size = 'md',
  showName = false,
  className,
}: TarotCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const dimensions = sizeConfig[size];
  const imageSrc = getCardImage(name);
  
  const handleClick = () => {
    if (disabled || !onClick) return;
    setIsFlipped(!isFlipped);
    onClick();
  };
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={cn('relative', className)}>
      <motion.div
        initial={false}
        animate={{ 
          scale: selected ? 1.05 : 1,
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ duration: 0.4, type: 'spring' }}
        onClick={handleClick}
        className={cn(
          'relative cursor-pointer transition-all duration-300',
          'rounded-xl overflow-hidden',
          !disabled && 'hover:scale-105',
          selected && 'ring-2 ring-gold shadow-glow',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        style={{ 
          width: dimensions.width, 
          height: dimensions.height,
          perspective: '1000px',
        }}
      >
        {/* Card Front (Image) */}
        <div 
          className={cn(
            'absolute inset-0 backface-hidden',
            isFlipped && 'rotate-y-180'
          )}
        >
          {imageError ? (
            <div 
              className="w-full h-full bg-surface/50 rounded-xl flex items-center justify-center"
            >
              <span className="text-foreground-muted text-xs text-center p-2">
                {name.slice(0, 12)}
              </span>
            </div>
          ) : (
            <Image
              src={imageSrc}
              alt={name}
              width={dimensions.width}
              height={dimensions.height}
              className="object-cover rounded-xl"
              onError={handleImageError}
              priority={size === 'lg'}
            />
          )}
        </div>
        
        {/* Card Back */}
        <motion.div
          initial={{ rotateY: -180 }}
          animate={{ 
            rotateY: isFlipped ? 0 : -180,
          }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 backface-hidden rotate-y-180"
        >
          <div className="w-full h-full bg-gradient-to-br from-gold/20 to-secondary/20 rounded-xl border border-gold/30 flex items-center justify-center">
            <span className="text-gold text-2xl">✦</span>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Card Name Label */}
      {showName && (
        <p className="text-center text-xs text-foreground-muted mt-2 max-w-[100px]">
          {name}
        </p>
      )}
    </div>
  );
}


interface TarotCardGridProps {
  cards: { name: string; selected?: boolean }[];
  onSelectCard: (index: number) => void;
  maxSelections?: number;
  disabled?: boolean;
  className?: string;
}

export function TarotCardGrid({
  cards,
  onSelectCard,
  maxSelections = 3,
  disabled = false,
  className,
}: TarotCardGridProps) {
  const selectedCount = cards.filter(c => c.selected).length;
  const canSelect = selectedCount < maxSelections || disabled;
  
  return (
    <div className={cn('grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3', className)}>
      {cards.map((card, index) => (
        <TarotCard
          key={`${card.name}-${index}`}
          name={card.name}
          selected={card.selected}
          onClick={() => {
            if (!disabled && !card.selected && canSelect) {
              onSelectCard(index);
            }
          }}
          disabled={disabled || (!card.selected && !canSelect)}
          size="sm"
          showName
        />
      ))}
    </div>
  );
}


interface TarotCardDisplayProps {
  cards: { name: string; position: string; isReversed?: boolean }[];
  className?: string;
}

export function TarotCardDisplay({ cards, className }: TarotCardDisplayProps) {
  return (
    <div className={cn('flex flex-wrap justify-center gap-4', className)}>
      {cards.map((card, index) => (
        <motion.div
          key={`${card.name}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 }}
        >
          <TarotCard
            name={card.name}
            size="lg"
            showName
          />
          <p className="text-center text-sm text-foreground-secondary mt-2">
            {card.position}
          </p>
        </motion.div>
      ))}
    </div>
  );
}