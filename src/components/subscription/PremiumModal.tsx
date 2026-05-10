'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, CheckCircle2, Sparkles, Star, Gem, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/lib/auth/useUser';
import { useSubscription } from '@/lib/subscription/useSubscription';
import { createPremiumOrder, activatePremiumSubscription } from '@/lib/subscription/checkAccess';
import { logEvent } from '@/lib/utils/tracking';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerSource?: 'paywall' | 'manual' | 'upsell';
  onPaymentSuccess?: () => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PremiumModal({
  isOpen,
  onClose,
  triggerSource = 'manual',
  onPaymentSuccess,
}: PremiumModalProps) {
  const { user } = useUser();
  const { setPaymentStatus } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderData, setOrderData] = useState<{ orderId: string; amount: number; key: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const userId = user?.id || null;

  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsProcessing(false);
      setShowSuccess(false);
      setOrderData(null);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, isProcessing, onClose]);

  // Initiate payment
  const initiatePayment = useCallback(async () => {
    if (!userId || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Track payment initiation
      logEvent('premium_payment_initiated', { triggerSource, userId });

      const order = await createPremiumOrder(userId);
      
      if (!order) {
        setError('Failed to create order. Please try again.');
        setIsProcessing(false);
        return;
      }

      setOrderData(order);

      // Check if Razorpay is available
      if (!window.Razorpay) {
        // Fallback mode - simulate payment for development
        handleMockPayment(order);
        return;
      }

      const options: RazorpayOptions = {
        key: order.key,
        amount: order.amount * 100, // Convert to paise
        currency: 'INR',
        name: 'The Divine Tarot',
        description: 'Premium Monthly Subscription',
        order_id: order.orderId,
        handler: async (response) => {
          await handlePaymentSuccess(response, order.orderId);
        },
        prefill: {
          name: user?.phone || 'User',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#FFD700',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            logEvent('premium_payment_dismissed', { userId });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', (response: any) => {
        setError('Payment failed. Please try again.');
        setIsProcessing(false);
        logEvent('premium_payment_failed', { 
          userId, 
          error: response.error?.reason 
        });
      });

      rzp.open();

    } catch (err: any) {
      console.error('[PremiumModal] Payment error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  }, [userId, isProcessing, triggerSource, user]);

  // Handle mock payment (development mode)
  const handleMockPayment = async (order: { orderId: string; amount: number }) => {
    setIsProcessing(true);
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    await handlePaymentSuccess(
      {
        razorpay_payment_id: `mock_payment_${Date.now()}`,
        razorpay_order_id: order.orderId,
        razorpay_signature: 'mock_signature',
      },
      order.orderId
    );
  };

  // Handle successful payment
  const handlePaymentSuccess = async (
    response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    },
    orderId: string
  ) => {
    try {
      const result = await activatePremiumSubscription(userId!, {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });

      if (result.success) {
        // Set premium override for instant UI update
        localStorage.setItem('premium_override', 'true');
        localStorage.setItem('premium_activated_at', new Date().toISOString());

        setPaymentStatus('success');
        setShowSuccess(true);

        logEvent('premium_payment_success', { 
          userId, 
          orderId,
          paymentId: response.razorpay_payment_id 
        });

        // Track conversion event
        logEvent('premium_conversion', {
          userId,
          triggerSource,
          amount: 199,
          currency: 'INR',
        });

        // Send unlock message to iframe
        sendUnlockToIframe();

        // Close modal after brief success display
        setTimeout(() => {
          onClose();
          if (onPaymentSuccess) onPaymentSuccess();
        }, 2500);
      } else {
        setError(result.error || 'Failed to activate subscription.');
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('[PremiumModal] Activation error:', err);
      setError('Failed to activate subscription. Please contact support.');
      setIsProcessing(false);
    }
  };

  // Send unlock message to iframe
  const sendUnlockToIframe = useCallback(() => {
    // Find the iframe element
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      try {
        iframe.contentWindow?.postMessage(
          { type: 'SUBSCRIPTION_SUCCESS', plan: 'premium' },
          '*'
        );
      } catch (e) {
        // Cross-origin errors are expected
        console.log('[PremiumModal] Message sent to iframe');
      }
    });

    // Also dispatch custom event for parent components
    window.dispatchEvent(new CustomEvent('subscription_activated', {
      detail: { plan: 'premium' }
    }));
  }, []);

  // Also listen for iframe messages
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'INITIATE_UPGRADE') {
        // Open payment flow when iframe requests upgrade
        initiatePayment();
      }
    };

    if (isOpen) {
      window.addEventListener('message', handler);
    }

    return () => window.removeEventListener('message', handler);
  }, [isOpen, initiatePayment]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isProcessing) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Premium subscription upgrade"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className={cn(
              "relative w-full max-w-lg bg-gradient-to-br from-[#1A1A2E] via-[#16162A] to-[#0B0B0F] ",
              "rounded-[28px] p-6 md:p-8 border border-[#FFD700]/20",
              "shadow-[0_0_60px_rgba(255,215,0,0.08)] shadow-[0_0_120px_rgba(124,58,237,0.05)]",
              "overflow-hidden",
              isProcessing && 'pointer-events-none'
            )}
          >
            {/* Background decorations */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FFD700]/[0.03] rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#FF4D4D]/[0.03] rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFD700]/[0.02] to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 
                         transition-all duration-300 disabled:opacity-40 z-10"
              aria-label="Close modal"
            >
              <X className={`w-4 h-4 text-white ${isProcessing ? 'animate-pulse' : ''}`} />
            </button>

            {/* Content */}
            <div className="relative z-10">
              {showSuccess ? (
                /* === SUCCESS STATE === */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-4"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.15, 1],
                      boxShadow: ['0 0 20px rgba(255,215,0,0.3)', '0 0 40px rgba(255,215,0,0.5)', '0 0 20px rgba(255,215,0,0.3)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] 
                               flex items-center justify-center shadow-lg shadow-[#FFD700]/30"
                  >
                    <Crown className="w-10 h-10 text-black" />
                  </motion.div>

                  <h3 className="font-heading text-2xl md:text-3xl text-white mb-3">
                    Welcome to Premium! 👑
                  </h3>
                  
                  <p className="text-purple-200/80 text-sm md:text-base max-w-sm mx-auto mb-2">
                    Your spiritual journey just got unlimited. Ginni is ready to guide you without limits.
                  </p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/20 
                               rounded-full px-4 py-2 mt-4"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-[#FFD700] text-sm font-medium">
                      ₹199/month — Active
                    </span>
                  </motion.div>
                </motion.div>
              ) : (
                /* === DEFAULT STATE === */
                <>
                  {/* Header */}
                  <div className="text-center mb-6">
                    <motion.div
                      animate={{ 
                        boxShadow: ['0 0 20px rgba(255,215,0,0.2)', '0 0 40px rgba(255,215,0,0.4), 0 0 60px rgba(255,77,77,0.1)', '0 0 20px rgba(255,215,0,0.2)'] 
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FFD700] via-[#FF4D4D] to-[#FFD700] 
                                 flex items-center justify-center shadow-lg"
                    >
                      <Crown className="w-8 h-8 text-black" />
                    </motion.div>

                    <h3 className="font-heading text-2xl md:text-3xl text-white mb-2 leading-tight">
                      Your Daily Guidance Is Complete ✨
                    </h3>
                    
                    <p className="text-[#A1A1AA] text-sm md:text-base max-w-sm mx-auto">
                      Ginni has revealed today&apos;s message for you.
                      <br />
                      To continue your spiritual journey, unlock unlimited guidance.
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="space-y-2.5 mb-6">
                    {[
                      { icon: <Sparkles className="w-4 h-4" />, text: 'Unlimited tarot readings' },
                      { icon: <Star className="w-4 h-4" />, text: 'Unlimited messages with Ginni' },
                      { icon: <Gem className="w-4 h-4" />, text: 'Deeper emotional guidance' },
                      { icon: <Crown className="w-4 h-4" />, text: 'Priority spiritual experience' },
                      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Unlimited clarity anytime' },
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]
                                   hover:bg-white/[0.06] transition-colors"
                      >
                        <span className="text-[#FFD700] flex-shrink-0">{feature.icon}</span>
                        <span className="text-[#A1A1AA] text-sm">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Error display */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-center"
                    >
                      <p className="text-red-400 text-sm">{error}</p>
                    </motion.div>
                  )}

                  {/* CTA Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={initiatePayment}
                    disabled={isProcessing}
                    className={cn(
                      "w-full py-4 rounded-2xl bg-gradient-to-r from-[#FFD700] to-[#FFC400] ",
                      "text-black font-bold text-base md:text-lg",
                      "hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:shadow-[0_0_60px_rgba(255,215,0,0.15)]",
                      "transition-all duration-300 active:scale-[0.98]",
                      "relative overflow-hidden",
                      isProcessing && 'opacity-70 cursor-not-allowed'
                    )}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isProcessing ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Crown className="w-5 h-5" />
                          Unlock Premium — ₹199/month
                        </>
                      )}
                    </span>
                    {/* Animated shimmer */}
                    {!isProcessing && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
                      />
                    )}
                  </motion.button>

                  {/* Secondary CTA */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={onClose}
                    disabled={isProcessing}
                    className="w-full mt-3 text-sm text-purple-400/60 hover:text-purple-300 
                               transition-colors py-2 flex items-center justify-center gap-1"
                  >
                    <Clock className="w-3 h-3" />
                    Come Back Tomorrow for another free reading
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Export the trigger event for external use
export const triggerPremiumModal = () => {
  window.dispatchEvent(new CustomEvent('openPremiumModal'));
};