'use client';

import { useEffect } from 'react';
import { initGA4 } from '@/lib/analytics/ga4';
import { initClarity } from '@/lib/analytics/clarity';

export default function AnalyticsProvider() {
  useEffect(() => {
    initGA4();
    initClarity();
  }, []);

  return null;
}