'use client';

import { useEffect, useState, useRef } from 'react';
import { shouldShowWatermark } from '@/lib/securityConfig';

function getUserId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  
  let userId = localStorage.getItem('divine_tarot_user_id');
  
  if (!userId) {
    userId = 'xxxxxxxx'.replace(/[x]/g, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).toUpperCase();
    localStorage.setItem('divine_tarot_user_id', userId);
  }
  
  return userId.slice(0, 8).toUpperCase();
}

export default function Watermark() {
  const [userId, setUserId] = useState('');
  const [offset, setOffset] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => (prev + 50) % 200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !userId) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawWatermark(ctx);
    };

    const drawWatermark = (ctx: CanvasRenderingContext2D) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const text = `Divine Tarot • Private • User: ${userId}`;
      const fontSize = Math.max(10, Math.min(14, w / 80));
      
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = 'rgba(107, 107, 107, 0.3)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      ctx.save();
      ctx.rotate(-25 * Math.PI / 180);

      const spacingX = w * 0.5;
      const spacingY = fontSize * 5;

      for (let y = -h; y < h * 2; y += spacingY) {
        for (let x = -w; x < w * 2; x += spacingX) {
          ctx.fillText(text, x, y + offset);
        }
      }

      ctx.restore();
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [userId, offset]);

  if (!userId || !shouldShowWatermark()) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9997]"
      aria-hidden="true"
    />
  );
}