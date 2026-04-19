'use client';

import { useEffect } from 'react';
import { shouldBlockContextMenu, shouldBlockDevTools, shouldBlockScreenshots } from '../securityConfig';

export function useContentProtection() {
  useEffect(() => {
    const shouldProtect = shouldBlockContextMenu() || shouldBlockDevTools() || shouldBlockScreenshots();
    if (!shouldProtect) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const blockedKeys = [
        'PrintScreen',
        's' as unknown as typeof e.key,
        'u' as unknown as typeof e.key,
        'c' as unknown as typeof e.key,
        'i' as unknown as typeof e.key,
        'j' as unknown as typeof e.key,
      ];
      
      const ctrlKeys = ['s', 'u', 'c', 'i', 'j'];
      const shiftKeys = ['i', 'j'];
      
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        return;
      }
      
      if (e.ctrlKey && ctrlKeys.includes(e.key.toLowerCase())) {
        e.preventDefault();
        return;
      }
      
      if (e.ctrlKey && e.shiftKey && shiftKeys.includes(e.key.toLowerCase())) {
        e.preventDefault();
        return;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.body.style.filter = 'blur(8px)';
      } else {
        document.body.style.filter = 'none';
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.body.style.filter = 'none';
    };
  }, []);
}

export function Watermark() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      style={{
        background: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 100px)',
      }}
    >
      <div 
        className="absolute inset-0 flex items-center justify-center opacity-[0.03]"
        style={{
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontWeight: 'bold',
          color: '#fff',
          transform: 'rotate(-30deg)',
          whiteSpace: 'nowrap',
        }}
      >
        <span className="repeat-text">The Devine Tarot • The Devine Tarot • The Devine Tarot • </span>
      </div>
    </div>
  );
}

export function initializeProtection() {
  'use client';
  
  if (typeof window === 'undefined') return;

  const shouldProtect = shouldBlockContextMenu() || shouldBlockDevTools() || shouldBlockScreenshots();
  if (!shouldProtect) return;

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      return;
    }
    
    if (e.ctrlKey && ['s', 'u', 'c'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      return;
    }
    
    if (e.ctrlKey && e.shiftKey && ['i', 'j'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      return;
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.body.style.filter = 'blur(8px)';
    } else {
      document.body.style.filter = 'none';
    }
  });

  console.log('Content protection initialized');
}