'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SUBSCRIPTION_PLANS, type PlanType } from '@/lib/payments/plans';
import { useTranslation } from '@/hooks/useTranslation';

export default function PremiumPage() {
  const { t } = useTranslation();
  const plans = SUBSCRIPTION_PLANS;

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] py-20">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-h1 mb-4">
            Unlock Your Complete Tarot Journey
          </h1>
          <p className="text-body text-[#A1A1AA] max-w-2xl mx-auto">
            Elevate your spiritual practice with premium features and unlimited guidance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.values(plans).map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl p-8 border ${
                plan.id === 'premium'
                  ? 'bg-gradient-to-br from-[#FFD700]/10 to-[#FF4D4D]/5 border-[#FFD700]/30'
                  : 'bg-white/5 border-[#3C281A]/50'
              }`}
            >
              {plan.id === 'premium' && (
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#FFD700]" />
                  <span className="text-[#FFD700] font-semibold">Most Popular</span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-[#EAEAF0] mb-2">
                {plan.name}
              </h3>

              <div className="mb-6">
                <span className="text-4xl font-bold text-[#EAEAF0]">
                  ${plan.price}
                </span>
                <span className="text-[#A1A1AA]">/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-[#A1A1AA]">
                    <Check className="w-5 h-5 text-[#10B981]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/payment" passHref legacyBehavior>
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.id === 'premium'
                      ? 'bg-gradient-to-r from-[#FFD700] to-[#FF4D4D] text-[#000] hover:shadow-lg hover:shadow-[#FFD700]/25'
                      : 'bg-white/10 text-[#EAEAF0] hover:bg-white/20'
                  }`}
                >
                  Get Started
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
