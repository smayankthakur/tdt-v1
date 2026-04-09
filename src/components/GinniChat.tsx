'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const GINNI_BASE_URL = 'https://ginni-ki-baatein.lovable.app/';

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
  const [showContextNotice, setShowContextNotice] = useState(false);
  const [iframeSrc, setIframeSrc] = useState(GINNI_BASE_URL);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const buildIframeSrc = useCallback((ctx?: GinniContext) => {
    if (!ctx?.question) return GINNI_BASE_URL;

    const params = new URLSearchParams();
    
    params.set('q', ctx.question.slice(0, 500));
    
    if (ctx.theme) {
      params.set('theme', ctx.theme);
    }
    if (ctx.emotion) {
      params.set('emotion', ctx.emotion);
    }
    
    if (ctx.cards && ctx.cards.length > 0) {
      const cardSummary = ctx.cards.slice(0, 3).join(', ');
      params.set('cards', cardSummary.slice(0, 200));
    }
    
    if (ctx.interpretation) {
      const summary = ctx.interpretation.slice(0, 300).replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      params.set('context', summary);
    }

    const url = `${GINNI_BASE_URL}?${params.toString()}`;
    return url;
  }, []);

  useEffect(() => {
    if (context && context.question) {
      const newSrc = buildIframeSrc(context);
      setIframeSrc(newSrc);
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
  }, [triggerOpen, isOpen, context, onOpen]);

  useEffect(() => {
    if (autoOpenDelay > 0 && !hasAutoOpened && !triggerOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setIsLoading(true);
        setHasAutoOpened(true);
        onOpen?.();
      }, autoOpenDelay);
      return () => clearTimeout(timer);
    }
  }, [autoOpenDelay, hasAutoOpened, triggerOpen, onOpen]);

  useEffect(() => {
    if (isOpen && iframeRef.current && context?.question) {
      const sendContextViaPostMessage = () => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            {
              type: 'INIT_CONTEXT',
              payload: {
                question: context.question,
                cards: context.cards,
                interpretation: context.interpretation,
                theme: context.theme,
                emotion: context.emotion,
                timestamp: Date.now()
              }
            },
            '*'
          );
        }
      };

      if (!isLoading) {
        setTimeout(sendContextViaPostMessage, 500);
      }
    }
  }, [isOpen, isLoading, context]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsLoading(true);
    onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    if (context?.question && iframeRef.current?.contentWindow) {
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'INIT_CONTEXT', payload: context },
          '*'
        );
      }, 1000);
    }
  };

  const getContextMessage = () => {
    if (!context?.question) return null;
    
    const questionPreview = context.question.length > 40 
      ? context.question.slice(0, 40) + '...' 
      : context.question;
    
    const messages = [
      `Ginni already knows about "${questionPreview}"…`,
      `Let's go deeper into this…`,
      `There's more to explore about your question…`,
      `Ginni has been listening to your journey…`
    ];
    
    return messages[Math.floor(Date.now() / 10000) % messages.length];
  };

  return (
    <>
      <motion.button
        onClick={isOpen ? handleClose : handleOpen}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="fixed bottom-6 right-6 z-50 group"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.5 
        }}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative"
            >
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-2 bg-card border border-primary/20 rounded-lg shadow-lg whitespace-nowrap"
                >
                  <p className="text-sm text-foreground-secondary">Need clarity? Talk to Ginni…</p>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-px w-2 h-2 bg-card border-r border-t border-primary/20 rotate-45" />
                </motion.div>
              )}

              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-purple-400 to-purple-500 shadow-lg flex items-center justify-center cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-300 via-purple-300 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }}
                  className="relative z-10 flex items-center gap-2"
                >
                  <span className="text-2xl">✨</span>
                  <span className="text-white font-medium text-sm">Ginni</span>
                </motion.div>
                
                {showNotification && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    1
                  </motion.span>
                )}
              </div>
              
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(167, 139, 250, 0.4)",
                    "0 0 0 8px rgba(167, 139, 250, 0)",
                    "0 0 0 0 rgba(167, 139, 250, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="close"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg flex items-center justify-center cursor-pointer"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
            className="fixed bottom-24 right-6 z-50 md:bottom-6"
          >
            <div className="w-[360px] h-[500px] md:w-[400px] md:h-[560px] bg-card rounded-2xl shadow-2xl border border-primary/10 overflow-hidden flex flex-col">
              <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-amber-500 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-xl">✨</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Ginni ✨</h3>
                    <p className="text-white/80 text-xs">Your personal tarot guide</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 relative bg-background">
                <AnimatePresence>
                  {showContextNotice && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute top-0 left-0 right-0 z-10 p-3 bg-gradient-to-r from-purple-500/20 to-amber-500/20 border-b border-primary/10"
                    >
                      <p className="text-center text-sm text-foreground-secondary">
                        {getContextMessage()}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-card flex flex-col items-center justify-center p-6 pt-16"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity 
                      }}
                      className="w-16 h-16 mb-4"
                    >
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-purple-500" />
                    </motion.div>
                    <p className="text-foreground-secondary text-center text-sm">
                      {context?.question 
                        ? "Ginni is connecting to your energy…" 
                        : "Ginni is connecting to your energy…"}
                    </p>
                    <div className="flex gap-1 mt-3">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 rounded-full bg-primary"
                          animate={{ 
                            y: [0, -8, 0],
                            opacity: [0.3, 1, 0.3]
                          }}
                          transition={{ 
                            duration: 0.6, 
                            repeat: Infinity,
                            delay: i * 0.15
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                
                <motion.iframe
                  ref={iframeRef}
                  src={iframeSrc}
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLoading ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                    borderRadius: '0 0 16px 16px',
                    visibility: isLoading ? 'hidden' : 'visible'
                  }}
                  title="Chat with Ginni"
                  allow="clipboard-read; clipboard-write"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}