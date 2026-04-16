'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  primary: 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 text-white shadow-[0_0_20px_rgba(255,100,0,0.4)] hover:shadow-[0_0_35px_rgba(255,150,0,0.6)]',
  secondary: 'border border-orange-400/60 text-orange-300 bg-black/40 hover:bg-orange-500/20 hover:border-orange-400 hover:shadow-[0_0_15px_rgba(255,150,0,0.3)]',
  ghost: 'text-orange-300/70 hover:text-orange-200 hover:bg-orange-500/10',
};

const shimmer = {
  rest: { opacity: 0, x: '-100%' },
  hover: { opacity: 0.4, x: '100%', transition: { duration: 0.6 } },
  animate: { opacity: 0.3, x: ['-100%', '100%'], transition: { duration: 1.5, repeat: Infinity, repeatDelay: 2 } },
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
          'relative overflow-hidden rounded-xl font-semibold transition-all duration-300 focus:outline-none',
          'inline-flex items-center justify-center',
          sizeClasses[size],
          variantClasses[variant],
          fullWidth && 'w-full',
          (disabled || isLoading) && 'opacity-50 cursor-not-allowed'
        )}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
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
            <span className="relative z-10">{children}</span>
            {variant === 'primary' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300"
                variants={shimmer}
                initial="rest"
                whileHover="hover"
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
