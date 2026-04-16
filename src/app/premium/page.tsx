'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import Link from 'next/link';
import { SUBSCRIPTION_PLANS, type PlanType } from '@/lib/payments/plans';

const PLAN_ICONS: Record<PlanType, typeof Sparkles> = {
  free: Sparkles,
  premium: Zap,
  pro: Crown,
};

const PLAN_COLORS: Record<PlanType, string> = {
  free: 'from-purple-600/20 to-indigo-600/20 border-purple-800/30',
  premium: 'from-purple-600 to-indigo-600 border-purple-500',
  pro: 'from-amber-500 to-orange-500 border-amber-500/50',
};

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#1A1A2E] to-[#0B0B0F] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-4xl md:text-5xl text-purple-200 mb-4">
            Unlock Divine Guidance
          </h1>
          <p className="text-lg text-purple-300/60 max-w-2xl mx-auto">
            Choose your path to deeper insights. Upgrade for unlimited readings, 
            priority AI responses, and exclusive WhatsApp guidance.
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
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </div>
                )}
                
                <div className="rounded-xl bg-[#0B0B0F]/80 p-8 h-full flex flex-col">
                  <div className="text-center mb-6">
                    <div className={`inline-flex rounded-full p-3 mb-4 ${
                      planType === 'pro' 
                        ? 'bg-amber-500/20 text-amber-400'
                        : planType === 'premium'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-purple-800/20 text-purple-400'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-2xl text-purple-200 mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-4xl font-bold text-white">
                      {plan.price === 0 ? (
                        'Free'
                      ) : (
                        <>
                          <span className="text-2xl">₹</span>{plan.price}
                          <span className="text-lg text-purple-300/60">/mo</span>
                        </>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-purple-200/70">
                        <Check className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={planType === 'free' ? '/reading' : '/booking'}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full rounded-full py-3 font-semibold transition-all ${
                        planType === 'free'
                          ? 'border border-purple-500/50 text-purple-300 hover:bg-purple-500/20'
                          : planType === 'pro'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                      }`}
                    >
                      {planType === 'free' ? 'Get Started Free' : 'Subscribe Now'}
                    </motion.button>
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
          <p className="text-purple-300/50 text-sm">
            All plans include a 7-day money-back guarantee. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
