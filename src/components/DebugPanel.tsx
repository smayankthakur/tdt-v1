'use client';

import { useState, useEffect } from 'react';
import { shouldShowDebug } from '@/lib/i18nDebug';

export default function DebugPanel() {
  const [showDebug, setShowDebug] = useState(false);
  const [stats, setStats] = useState({ missing: 0, fallback: 0, ok: 0 });

  useEffect(() => {
    setShowDebug(shouldShowDebug());
  }, []);

  // Only show in dev mode
  if (!showDebug) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-black/90 text-white text-xs p-2 z-[9999] flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-4">
        <span className="font-bold text-gold">🔍 Translation Debug</span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
          Missing ({stats.missing})
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
          Fallback ({stats.fallback})
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
          OK ({stats.ok})
        </span>
      </div>
      <div className="text-gray-400">
        Add ?debug=true to URL for production debug
      </div>
    </div>
  );
}