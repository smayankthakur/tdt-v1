'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap, Heart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const features = [
  { 
    icon: Brain, 
    title: 'Reading That Feels You', 
    description: 'Not robotic responses - emotionally intelligent guidance that connects with you personally.' 
  },
  { 
    icon: Sparkles, 
    title: 'Personalized Insights', 
    description: 'Every reading is unique. The cards speak to your specific situation, not generic answers.' 
  },
  { 
    icon: Zap, 
    title: 'Instant Clarity', 
    description: 'Get answers in seconds. No waiting, no appointments - just immediate spiritual guidance.' 
  },
  { 
    icon: Heart, 
    title: 'Deep Emotional Connection', 
    description: 'Feel understood. The AI recognizes your emotional state and responds with empathy.' 
  },
];

export default function WhySection() {
  const { t, isHydrated } = useLanguage();
  return (
    <section className="py-section bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-block lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-heading text-foreground mb-element">
              Why The Devine Tarot?
            </h2>
            <p className="text-subheading text-foreground-secondary leading-relaxed mb-block">
              We combine ancient tarot wisdom with cutting-edge AI technology to
              create something truly unique — readings that feel personal, profound,
              and precisely tailored to you.
            </p>
            <p className="text-body text-foreground-secondary leading-relaxed mb-block">
              Unlike generic fortune tellers, our AI understands context, recognizes
              emotional patterns, and provides guidance that resonates with your
              specific journey.
            </p>

            <div className="flex flex-wrap gap-element">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold-10 text-gold text-sm font-medium border border-gold-20">
                <Sparkles className="h-4 w-4" />
                <span>10,000+ readings</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-10 text-secondary text-sm font-medium border border-secondary-20">
                <Heart className="h-4 w-4" />
                <span>{isHydrated ? t('whySection.rating') : '4.9 rating'}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold-10 text-gold text-sm font-medium border border-gold-20">
                <Zap className="h-4 w-4" />
                <span>{isHydrated ? t('common.under60seconds') : 'Under 60 seconds'}</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-element"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ x: 8, transition: { duration: 0.3 } }}
                className="flex gap-4 p-6 rounded-2xl bg-surface-60 backdrop-blur-sm border border-gold-10 hover:border-gold-30 hover:glow-gold transition-all cursor-pointer"
              >
                <motion.div
                  className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-10 to-secondary-10 border border-gold-20"
                  whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                >
                  <feature.icon className="h-6 w-6 text-gold" />
                </motion.div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-element">
                    {feature.title}
                  </h3>
                  <p className="text-body-sm text-foreground-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}