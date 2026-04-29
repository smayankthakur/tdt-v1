'use client';

import React from 'react';

interface SkeletonLoaderProps {
  lines?: number;
  className?: string;
  animated?: boolean;
}

/**
 * Skeleton loader for content fallback states
 * Replaces empty/loading states with shimmer placeholders
 */
export default function SkeletonLoader({ 
  lines = 3, 
  className = '',
  animated = true 
}: SkeletonLoaderProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`h-4 bg-surface/30 rounded ${i === 0 ? 'w-3/4' : i === 1 ? 'w-full' : 'w-5/6'}
            ${animated ? 'animate-pulse bg-gradient-to-r from-surface/30 via-surface/50 to-surface/30' : ''}`}
        />
      ))}
    </div>
  );
}

/**
 * Card skeleton for grid/list fallbacks
 */
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-2xl bg-surface/30 border border-gold/10 p-6">
          <div className="h-48 bg-surface/20 rounded-xl mb-4 animate-pulse"></div>
          <div className="h-6 bg-surface/30 rounded w-3/4 mb-3 animate-pulse"></div>
          <div className="h-4 bg-surface/30 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-4 bg-surface/30 rounded w-5/6 animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * Reading content skeleton
 */
export function ReadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gold/20 rounded w-1/4 animate-pulse"></div>
      <SkeletonLoader lines={6} animated={true} />
      <div className="h-4 bg-gold/20 rounded w-1/3 ml-auto animate-pulse"></div>
    </div>
  );
}