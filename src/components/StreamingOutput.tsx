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
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    let mounted = true;
    let currentIdx = -1;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (!mounted) {
          clearInterval(interval);
          return;
        }

        if (currentIdx < lines.length - 1) {
          currentIdx++;
          setCurrentLineIndex(currentIdx);
          setDisplayedLines(prev => [...prev, lines[currentIdx]]);
          
          // Scroll to current line smoothly
          if (lineRefs.current[currentIdx]) {
            lineRefs.current[currentIdx]!.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'nearest' 
            });
          }
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
        }
      }, lineDelay);

      return () => clearInterval(interval);
    }, startDelay);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [lines, onComplete, startDelay, lineDelay]);

  return (
    <div className="space-y-3 font-serif text-base md:text-lg">
      {displayedLines.map((line, idx) => {
        const isNewest = idx === currentLineIndex;
        
        // Skip rendering pure whitespace lines (but keep spacing)
        if (line.trim() === '') {
          return <div key={idx} className="h-4" />;
        }

        let content: React.ReactNode = line;
        let className = "leading-relaxed text-foreground/90";
        
        // Bullet point styling
        if (line.startsWith('•')) {
          className += " pl-4 border-l-2 border-gold/30 text-gold/90";
        } else if (line.startsWith('Card ')) {
          className += " pl-4";
          // Parse card header vs content
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
            ref={(el) => { lineRefs.current[idx] = el; }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={className}
          >
            {content}
          </motion.p>
        );
      })}
      
      {/* Typing cursor */}
      {currentLineIndex < lines.length - 1 && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-5 bg-gold ml-1 align-middle"
        />
      )}
    </div>
  );
}
