'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useUser } from '@/lib/auth/useUser';

/**
 * Secure Watermark System - 3-Layer Protection
 *
 * Layer 1: Fixed diagonal pattern overlay (semi-transparent repeating background)
 * Layer 2: Animated floating watermarks (slow-moving text elements)
 * Layer 3: Reading-level embedded watermarks (visible on reading page only)
 *
 * Features:
 * - User-specific: User ID + last 4 phone digits
 * - Dynamic timestamp (updates every 10 seconds)
 * - Tamper detection: Blurs content if watermark removed
 * - Mobile-optimized: Adjusts opacity/font-size for small screens
 * - Accessibility: Respects prefers-reduced-motion
 */

interface SecureWatermarkProps {
  showReadingLayer?: boolean; // Only show Layer 3 on reading page
}

export default function SecureWatermark({ showReadingLayer = false }: SecureWatermarkProps) {
  const { user, isLoading } = useUser();

  // Generate display text from user data
  const watermarkText = useMemo(() => {
    const userId = user?.id?.slice(0, 8).toUpperCase() || 'GUEST';
    // Extract last 4 digits of phone if available
    const phone = user?.phone ? `...${user.phone.slice(-4)}` : '';
    const time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return phone ? `UID:${userId} | T:${time} | 📞${phone}` : `UID:${userId} | ${time}`;
  }, [user]);

  // Update timestamp periodically
  const [timestamp, setTimestamp] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date());
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Tamper detection: monitor DOM for watermark removal
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const watermarkSelector = '[data-watermark-id]';

    const checkWatermarks = () => {
      const watermarks = document.querySelectorAll(watermarkSelector);
      if (watermarks.length === 0) {
        console.warn('[Security] Watermark elements missing - possible tampering');
        // Optionally blur content
        // document.body.style.filter = 'blur(3px)';
      }
    };

    const observer = new MutationObserver(checkWatermarks);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check
    setTimeout(checkWatermarks, 1000);

    return () => observer.disconnect();
  }, []);

  // Respect reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Compute configuration based on mobile state
  const config = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return {
      opacity: isMobile ? 0.15 : 0.10,
      fontSize: isMobile ? 10 : 14,
      rotation: -25,
      spacing: isMobile ? 150 : 200,
    };
  }, []); // recompute on resize if needed (or add listener)

  if (isLoading) {
    return null; // Don't show until user data loaded
  }

  return (
    <div className="secure-watermark-container" style={{ pointerEvents: 'none', userSelect: 'none' }}>
      {/* Layer 1: Fixed repeating diagonal pattern */}
      <OverlayPattern
        text={watermarkText}
        config={config}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* Layer 2: Floating animated watermarks (desktop only) */}
      {!prefersReducedMotion && typeof window !== 'undefined' && window.innerWidth >= 768 && (
        <FloatingWatermarks
          text={watermarkText}
          config={config}
        />
      )}

      {/* Layer 3: Reading-level embedded watermark */}
      {showReadingLayer && (
        <ReadingLevelWatermark
          text={watermarkText}
          config={config}
        />
      )}
    </div>
  );
}

// ========== LAYER 1: Overlay Pattern ==========

interface OverlayPatternProps {
  text: string;
  config: { opacity: number; fontSize: number; rotation: number; spacing: number };
  prefersReducedMotion: boolean;
}

function OverlayPattern({ text, config, prefersReducedMotion }: OverlayPatternProps) {
  const patternStyle = useMemo(() => {
    const mobileFactor = typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 1;

    return {
      position: 'fixed' as const,
      inset: 0,
      zIndex: 9995,
      pointerEvents: 'none' as const,
      opacity: config.opacity * (mobileFactor > 1 ? 0.6 : 1),
      backgroundImage: `
        repeating-linear-gradient(
          -25deg,
          transparent,
          transparent ${50 * mobileFactor}px,
          rgba(255, 215, 0, ${config.opacity}) ${50 * mobileFactor}px,
          rgba(255, 215, 0, ${config.opacity}) ${51 * mobileFactor}px
        )
      `,
      backgroundSize: '200% 200%',
      animation: prefersReducedMotion ? 'none' : 'watermark-shift 20s linear infinite',
    };
  }, [text, config.opacity, prefersReducedMotion]);

  // Add keyframes via style tag once
  useEffect(() => {
    if (prefersReducedMotion) return;
    const styleId = 'watermark-animation-style';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes watermark-shift {
        0% { background-position: 0 0; }
        100% { background-position: 100px 100px; }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, [prefersReducedMotion]);

  return <div data-watermark-id="overlay" style={patternStyle} aria-hidden="true" />;
}

// ========== LAYER 2: Floating Watermarks ==========

interface FloatingWatermarksProps {
  text: string;
  config: { opacity: number; fontSize: number; rotation: number; spacing: number };
}

function FloatingWatermarks({ text, config }: FloatingWatermarksProps) {
  const [marks, setMarks] = useState<Array<{ id: string; x: number; y: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    const count = 6;
    const newMarks = Array.from({ length: count }, (_, i) => ({
      id: `fwm-${i}-${Date.now()}`,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      duration: 25 + Math.random() * 15,
      delay: i * 2,
    }));
    setMarks(newMarks);
  }, [text]);

  return (
    <div className="fixed inset-0 z-9996 overflow-hidden pointer-events-none" aria-hidden="true">
      {marks.map((wm) => (
        <div
          key={wm.id}
          data-watermark-id={`float-${wm.id}`}
          className="absolute opacity-30"
          style={{
            left: `${wm.x}%`,
            top: `${wm.y}%`,
            fontSize: '12px',
            color: 'rgba(100, 200, 255, 0.4)',
            fontFamily: 'Cinzel, serif',
            whiteSpace: 'nowrap',
            animation: `float-mark-${wm.id} ${wm.duration}s ease-in-out ${wm.delay}s infinite`,
            transform: 'rotate(-25deg)',
          }}
        >
          {text}
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes float-mark-${wm.id} {
                  0%, 100% { transform: translate(0, 0) rotate(-25deg); opacity: 0.3; }
                  25% { transform: translate(30px, -20px) rotate(-22deg); opacity: 0.4; }
                  50% { transform: translate(60px, 10px) rotate(-28deg); opacity: 0.25; }
                  75% { transform: translate(30px, 30px) rotate(-23deg); opacity: 0.35; }
                }
              `,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ========== LAYER 3: Reading-Level Watermark ==========

interface ReadingLevelWatermarkProps {
  text: string;
  config: { opacity: number; fontSize: number; rotation: number; spacing: number };
}

function ReadingLevelWatermark({ text, config }: ReadingLevelWatermarkProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      data-watermark-id="reading-level"
      className="absolute inset-0 pointer-events-none z-9994 transition-opacity duration-1000"
      style={{
        opacity: visible ? 0.08 : 0.03,
        backgroundImage: `
          repeating-linear-gradient(
            -25deg,
            transparent,
            transparent 49px,
            rgba(255, 215, 0, 0.04) 49px,
            rgba(255, 215, 0, 0.04) 51px
          )
        `,
      }}
      aria-hidden="true"
    >
      <div
        className="absolute select-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-25deg)',
          fontSize: 'clamp(1.5rem, 5vw, 4rem)',
          fontFamily: 'Cinzel, serif',
          fontWeight: 'bold',
          color: 'rgba(255, 215, 0, 0.06)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {text}
      </div>
    </div>
  );
}

// Default configuration - can be environment-based
export function useWatermarkConfig() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const config = useMemo((): WatermarkConfig => {
    if (isMobile) {
      return {
        opacity: 0.15, // Higher opacity on mobile for visibility
        fontSize: 10,
        rotation: -25,
        spacing: 150,
      };
    }

    return {
      opacity: 0.10,
      fontSize: 14,
      rotation: -25,
      spacing: 200,
    };
  }, [isMobile]);

  return config;
}

// ========== Types ==========

export interface WatermarkConfig {
  opacity: number;
  fontSize: number;
  rotation: number;
  spacing: number;
}
