'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { useWatermarkData, useResponsiveConfig, prefersReducedMotion } from '@/lib/security/watermark';

interface WatermarkCellProps {
  text: string;
  fontSize: number;
  opacity: number;
  reducedMotion: boolean;
}

const WatermarkCell = memo(function WatermarkCell({ text, fontSize, opacity, reducedMotion }: WatermarkCellProps) {
  const style = useMemo(() => ({
    fontSize: `${fontSize}px`,
    color: `rgba(255, 215, 0, ${opacity})`,
    fontFamily: 'Cinzel, Georgia, serif',
    letterSpacing: '0.25em',
    textTransform: 'uppercase' as const,
    whiteSpace: 'nowrap' as const,
    userSelect: 'none' as const,
    transform: 'rotate(-25deg)',
    willChange: reducedMotion ? 'auto' : 'transform',
  }), [fontSize, opacity, reducedMotion]);

  return (
    <div
      className="absolute select-none pointer-events-none"
      style={style}
      aria-hidden="true"
    >
      {text}
    </div>
  );
});

export default function UniversalProtectionOverlay() {
  const data = useWatermarkData();
  const config = useResponsiveConfig();
  const reduced = prefersReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const watermarkText = useMemo(() => {
    return `The Divine Tarot • ${data.userId} • ${data.ipAddress}`;
  }, [data.userId, data.ipAddress]);

  const cells = useMemo(() => {
    if (!mounted) return [];

    const rows = 8;
    const cols = 6;
    const spacing = config.spacing;
    
    const result: Array<{ id: string; x: number; y: number }> = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const id = `wm-${row}-${col}`;
        const x = col * spacing;
        const y = row * spacing;
        result.push({ id, x, y });
      }
    }
    
    return result;
  }, [mounted, config.spacing]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-[9999]"
      aria-hidden="true"
    >
      {cells.map((cell) => (
        <div
          key={cell.id}
          className="absolute"
          style={{
            left: `${cell.x}px`,
            top: `${cell.y}px`,
          }}
        >
          <WatermarkCell
            text={watermarkText}
            fontSize={config.fontSize}
            opacity={config.opacity}
            reducedMotion={reduced}
          />
        </div>
      ))}
    </div>
  );
}