'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Button from './button';

interface RetryCardProps {
  error?: string | Error;
  onRetry: () => void | Promise<void>;
  onReset?: () => void;
  message?: string;
  showReset?: boolean;
}

/**
 * Self-healing retry fallback card
 * Provides user-facing recovery options after errors
 */
export default function RetryCard({ 
  error, 
  onRetry, 
  onReset,
  message = 'Something went wrong. Retrying may help.',
  showReset = true 
}: RetryCardProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } catch (e) {
      console.error('Retry failed:', e);
    } finally {
      setIsRetrying(false);
    }
  };

  const errorMessage = error instanceof Error ? error.message : String(error || 'Unknown error');

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-surface/50 border border-gold/30 backdrop-blur-sm text-center space-y-6">
      {/* Visual indicator */}
      <div className="inline-flex rounded-full p-4 bg-red-500/10 mb-2 border border-red-500/20">
        <RefreshCw className="h-8 w-8 text-red-400" />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <h3 className="font-heading text-xl md:text-2xl text-foreground">
          Action Required
        </h3>
        <p className="text-foreground-secondary text-sm md:text-base">
          {message}
        </p>
      </div>

      {/* Error details (collapsible) */}
      {error && (
        <div className="text-left">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-foreground-muted hover:text-foreground transition-colors"
          >
            {showDetails ? 'Hide' : 'Show'} details
          </button>
          
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 rounded-lg bg-black/30 border border-red-500/20 text-xs text-red-400/80 font-mono overflow-x-auto max-h-40 overflow-y-auto"
            >
              {errorMessage}
            </motion.div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Button
          size="md"
          onClick={handleRetry}
          disabled={isRetrying}
          className="min-w-[140px]"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </Button>
        
        {showReset && onReset && (
          <Button
            variant="ghost"
            size="md"
            onClick={onReset}
            className="min-w-[140px]"
          >
            Start Fresh
          </Button>
        )}
      </div>

      {/* Support note */}
      <p className="text-xs text-foreground-muted">
        If this keeps happening, try refreshing the page or contact support.
      </p>
    </div>
  );
}

/* Framer Motion for smooth animations */
import { motion } from 'framer-motion';
