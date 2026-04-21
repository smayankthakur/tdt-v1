'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

export default function AboutSection() {
  const { t, isHydrated } = useLanguage();

  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-20 bg-background">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* LEFT: TEXT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-6 order-2 md:order-1"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text-primary">
            {isHydrated ? t('home.about.title') : 'About the Reader'}
          </h2>

          <p className="text-base md:text-lg leading-relaxed text-text-secondary opacity-90">
            {isHydrated ? t('home.about.paragraph1') : 'Your intuition already knows the truth. This space helps you hear it more clearly.'}
          </p>

          <p className="text-base md:text-lg leading-relaxed text-text-secondary opacity-80">
            {isHydrated ? t('home.about.paragraph2') : 'Each reading is designed to feel personal, calm, and deeply connected to your situation.'}
          </p>

          {/* Optional: Feature highlights */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-gold" />
              <span className="text-sm md:text-base text-text-secondary">
                {isHydrated ? t('home.about.feature1') : 'AI-powered insights'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-end" />
              <span className="text-sm md:text-base text-text-secondary">
                {isHydrated ? t('home.about.feature2') : 'Spiritual guidance'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-end" />
              <span className="text-sm md:text-base text-text-secondary">
                {isHydrated ? t('home.about.feature3') : 'Personalized clarity'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: STACKED IMAGE (mirrors Hero) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative flex items-center justify-center order-1 md:order-2"
        >
          <div className="relative w-full max-w-[450px] md:max-w-[500px] aspect-[3/4]">

            {/* Layer 1 — imgbg.png: Background layer, blurred, soft opacity */}
            <div className="absolute inset-0 z-10">
              <Image
                src="/tdt-v3/imgbg.png"
                alt="Background Layer"
                fill
                className="object-contain opacity-40 blur-sm drop-shadow-[0_0_30px_rgba(255,215,0,0.15)]"
                priority
              />
            </div>

            {/* Layer 2 — img.png: Main image, floating */}
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center px-6 md:px-8"
              animate={floatAnimation}
            >
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src="/tdt-v3/img.png"
                  alt="Tarot Reader"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
                {/* Soft glow behind main image */}
                <div className="absolute inset-0 z-[-1] bg-accent-end/20 blur-3xl rounded-full" />
              </div>
            </motion.div>

            {/* Layer 3 — logo.png: Top-left overlay */}
            <div className="absolute top-4 left-4 z-30">
              <Image
                src="/tdt-v3/logo.png"
                alt="The Devine Tarot Logo"
                width={60}
                height={60}
                className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-lg"
                priority
              />
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
