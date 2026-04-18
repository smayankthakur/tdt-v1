'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface MysticalButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
  isLoading?: boolean;
  glow?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-7 py-3.5 text-base',
  lg: 'px-9 py-4.5 text-lg',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-[#F4C542] via-[#FFD84D] to-[#F4C542] 
    text-black 
    shadow-[0_0_25px_rgba(244,197,66,0.4)] 
    hover:shadow-[0_0_40px_rgba(244,197,66,0.6)]
  `,
  secondary: `
    border-2 border-[#F4C542]/40 
    text-[#F4C542] 
    bg-transparent 
    hover:bg-[#F4C542]/10
    hover:border-[#F4C542]/60
  `,
  ghost: `
    text-[#F4C542]/80 
    bg-transparent 
    hover:text-[#F4C542] 
    hover:bg-[#F4C542]/10
  `,
  danger: `
    bg-gradient-to-r from-[#C1121F] to-[#E63946] 
    text-white 
    shadow-[0_0_20px_rgba(193,18,31,0.4)] 
    hover:shadow-[0_0_35px_rgba(193,18,31,0.6)]
  `,
};

const shimmer = {
  rest: { opacity: 0, x: '-100%' },
  hover: { opacity: 0.4, x: '100%', transition: { duration: 0.6 } },
};

const MysticalButton = forwardRef<HTMLButtonElement, MysticalButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    isLoading = false,
    children, 
    disabled,
    glow = true,
    ...props 
  }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-full font-semibold transition-all duration-300 focus:outline-none',
          'inline-flex items-center justify-center',
          sizeClasses[size],
          variantClasses[variant],
          fullWidth && 'w-full',
          (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
          !glow && 'shadow-none hover:shadow-none',
          className
        )}
        whileHover={variant !== 'ghost' ? { scale: 1.03, y: -2 } : {}}
        whileTap={{ scale: 0.97 }}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <motion.div
            className={cn(
              "h-5 w-5 border-2 rounded-full",
              variant === 'primary' ? "border-black/30 border-t-black" : "border-white/30 border-t-white"
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <>
            <span className="relative z-10">{children}</span>
            {(variant === 'primary' || variant === 'danger') && (
              <motion.div
                className={cn(
                  "absolute inset-0",
                  variant === 'primary' 
                    ? "bg-gradient-to-r from-[#F4C542]/30 via-[#FFD84D]/30 to-[#F4C542]/30"
                    : "bg-gradient-to-r from-[#C1121F]/30 to-[#E63946]/30"
                )}
                initial="rest"
                whileHover="hover"
                variants={shimmer}
              />
            )}
          </>
        )}
      </motion.button>
    );
  }
);

MysticalButton.displayName = 'MysticalButton';

export default MysticalButton;
export type { MysticalButtonProps, ButtonVariant, ButtonSize };
