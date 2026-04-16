'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { buttonTap, shimmer } from '@/lib/motion';

interface CTAButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  isLoading?: boolean;
}

const sizeClasses = {
  sm: 'px-4 sm:px-6 py-2 text-sm',
  md: 'px-6 sm:px-8 py-3 sm:py-4 text-base',
  lg: 'px-8 sm:px-10 py-4 sm:py-5 text-lg',
};

const variantClasses = {
  primary: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-purple-900/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]',
  secondary: 'border-2 border-purple-500/50 text-purple-300 bg-transparent hover:bg-purple-500/20 hover:border-purple-400',
  ghost: 'text-purple-300/70 hover:text-purple-200 hover:bg-purple-900/20',
};

const CTAButton = forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    isLoading = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-full font-medium transition-all duration-300 focus:outline-none',
          'inline-flex items-center justify-center',
          sizeClasses[size],
          variantClasses[variant],
          fullWidth && 'w-full',
          (disabled || isLoading) && 'opacity-50 cursor-not-allowed'
        )}
        variants={buttonTap}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <motion.div
            className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <>
            <span className="relative z-10 font-heading">{children}</span>
            {variant === 'primary' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"
                variants={shimmer}
                initial="animate"
                whileHover="animate"
              />
            )}
          </>
        )}
      </motion.button>
    );
  }
);

CTAButton.displayName = 'CTAButton';

export default CTAButton;
