'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'tarot' | 'glass' | 'elevated';
type CardSize = 'sm' | 'md' | 'lg';

interface MysticalCardProps {
  variant?: CardVariant;
  size?: CardSize;
  interactive?: boolean;
  glow?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-[#1A1A1A] border border-[#F4C542]/10',
  tarot: 'bg-gradient-to-br from-[#1A0F2E] to-[#0A0A0A] border border-[#F4C542]/20',
  glass: 'bg-[#1A1A1A]/60 backdrop-blur-xl border border-[#F4C542]/10',
  elevated: 'bg-[#1A1A1A] border border-[#F4C542]/20 shadow-[0_0_40px_rgba(244,197,66,0.1)]',
};

const variantShadows: Record<CardVariant, string> = {
  default: 'shadow-[0_0_30px_rgba(0,0,0,0.4)]',
  tarot: 'shadow-[0_0_30px_rgba(244,197,66,0.1)]',
  glass: 'shadow-[0_0_20px_rgba(0,0,0,0.3)]',
  elevated: 'shadow-[0_0_50px_rgba(244,197,66,0.15)]',
};

const sizeStyles: Record<CardSize, string> = {
  sm: 'p-3 rounded-xl',
  md: 'p-5 rounded-2xl',
  lg: 'p-6 rounded-2xl',
};

export default function MysticalCard({
  variant = 'default',
  size = 'md',
  interactive = false,
  glow = true,
  className,
  children,
}: MysticalCardProps) {
  const baseStyles = cn(
    'relative overflow-hidden transition-all duration-300',
    variantStyles[variant],
    glow ? variantShadows[variant] : 'shadow-none',
    sizeStyles[size],
    className
  );

  if (interactive) {
    return (
      <motion.div
        className={baseStyles}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3 }}
      >
        {children}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F4C542]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </motion.div>
    );
  }

  return (
    <div className={baseStyles}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('mb-3', className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={cn('font-serif text-lg text-[#EAEAEA] font-medium', className)}>{children}</h3>;
}

export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn('text-sm text-[#A8A8A8] mt-1', className)}>{children}</p>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('', className)}>{children}</div>;
}

export function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('mt-4 pt-3 border-t border-[#F4C542]/10', className)}>
      {children}
    </div>
  );
}