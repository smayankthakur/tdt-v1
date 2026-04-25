'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import Link from 'next/link';
import { SUBSCRIPTION_PLANS, type PlanType } from '@/lib/payments/plans';
import Button from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

const PLAN_ICONS: Record<PlanType, typeof Sparkles> = {
  free: Sparkles,
  premium: Zap,
  pro: Crown,
};

const PLAN_COLORS: Record<PlanType, string> = {
  free: 'from-[rgb(var(--gold))/10] to-[rgb(var(--surface))/20] border-[rgb(var(--gold))/20]',
  premium: 'from-[rgb(var(--gold-start))/20] to-[rgb(var(--gold))/10] border-[rgb(var(--gold))/30]',
  pro: 'from-[rgb(var(--gold-start))/20] to-[rgb(var(--gold))/10] border-[rgb(var(--gold))/40]',
};

export default function PremiumPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--background))] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-[rgb(var(--foreground))] mb-4">
            {t('premium.page.title')}
          </h1>
          <p className="text-lg text-[rgb(var(--foreground-secondary))] max-w-2xl mx-auto">
            {t('premium.page.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {(Object.keys(SUBSCRIPTION_PLANS) as PlanType[]).map((planType, index) => {
            const plan = SUBSCRIPTION_PLANS[planType];
            const Icon = PLAN_ICONS[planType];
            const isPopular = planType === 'premium';
            
            return (
              <motion.div
                key={planType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl border bg-gradient-to-b ${PLAN_COLORS[planType]} p-1`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[rgb(var(--gold-start))] to-[rgb(var(--gold))] px-4 py-1 text-sm font-semibold text-black">
                    {t('premium.mostPopular')}
                  </div>
                )}
                
                <div className="rounded-xl bg-[rgb(var(--background))]/80 p-8 h-full flex flex-col">
                  <div className="text-center mb-6">
                    <div className={`inline-flex rounded-full p-3 mb-4 ${
                      planType === 'pro' 
                        ? 'bg-[rgb(var(--gold))/20] text-[rgb(var(--gold))]'
                        : planType === 'premium'
                        ? 'bg-[rgb(var(--gold))/20] text-[rgb(var(--gold))]'
                        : 'bg-[rgb(var(--surface))/20] text-[rgb(var(--foreground-secondary))]'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-2xl text-[rgb(var(--foreground))] mb-2">
                      {t(`premium.plans.${planType}.name`)}
                    </h3>
                    <div className="text-4xl font-bold text-[rgb(var(--foreground))]">
                      {plan.price === 0 ? (
                        t('premium.plans.free.name')
                      ) : (
                        <>
                          <span className="text-2xl">₹</span>{plan.price}
                          <span className="text-lg text-[rgb(var(--foreground-muted))]">/mo</span>
                        </>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-[rgb(var(--foreground-secondary))]">
                        <Check className="h-5 w-5 text-[rgb(var(--gold))] flex-shrink-0 mt-0.5" />
                        <span>{t(`premium.plans.${planType}.features.${i}`)}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={planType === 'free' ? '/reading' : '/booking'} className="block">
                    <Button 
                      size="lg" 
                      variant={planType === 'free' ? 'secondary' : 'primary'}
                      className="w-full"
                    >
                      {planType === 'free' ? t('premium.buttons.getStarted') : t('premium.buttons.subscribe')}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-[rgb(var(--foreground-muted))] text-sm">
            {t('premium.guarantee')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
