'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getCardImage } from '@/lib/cardImageMap';
import { getShuffleMessages, getRevealMessages } from '@/lib/spreadEngine';

export interface TarotCard3DProps {
  cardName: string;
  position?: string;
  isFlipped?: boolean;
  isSelected?: boolean;
  isRevealing?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showPosition?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizes = {
  sm: { w: 100, h: 160 },
  md: { w: 140, h: 220 },
  lg: { w: 180, h: 280 },
};

export function TarotCard3D({
  cardName,
  position,
  isFlipped = true,
  isSelected = false,
  isRevealing = false,
  size = 'md',
  showPosition = false,
  onClick,
  className,
}: TarotCard3DProps) {
  const [flipped, setFlipped] = useState(isFlipped);
  const [imageError, setImageError] = useState(false);
  
  const dims = sizes[size];
  const imageSrc = getCardImage(cardName);
  
  useEffect(() => {
    setFlipped(isFlipped);
  }, [isFlipped]);
  
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <motion.div
      className={cn('relative cursor-pointer', className)}
      style={{ perspective: '1000px' }}
      onClick={handleClick}
      initial={false}
      animate={{ 
        scale: isSelected ? 1.08 : 1,
        y: isRevealing ? -10 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <motion.div
        className="relative preserve-3d"
        style={{ 
          width: dims.w, 
          height: dims.h,
          transformStyle: 'preserve-3d',
        }}
        initial={{ rotateY: 0 }}
        animate={{ 
          rotateY: flipped ? 180 : 0,
          rotateX: isRevealing ? [-5, 0, 5, 0] : 0,
        }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: isRevealing ? 0.3 : 0,
        }}
      >
        {/* Card Back */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div 
            className="w-full h-full rounded-xl bg-gradient-to-br from-gold/10 via-surface to-gold/5 
              border border-gold/20 flex items-center justify-center overflow-hidden"
          >
            {/* Decorative back pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(244,197,66,0.3)_0%,transparent_70%)]" />
            </div>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="text-gold/40 text-3xl font-serif"
            >
              ✦
            </motion.div>
            <div className="absolute bottom-3 left-3 right-3 h-px bg-gold/20" />
            <div className="absolute top-3 bottom-3 w-px bg-gold/20" />
          </div>
        </motion.div>
        
        {/* Card Front */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {imageError ? (
            <div className="w-full h-full rounded-xl bg-surface/80 border border-gold/20 flex items-center justify-center">
              <span className="text-foreground-muted text-xs text-center p-2">
                {cardName}
              </span>
            </div>
          ) : (
            <Image
              src={imageSrc}
              alt={cardName}
              fill
              className="object-cover rounded-xl"
              onError={() => setImageError(true)}
              priority={size === 'lg'}
            />
          )}
        </motion.div>
      </motion.div>
      
      {/* Selection Glow */}
      {isSelected && (
        <motion.div
          className="absolute -inset-2 rounded-2xl bg-gold/20 blur-xl -z-10"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
      
      {/* Position Label */}
      {showPosition && position && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-xs text-foreground-secondary text-center"
        >
          {position}
        </motion.p>
      )}
    </motion.div>
  );
}


interface TarotSpreadProps {
  spreadPositions: { name: string; cardName?: string; isRevealing?: boolean; isFlipped?: boolean }[];
  positions: string[];
  isShuffling?: boolean;
  shuffleMessage?: string;
  onCardClick?: (index: number) => void;
  className?: string;
}

export function TarotSpread3D({
  spreadPositions,
  positions,
  isShuffling = false,
  shuffleMessage,
  onCardClick,
  className,
}: TarotSpreadProps) {
  const cols = positions.length <= 3 ? positions.length : 
               positions.length <= 5 ? 5 : 8;
  
  return (
    <AnimatePresence mode="wait">
      {isShuffling ? (
        <motion.div
          key="shuffle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              x: [0, 20, -20, 0],
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="grid grid-cols-3 gap-2"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="w-16 h-24 rounded bg-surface/50 border border-gold/10"
                animate={{ y: [0, -5, 0] }}
                transition={{ 
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
          {shuffleMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-foreground-secondary text-center"
            >
              {shuffleMessage}
            </motion.p>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="display"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn('flex flex-wrap justify-center gap-4', className)}
          style={{
            maxWidth: cols > 5 ? '600px' : '400px',
          }}
        >
          {spreadPositions.map((pos, index) => (
            <motion.div
              key={`${pos.name}-${index}`}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                rotate: index % 2 === 0 ? [-2, 2, 0] : [2, -2, 0],
              }}
              transition={{ 
                delay: pos.isRevealing ? index * 0.8 : 0,
                duration: 0.5,
              }}
            >
              <TarotCard3D
                cardName={pos.cardName || 'back'}
                position={positions[index]}
                isFlipped={pos.isFlipped ?? true}
                isRevealing={pos.isRevealing}
                isSelected={pos.isFlipped}
                showPosition
                onClick={() => onCardClick?.(index)}
                size="md"
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}


export function CardStack({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <motion.div 
      className={cn('relative', className)}
      style={{ width: 120, height: 180 }}
    >
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-xl bg-surface/30 border border-gold/10"
          style={{
            rotate: (i - count/2) * 3,
            translateX: i * 2,
            translateY: -i * 3,
            zIndex: count - i,
          }}
          animate={{
            rotate: [(i - count/2) * 3, (i - count/2 + 2) * 3, (i - count/2) * 3],
          }}
          transition={{
            duration: 3 + i * 0.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 flex items-center justify-center"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <span className="text-gold/60 text-2xl">✦</span>
      </motion.div>
    </motion.div>
  );
}