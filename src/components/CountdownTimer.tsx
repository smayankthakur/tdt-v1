'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface CountdownTimerProps {
  hours: number;
  minutes: number;
  seconds: number;
  onComplete?: () => void;
  className?: string;
}

export default function CountdownTimer({
  hours: initialHours,
  minutes: initialMinutes,
  seconds: initialSeconds,
  onComplete,
  className = '',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  });
  const { t } = useTranslation();

  useEffect(() => {
    // Calculate target time (24 hours from now)
    const targetTime = Date.now() + 24 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        onComplete?.();
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-3 text-gold font-mono text-lg md:text-xl ${className}`}
    >
      <Clock className="h-5 w-5" />
      <div className="flex items-center gap-1">
        <span className="bg-gold/10 px-2 py-1 rounded">{pad(timeLeft.hours)}{t('countdown.hours')}</span>
        <span>:</span>
        <span className="bg-gold/10 px-2 py-1 rounded">{pad(timeLeft.minutes)}{t('countdown.minutes')}</span>
        <span>:</span>
        <span className="bg-gold/10 px-2 py-1 rounded">{pad(timeLeft.seconds)}{t('countdown.seconds')}</span>
      </div>
      <span className="text-sm text-foreground-muted ml-2">{t('countdown.untilNext')}</span>
    </motion.div>
  );
}
