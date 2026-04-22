'use client';

import { useState, useEffect, ReactNode } from 'react';
import { shouldShowDebug, type DebugStatus } from '@/lib/i18nDebug';

interface DebugTextProps {
  children: ReactNode;
  status?: DebugStatus;
  keyName?: string;
}

export default function DebugText({ children, status = 'ok', keyName }: DebugTextProps) {
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    setShowDebug(shouldShowDebug());
  }, []);

  // In production, just render normal text
  if (!showDebug) {
    return <>{children}</>;
  }

  // Don't highlight OK status
  if (status === 'ok') {
    return <>{children}</>;
  }

  const colorClass =
    status === 'missing'
      ? 'bg-red-500/40 border border-red-500 text-red-200'
      : status === 'fallback'
      ? 'bg-yellow-500/40 border border-yellow-500 text-yellow-200'
      : '';

  return (
    <span className={`relative inline-block px-1 rounded ${colorClass}`}>
      {children}
      {keyName && (
        <span className="absolute -top-3 -left-1 text-[8px] text-white bg-black/80 px-1 rounded whitespace-nowrap">
          {status.toUpperCase()}: {keyName}
        </span>
      )}
    </span>
  );
}

// Helper component for rendering translation results
interface TranslationResultProps {
  text: string;
  status: DebugStatus;
  originalKey?: string;
}

export function TranslationResult({ text, status, originalKey }: TranslationResultProps) {
  return (
    <DebugText status={status} keyName={originalKey}>
      {text}
    </DebugText>
  );
}