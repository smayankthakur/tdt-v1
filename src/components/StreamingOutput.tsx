'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface StreamingOutputProps {
  lines: string[];
  onComplete?: () => void;
  startDelay?: number;
  lineDelay?: number;
}

export default function StreamingOutput({
  lines,
  onComplete,
  startDelay = 1000,
  lineDelay = 120,
}: StreamingOutputProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  // Refs to persist across renders without causing re-renders
  const linesRef = useRef(lines);
  const displayedCountRef = useRef(0);
  const isCompleteRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Keep linesRef up to date
  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  // Start streaming once on mount
  useEffect(() => {
    let mounted = true;
    let startTimer: NodeJS.Timeout;

    const startStreaming = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        if (!mounted) {
          clearInterval(intervalRef.current!);
          return;
        }

        const currentLines = linesRef.current;
        const count = displayedCountRef.current;

        if (count < currentLines.length) {
          const nextLine = currentLines[count];
          setDisplayedLines((prev) => [...prev, nextLine]);
          displayedCountRef.current = count + 1;
        } else if (!isCompleteRef.current && displayedCountRef.current > 0) {
          // We've caught up to all lines received so far and have displayed at least one.
          // Assume streaming is done and stop the interval.
          isCompleteRef.current = true;
          if (onComplete) onComplete();
          clearInterval(intervalRef.current!);
        }
        // else: no new lines yet but we haven't started or still expect more – keep interval alive
      }, lineDelay);
    };

    startTimer = setTimeout(startStreaming, startDelay);

    return () => {
      mounted = false;
      clearTimeout(startTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onComplete, startDelay, lineDelay]);

  // Scroll to newest line when it appears
  useEffect(() => {
    if (displayedLines.length > 0) {
      const lastIdx = displayedLines.length - 1;
      requestAnimationFrame(() => {
        if (lineRefs.current[lastIdx]) {
          lineRefs.current[lastIdx]!.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }
  }, [displayedLines]);

  // Debug safety check – log state changes without overwhelming console
  useEffect(() => {
    console.log('READING STATE – lines displayed:', displayedCountRef.current, '/', linesRef.current.length);
  }, [displayedLines.length]);

  return (
    <div className="reading-text space-y-3 font-serif text-base md:text-lg text-white">
      {displayedLines.map((line, idx) => {
        if (line.trim() === '') {
          return <div key={idx} className="h-4" />;
        }

        let content: React.ReactNode = line;
        let className = 'leading-relaxed text-white/90';

        if (line.startsWith('•')) {
          className += ' pl-4 border-l-2 border-gold/30 text-gold/90';
        } else if (line.startsWith('Card ')) {
          className += ' pl-4';
          const parts = line.split(':');
          if (parts.length > 1) {
            content = (
              <div>
                <span className="text-gold/70 text-sm font-medium block mb-1">
                  {parts[0].toUpperCase()}
                </span>
                <span>{parts.slice(1).join(':')}</span>
              </div>
            );
          }
        }

        return (
          <motion.p
            key={idx}
            ref={(el) => {
              lineRefs.current[idx] = el;
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={className}
          >
            {content}
          </motion.p>
        );
      })}

      {/* Typing cursor – shows while there are more lines to stream */}
      {displayedCountRef.current < linesRef.current.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-5 bg-gold ml-1 align-middle"
        />
      )}
    </div>
  );
}
