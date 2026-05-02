'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { getUserSessionId } from '@/lib/utils/tracking';

/**
 * Dynamic Watermark System - 3-Layer Protection
 * 
 * Layer 1: Fixed diagonal pattern overlay (background)
 * Layer 2: Animated floating watermarks (middle)
 * Layer 3: Content-level embedded watermarks (foreground)
 * 
 * Features:
 * - Unique per-session ID and user identifier
 * - Timestamp for traceability
 * - Moving elements to prevent clean screenshots
 * - Canvas-based for tamper resistance
 * - Auto-refresh every 15 seconds
 */

interface WatermarkConfig {
  opacity: number;
  fontSize: number;
  rotation: number;
  spacing: number;
  animationSpeed: number;
}

const WATERMARK_CONFIG: WatermarkConfig = {
  opacity: 0.12,
  fontSize: 14,
  rotation: -25,
  spacing: 200,
  animationSpeed: 0.3,
};

function getWatermarkText(): string {
  const sessionId = getUserSessionId();
  const timestamp = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  // Use shorter format for better visibility
  return `DTV | ${sessionId.slice(0, 6)} | ${timestamp}`;
}

function generateWatermarkId(): string {
  return `wm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Layer 1: Fixed diagonal pattern overlay
 * Semi-transparent repeating pattern across entire viewport
 */
function DiagonalPatternLayer({ config }: { config: WatermarkConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [shouldRender, setShouldRender] = useState(true);

  const drawPattern = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    
    ctx.font = `${config.fontSize}px 'Cinzel', serif`;
    ctx.fillStyle = `rgba(100, 200, 255, ${config.opacity})`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const text = getWatermarkText();
    const spacing = config.spacing;
    const offset = -config.spacing;

    ctx.save();
    ctx.rotate((config.rotation * Math.PI) / 180);

    // Draw repeating diagonal pattern
    for (let y = offset; y < rect.height * 2; y += spacing) {
      for (let x = offset; x < rect.width * 2; x += spacing) {
        ctx.fillText(text, x, y);
      }
    }

    ctx.restore();
  }, [config]);

  useEffect(() => {
    // Skip rendering on mobile to preserve performance
    if (window.innerWidth < 768) {
      setShouldRender(false);
      return;
    }

    drawPattern();

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(drawPattern, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawPattern]);

  if (!shouldRender) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9995]"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}

/**
 * Layer 2: Animated floating watermarks
 * Subtle moving elements that prevent static screenshots
 */
function FloatingWatermarks() {
  const [watermarks, setWatermarks] = useState<Array<{
    id: string;
    x: number;
    y: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    // Skip on mobile
    if (window.innerWidth < 768) return;

    const count = 8;
    const newWatermarks = Array.from({ length: count }, (_, i) => ({
      id: generateWatermarkId(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 2,
      duration: 20 + Math.random() * 20,
    }));
    setWatermarks(newWatermarks);
  }, []);

  if (watermarks.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9996] overflow-hidden">
      {watermarks.map((wm) => (
        <div
          key={wm.id}
          className="absolute select-none pointer-events-none"
          style={{
            left: `${wm.x}%`,
            top: `${wm.y}%`,
            opacity: 0.05,
            fontSize: '10px',
            color: '#64c8ff',
            fontFamily: 'Cinzel, serif',
            animation: `float-${wm.id} ${wm.duration}s ease-in-out ${wm.delay}s infinite`,
          }}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes float-${wm.id} {
                  0%, 100% { transform: translate(0, 0) rotate(-25deg); opacity: 0.05; }
                  25% { transform: translate(20px, -20px) rotate(-20deg); opacity: 0.08; }
                  50% { transform: translate(40px, 10px) rotate(-30deg); opacity: 0.04; }
                  75% { transform: translate(20px, 30px) rotate(-22deg); opacity: 0.07; }
                }
              `,
            }}
          />
          {getWatermarkText()}
        </div>
      ))}
    </div>
  );
}

/**
 * Layer 3: Reading-level embedded watermark
 * Embedded within content to prevent cropping
 */
function ReadingLevelWatermark() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Toggle visibility periodically
    timeoutRef.current = setInterval(() => {
      setVisible((prev) => !prev);
    }, 15000);

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-[9994] transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backgroundImage: `repeating-linear-gradient(
          -25deg,
          transparent,
          transparent 49px,
          rgba(255, 215, 0, 0.03) 49px,
          rgba(255, 215, 0, 0.03) 51px
        )`,
      }}
    >
      <div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-25deg)',
          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
          fontFamily: 'Cinzel, serif',
          fontWeight: 'bold',
          color: 'rgba(255, 215, 0, 0.06)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        {getWatermarkText()}
      </div>
    </div>
  );
}

/**
 * DevTools Detection Component
 * Monitors for common DevTools opening methods
 */
function DevToolsMonitor() {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    let checkInterval: NodeJS.Timeout;

    const detectDevTools = () => {
      const threshold = 165;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;

      if (widthThreshold || heightThreshold) {
        setDevToolsOpen(true);
      } else {
        // Additional detection methods
        const startTime = performance.now();
        debugger;
        const endTime = performance.now();
        
        if (endTime - startTime > 100) {
          setDevToolsOpen(true);
        }
      }
    };

    // Initial check
    detectDevTools();

    // Periodic checks
    checkInterval = setInterval(detectDevTools, 3000);

    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, []);

  if (!devToolsOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#0B0F1A] border border-red-500/50 rounded-xl p-6 max-w-md mx-4 text-center">
        <div className="text-red-400 text-4xl mb-4">⚠</div>
        <h3 className="text-red-400 font-bold text-lg mb-2">Access Restricted</h3>
        <p className="text-red-400/70 text-sm">
          Development tools detected. For security reasons, certain features are disabled.
        </p>
      </div>
    </div>
  );
}

/**
 * Main Dynamic Watermark Component
 * Orchestrates all three layers
 */
export default function DynamicWatermark() {
  const config = WATERMARK_CONFIG;

  // Don't render on print
  useEffect(() => {
    const handleBeforePrint = () => {
      const watermarks = document.querySelectorAll('[class*="watermark"], [class*="Watermark"]');
      watermarks.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
    };

    const handleAfterPrint = () => {
      const watermarks = document.querySelectorAll('[class*="watermark"], [class*="Watermark"]');
      watermarks.forEach((el) => {
        (el as HTMLElement).style.display = '';
      });
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  return (
    <>
      {/* DevTools Monitor */}
      <DevToolsMonitor />

      {/* Layer 1: Diagonal Pattern */}
      <DiagonalPatternLayer config={config} />

      {/* Layer 2: Floating Watermarks */}
      <FloatingWatermarks />

      {/* Layer 3: Reading Level Watermark */}
      <ReadingLevelWatermark />
    </>
  );
}
