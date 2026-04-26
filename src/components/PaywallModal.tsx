'use client';

import { motion } from 'framer-motion';
import { X, Sparkles, Zap, Lock } from "lucide-react";
import { SUBSCRIPTION_PLANS, type PlanType } from '@/lib/payments/plans';
import Button from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  remainingReads?: number;
}

export default function PaywallModal({ isOpen, onClose, onUpgrade, remainingReads }: PaywallModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const premiumPlan = SUBSCRIPTION_PLANS.premium;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md rounded-3xl border-2 border-[rgb(var(--gold))/30] bg-gradient-to-br from-[rgb(var(--surface))] to-[rgb(var(--background))] p-1 shadow-2xl shadow-[rgb(var(--gold))/10]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Premium header section */}
        <div className="relative rounded-t-2xl bg-gradient-to-br from-[rgb(var(--gold-start))/20] to-[rgb(var(--gold))/10] p-8 text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-[rgb(var(--foreground-muted))] hover:bg-[rgb(var(--gold))/10] hover:text-[rgb(var(--gold))] transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[rgb(var(--gold))] to-[rgb(var(--gold-start))] shadow-[0_0_30px_rgba(244,197,66,0.5)]">
              <Zap className="h-8 w-8 text-black" />
            </div>
          </div>

          <h2 className="font-heading text-2xl md:text-3xl text-[rgb(var(--gold))] mb-2">
            {t('paywall.modal.title')}
          </h2>
          
          <p className="text-[rgb(var(--foreground-secondary))] mb-4">
            {remainingReads !== undefined && remainingReads >= 0
              ? t('paywall.modal.subtitleWithCount', { count: remainingReads.toString() })
              : t('paywall.modal.subtitle')}
          </p>

          <div className="rounded-xl bg-[rgb(var(--background))]/80 p-4 mx-auto max-w-xs">
            <div className="text-3xl font-bold text-[rgb(var(--gold))]">
              ₹{premiumPlan.price}
              <span className="text-base font-normal text-[rgb(var(--foreground-muted))]">/mo</span>
            </div>
            <div className="text-xs text-[rgb(var(--gold))]/70 mt-1">
              Unlimited readings • Deep AI insights
            </div>
          </div>
        </div>

        {/* Features list */}
        <div className="p-6 space-y-3">
          {premiumPlan.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[rgb(var(--gold))/10]">
                <Lock className="h-3 w-3 text-[rgb(var(--gold))]" />
              </div>
              <span className="text-[rgb(var(--foreground))]">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="p-6 pt-0 space-y-3">
          <Button
            size="lg"
            variant="primary"
            className="w-full text-lg font-semibold h-12"
            onClick={onUpgrade}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {t('paywall.modal.upgradeButton')}
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            className="w-full"
            onClick={onClose}
          >
            {t('common.maybeLater')}
          </Button>
        </div>

        {/* Trust badge */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-[rgb(var(--foreground-muted))]">
            🔒 Secure payment • Cancel anytime • {t('common.noPressure')}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
