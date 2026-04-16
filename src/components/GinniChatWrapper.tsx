'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GinniChat from '@/components/GinniChat';
import { useGinniStore } from '@/store/ginni-store';
import { usePersonalizationContext } from '@/components/personalization/PersonalizationProvider';
import { useLanguage } from '@/hooks/useLanguage';
import type { GinniContext } from '@/components/GinniChat';
import { MessageCircle, X } from 'lucide-react';

export default function GinniChatWrapper() {
  const { context, triggerOpen, isOpen, setIsOpen, setTriggerOpen } = useGinniStore();
  const { profile, rules, isPersonalized } = usePersonalizationContext();
  const { t, getChatButtonText, getChatTooltip, isHydrated } = useLanguage();
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [floatingButtonVisible, setFloatingButtonVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFloatingButton(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isPersonalized || !profile) return;
    
    const { triggerOnIdle, idleTimeoutMinutes } = rules.chat;
    
    if (!triggerOnIdle) return;

    const handleActivity = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      
      idleTimerRef.current = setTimeout(() => {
        if (!isOpen && profile.engagementLevel !== 'low') {
          const store = useGinniStore.getState();
          if (!store.triggerOpen) {
            store.setTriggerOpen(true);
          }
        }
      }, idleTimeoutMinutes * 60 * 1000);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [isPersonalized, profile, rules.chat, isOpen]);

  const getPersonalizedContext = (): GinniContext | undefined => {
    if (!context && isPersonalized && profile) {
      return {
        question: rules.chat.contextMessage,
        theme: profile.dominantIntent,
        emotion: profile.engagementLevel === 'high' ? 'intense' : 
                 profile.engagementLevel === 'low' ? 'calm' : 'neutral',
      };
    }
    return undefined;
  };

  const personalizedContext = getPersonalizedContext();
  const finalContext = context || personalizedContext;

  const autoOpenDelay = isPersonalized && profile?.isHighIntent ? 3000 : 0;

  const handleOpenChat = () => {
    setIsOpen(true);
    setFloatingButtonVisible(false);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setTimeout(() => setFloatingButtonVisible(true), 2000);
  };

  return (
    <>
      {/* Floating Button - Premium Polish */}
      <AnimatePresence>
        {showFloatingButton && floatingButtonVisible && !isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenChat}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 px-5 py-3 font-semibold text-white"
            style={{
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4), 0 0 15px rgba(124, 58, 237, 0.2)',
            }}
          >
            {/* Pulsing glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)',
              }}
              animate={{
                boxShadow: [
                  '0 0 15px rgba(124, 58, 237, 0.3)',
                  '0 0 25px rgba(124, 58, 237, 0.5)',
                  '0 0 15px rgba(124, 58, 237, 0.3)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <MessageCircle className="h-5 w-5 relative z-10" />
            <span className="relative z-10">
              {isHydrated ? getChatButtonText() : 'Talk to Ginni'}
            </span>
            <SparkleIcon />
          </motion.button>
        )}
      </AnimatePresence>

      <GinniChat 
        autoOpenDelay={autoOpenDelay}
        showNotification={rules.chat.triggerOnIdle && profile?.engagementLevel !== 'low'}
        context={finalContext}
        triggerOpen={triggerOpen}
        onOpen={() => {
          setTriggerOpen(false);
          setFloatingButtonVisible(false);
        }}
        onClose={() => {
          setIsOpen(false);
          setTimeout(() => setFloatingButtonVisible(true), 2000);
        }}
      />
    </>
  );
}

function SparkleIcon() {
  return (
    <motion.span
      animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="text-purple-200 relative z-10"
    >
      ✨
    </motion.span>
  );
}