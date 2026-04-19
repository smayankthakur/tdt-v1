'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel';
  error?: string;
  icon?: React.ReactNode;
  autoFocus?: boolean;
  onEnter?: () => void;
}

export default function FloatingInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  icon,
  autoFocus,
  onEnter,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = focused || value.length > 0;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter();
    }
  };

  return (
    <div className="relative w-full mt-6">
      <div className="relative">
        {icon && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none z-10">
            {icon}
          </div>
        )}
        
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={isActive ? placeholder : ''}
          className={cn(
            'w-full bg-transparent border-b-2 font-sans text-base py-4 pr-4 transition-all duration-300',
            'text-foreground placeholder:text-transparent',
            'focus:outline-none',
            
            error
              ? 'border-red-400/50 focus:border-red-400'
              : isActive
                ? 'border-gold focus:border-gold'
                : 'border-gold/20 hover:border-gold/40',
            
            isActive && !error && 'focus:shadow-[0_0_12px_rgba(244,197,66,0.3)]',
            
            icon && 'pl-10'
          )}
        />
        
        {/* Floating Label */}
        <motion.label
          initial={false}
          animate={{
            top: isActive ? -8 : 4,
            fontSize: isActive ? '0.75rem' : '1rem',
            color: error
              ? '#ef4444'
              : isActive
                ? 'rgb(var(--gold))'
                : 'rgb(var(--foreground-muted))',
          }}
          transition={{ duration: 0.2 }}
          className={cn(
            'absolute left-0 font-medium pointer-events-none',
            icon && 'left-10'
          )}
        >
          {label}
        </motion.label>
        
        {/* Focus indicator line */}
        <motion.div
          className={cn(
            'absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gold/50 to-gold',
            error && 'from-red-400/50 to-red-400'
          )}
          initial={{ width: '0%' }}
          animate={{ width: focused || value ? '100%' : '0%' }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-xs mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}


export interface FloatingTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  autoFocus?: boolean;
}

export function FloatingTextarea({
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
  maxLength,
  showCount,
  autoFocus,
}: FloatingTextareaProps) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div className="relative w-full mt-6">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={rows}
          maxLength={maxLength}
          autoFocus={autoFocus}
          placeholder={isActive ? placeholder : ''}
          className={cn(
            'w-full bg-transparent border-b-2 font-sans text-base py-4 pr-4 resize-none transition-all duration-300',
            'text-foreground placeholder:text-transparent',
            'focus:outline-none',
            
            error
              ? 'border-red-400/50 focus:border-red-400'
              : isActive
                ? 'border-gold focus:border-gold'
                : 'border-gold/20 hover:border-gold/40',
            
            isActive && !error && 'focus:shadow-[0_0_12px_rgba(244,197,66,0.3)]'
          )}
        />
        
        {/* Floating Label */}
        <motion.label
          initial={false}
          animate={{
            top: isActive ? -8 : 4,
            fontSize: isActive ? '0.75rem' : '1rem',
            color: error
              ? '#ef4444'
              : isActive
                ? 'rgb(var(--gold))'
                : 'rgb(var(--foreground-muted))',
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 font-medium pointer-events-none"
        >
          {label}
        </motion.label>
        
        {/* Focus indicator */}
        <motion.div
          className={cn(
            'absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gold/50 to-gold',
            error && 'from-red-400/50 to-red-400'
          )}
          initial={{ width: '0%' }}
          animate={{ width: focused || value ? '100%' : '0%' }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Character count */}
      <AnimatePresence>
        {showCount && maxLength && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-foreground-muted text-xs mt-1 text-right"
          >
            {value.length}/{maxLength}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-xs mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}


export interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function FormProgress({
  currentStep,
  totalSteps,
  labels = ['Step 1', 'Step 2'],
}: FormProgressProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs text-foreground-muted">
        <span>{labels[currentStep - 1] || `Step ${currentStep}`}</span>
        <span>{currentStep}/{totalSteps}</span>
      </div>
      <div className="h-1 bg-surface rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-gold/50 to-gold"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {currentStep < totalSteps && (
        <p className="text-xs text-foreground-muted">Bas ek aur step...</p>
      )}
    </div>
  );
}