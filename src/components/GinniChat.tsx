'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GinniChatProps {
  autoOpenDelay?: number;
  showNotification?: boolean;
}

export default function GinniChat({ 
  autoOpenDelay = 0, 
  showNotification = true 
}: GinniChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (autoOpenDelay > 0 && !hasAutoOpened) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasAutoOpened(true);
      }, autoOpenDelay);
      return () => clearTimeout(timer);
    }
  }, [autoOpenDelay, hasAutoOpened]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsLoading(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
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
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-card flex flex-col items-center justify-center p-6"
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
                      Ginni is connecting to your energy…
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
                  src="https://ginni-ki-baatein.lovable.app/"
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
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}