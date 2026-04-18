'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={cn(
                'relative w-full pointer-events-auto',
                sizeStyles[size]
              )}
            >
              {/* Glass Panel */}
              <div className="relative bg-[#1A1A1A]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#F4C542]/20 shadow-[0_0_60px_rgba(244,197,66,0.1)]">
                {/* Glow accent */}
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-[#F4C542] to-transparent" />
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full text-[#7A7A7A] hover:text-[#EAEAEA] hover:bg-[#ffffff]/5 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Content */}
                {title && (
                  <h2 className="font-serif text-xl text-[#EAEAEA] mb-2">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-[#A8A8A8] mb-4">
                    {description}
                  </p>
                )}
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}