'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Crown, X } from 'lucide-react';
import Link from 'next/link';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumUpgradeModal({ isOpen, onClose }: PremiumUpgradeModalProps) {
  const [timeUntilReset, setTimeUntilReset] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilReset(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-gradient-to-br from-[#1A1A2E] to-[#0B0B0F] rounded-2xl p-6 md:p-8 border border-[#FFD700]/30 shadow-2xl shadow-[#FFD700]/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF4D4D] flex items-center justify-center">
                <Clock className="w-8 h-8 text-black" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                Your Daily Guidance Is Complete ✨
              </h3>
              <p className="text-[#A1A1AA]">
                Your next message will be available in{' '}
                <span className="text-[#FFD700] font-medium">{timeUntilReset}</span>
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
              <p className="text-white text-center leading-relaxed">
                Unlock unlimited conversations with Ginni and receive deeper spiritual guidance anytime you want.
              </p>
            </div>

            <Link href="/premium" passHref>
              <button
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FF4D4D] text-black font-bold text-lg hover:shadow-lg hover:shadow-[#FFD700]/25 transition-all transform hover:scale-[1.02]"
                onClick={onClose}
              >
                Upgrade to Premium — ₹199/month
              </button>
            </Link>

            <button
              onClick={onClose}
              className="w-full mt-3 text-sm text-[#A1A1AA] hover:text-white transition-colors"
            >
              Continue Exploring
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}