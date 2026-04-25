'use client';

import { motion } from 'framer-motion';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getPremiumCTA } from '@/lib/behavioral/engine';
import Button from '@/components/ui/button';

interface SoftPaywallProps {
  triggerReason?: 'deep_engagement' | 'hesitation' | 'recurring_theme' | 'general';
  onClose?: () => void;
  onUnlock?: () => void;
}

export default function SoftPaywall({
  triggerReason = 'deep_engagement',
  onClose,
  onUnlock,
}: SoftPaywallProps) {
  const { t, language } = useTranslation();

  const getMessage = () => {
    const titleKey = `paywall.messages.${triggerReason}.title`;
    const descKey = `paywall.messages.${triggerReason}.desc`;
    
    return {
      title: t(titleKey),
      desc: t(descKey),
    };
  };

  const content = getMessage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 via-gold/5 to-purple-900/40 border border-gold/30 backdrop-blur-sm overflow-hidden"
    >
      {/* Mystical glow effect */}
      <div className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(244,197,66,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(147,51,234,0.15) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 space-y-4">
        {/* Icon and Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold/20 border border-gold/40">
            <Lock className="h-5 w-5 text-gold" />
          </div>
          <h3 className="font-heading text-lg md:text-xl text-gold">
            {content.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-foreground/80 leading-relaxed text-sm md:text-base max-w-lg mx-auto">
          {content.desc}
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={onUnlock}
            className="bg-gold text-black hover:bg-gold/90 font-medium"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {getPremiumCTA(language)}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          {onClose && (
            <Button
              variant="ghost"
              size="md"
              onClick={onClose}
              className="text-foreground-muted hover:text-foreground"
            >
              {t('common.maybeLater')}
            </Button>
          )}
        </div>

        {/* Trust indicator */}
         <p className="text-xs text-center text-foreground-muted mt-3">
          {t('common.noPressure')}
        </p>
      </div>
    </motion.div>
  );
}
