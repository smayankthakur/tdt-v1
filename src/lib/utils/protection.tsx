'use client';

import { useEffect } from 'react';
import { shouldBlockContextMenu, shouldBlockDevTools, shouldBlockScreenshots } from '@/lib/securityConfig';

/**
 * Content Protection Hook
 * 
 * Implements lightweight, accessibility-friendly content protection.
 * Avoids blocking standard browser functionality.
 * 
 * NOTE: Complete screenshot prevention is impossible on the web.
 * This provides deterrence and traceability through watermarks.
 */
export function useContentProtection() {
  useEffect(() => {
    const shouldProtect = shouldBlockContextMenu() || shouldBlockDevTools() || shouldBlockScreenshots();
    if (!shouldProtect) return;

    // Context menu blocking (optional - disabled by default for accessibility)
    let handleContextMenu: ((e: MouseEvent) => void) | undefined;
    
    if (shouldBlockContextMenu()) {
      handleContextMenu = (e: MouseEvent) => {
        // Only prevent on long-press/special cases, not general access
        if (e.button === 2 && e.ctrlKey) {
          e.preventDefault();
        }
      };
      document.addEventListener('contextmenu', handleContextMenu);
    }

    // Keyboard shortcut handling (lightweight - only block destructive combos)
    let handleKeyDown: ((e: KeyboardEvent) => void) | undefined;
    
    if (shouldBlockScreenshots()) {
      handleKeyDown = (e: KeyboardEvent) => {
        // Only block PrintScreen if specified
        if (e.key === 'PrintScreen') {
          e.preventDefault();
          return;
        }
        
        // Block browser save dialogs only when combined with other keys
        if (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
          e.preventDefault();
          return;
        }
      };
      document.addEventListener('keydown', handleKeyDown);
    }

    // Visibility change handling - subtle indicator only
    let handleVisibilityChange: ((e: Event) => void) | undefined;
    
    if (shouldBlockScreenshots()) {
      handleVisibilityChange = () => {
        // Add subtle visual indicator when tab is hidden
        if (document.hidden) {
          document.documentElement.style.setProperty('--watermark-opacity', '0.3');
        } else {
          document.documentElement.style.setProperty('--watermark-opacity', '0.12');
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      if (handleContextMenu) {
        document.removeEventListener('contextmenu', handleContextMenu);
      }
      if (handleKeyDown) {
        document.removeEventListener('keydown', handleKeyDown);
      }
      if (handleVisibilityChange) {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
      document.documentElement.style.setProperty('--watermark-opacity', '0.12');
    };
  }, []);
}

/**
 * Legacy Watermark Component - Deprecated
 * 
 * @deprecated Use DynamicWatermark instead
 */
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

/**
 * Initialize Content Protection
 * 
 * @deprecated Use useContentProtection hook instead
 */
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
