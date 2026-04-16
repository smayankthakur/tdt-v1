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
            ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] shadow-purple-900/40 active:scale-[0.98]'
            : 'border-2 border-purple-500 text-purple-300 bg-transparent hover:bg-purple-900/30',
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        <span className="relative z-10 font-heading">{children}</span>
        {variant === 'primary' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"
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