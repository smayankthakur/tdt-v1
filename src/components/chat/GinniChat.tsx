'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Maximize2, Send } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/hooks/useTranslation';
import { langMap } from '@/lib/i18n/config';

export interface GinniContext {
  question?: string;
  cards?: string[];
  interpretation?: string;
  theme?: string;
  emotion?: string;
}

interface GinniChatProps {
  autoOpenDelay?: number;
  showNotification?: boolean;
  context?: GinniContext;
  triggerOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const GINNI_BASE_URL = 'https://ginnitdt.lovable.app';

export default function GinniChat({ 
  autoOpenDelay = 0, 
  showNotification = true,
  context,
  triggerOpen = false,
  onOpen,
  onClose
}: GinniChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showContextNotice, setShowContextNotice] = useState(false);
  const [iframeSrc, setIframeSrc] = useState(GINNI_BASE_URL);
  const [languageState, setLanguageState] = useState('en');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { isHydrated, language: lang } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    if (isHydrated) {
      setLanguageState(langMap[lang] || 'en');
    }
  }, [isHydrated, lang]);

  // Send language to iframe via postMessage when language changes or iframe loads
  useEffect(() => {
    if (iframeRef.current?.contentWindow && isOpen) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'SET_LANGUAGE', payload: { language: lang } },
        '*'
      );
    }
  }, [languageState, isOpen, lang]);

  const buildIframeSrc = useCallback((ctx?: GinniContext) => {
    const baseUrl = GINNI_BASE_URL;
    
    const params = new URLSearchParams();
    
    if (ctx?.question) {
      params.set('q', ctx.question.slice(0, 500));
    }
    
    if (ctx?.theme) {
      params.set('theme', ctx.theme);
    }
    
    if (ctx?.emotion) {
      params.set('emotion', ctx.emotion);
    }
    
    if (ctx?.cards && ctx.cards.length > 0) {
      params.set('cards', ctx.cards.slice(0, 3).join(', ').slice(0, 200));
    }
    
    if (ctx?.interpretation) {
      const summary = ctx.interpretation.slice(0, 300).replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      params.set('context', summary);
    }

    params.set('lang', languageState);

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }, [languageState]);

  useEffect(() => {
    if (context && context.question) {
      setIframeSrc(buildIframeSrc(context));
    } else {
      setIframeSrc(buildIframeSrc());
    }
  }, [context, buildIframeSrc]);

  useEffect(() => {
    if (triggerOpen && !isOpen) {
      if (context?.question) {
        setShowContextNotice(true);
        setTimeout(() => {
          setShowContextNotice(false);
          setIsOpen(true);
          setIsLoading(true);
          setHasAutoOpened(true);
          onOpen?.();
        }, 2500);
      } else {
        setIsOpen(true);
        setIsLoading(true);
        setHasAutoOpened(true);
        onOpen?.();
      }
    }
  }, [triggerOpen, context, isOpen, onOpen]);

  useEffect(() => {
    if (autoOpenDelay > 0 && !hasAutoOpened) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setIsLoading(true);
        setHasAutoOpened(true);
        onOpen?.();
      }, autoOpenDelay);
      return () => clearTimeout(timer);
    }
  }, [autoOpenDelay, hasAutoOpened, onOpen]);

  useEffect(() => {
    if (showNotification && isOpen && hasAutoOpened) {
      setShowTooltip(true);
      const timer = setTimeout(() => setShowTooltip(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showNotification, isOpen, hasAutoOpened]);

  useEffect(() => {
    if (isOpen) {
      inactivityTimerRef.current = setTimeout(() => {
        if (isExpanded) {
          setIsExpanded(false);
        }
      }, 120000);
    } else {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    }
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isOpen, isExpanded]);

  const handleClose = () => {
    setIsOpen(false);
    setIsExpanded(true);
    onClose?.();
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMessageToGinni = (message: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'MESSAGE', payload: { message, language: lang } },
        '*'
      );
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed z-50 ${
        isExpanded 
          ? 'bottom-6 right-6 w-[400px] h-[600px]' 
          : 'bottom-6 right-6 w-[350px] h-[500px]'
      }`}
      style={{ maxWidth: 'calc(100vw - 48px)' }}
    >
      <div className="h-full rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-2xl">🔮</span>
              </div>
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-white">Ginni</h3>
              <p className="text-xs text-white/80">{t('common.yourSpiritualGuide')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleExpand}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4 text-white" />
              ) : (
                <Maximize2 className="w-4 h-4 text-white" />
              )}
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Context Notice */}
        <AnimatePresence>
          {showContextNotice && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-amber-50 border-b border-amber-100 px-4 py-2"
            >
              <p className="text-sm text-amber-800">
                💫 {t('chat.contextNotice')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Iframe Container */}
        <div className="flex-1 relative bg-gray-50">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-4xl"
                >
                  🔮
                </motion.div>
                <p className="text-sm text-gray-500">{t('common.connectingToGinni')}</p>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            className="w-full h-full border-0"
            allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            title="Ginni Chat"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-center text-gray-400">
            {t('chat.footerPowered')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
