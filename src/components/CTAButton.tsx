'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CTAButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const CTAButton = forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-6 py-2 text-sm',
      md: 'px-8 py-4 text-base',
      lg: 'px-10 py-5 text-lg',
    };
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-full font-medium transition-all duration-300 focus:outline-none',
          sizeClasses[size],
          variant === 'primary'
            ? 'bg-gold-gradient text-[#2D2A26] hover:scale-105 hover:shadow-xl glow-gold-hover active:scale-[0.98]'
            : 'border-2 border-secondary text-secondary bg-transparent hover:bg-secondary/10',
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        <span className="relative z-10 font-heading">{children}</span>
        {variant === 'primary' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#D4B97A] to-[#C9A962]"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>
    );
  }
);

CTAButton.displayName = 'CTAButton';

export default CTAButton;