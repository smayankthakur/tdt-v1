'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Compass, Star } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/ui/button';

export default function AboutPage() {
  const { t, isHydrated } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#12121A] to-[#0B0B0F] pt-24 pb-12 md:pt-32 md:pb-16">
      <div className="mx-auto max-w-4xl px-6">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex rounded-full p-4 bg-gold/10 mb-6"
          >
            <Sparkles className="h-8 w-8 text-gold" />
          </motion.div>
          
          <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
            {isHydrated ? t('about.hero.title') : 'About The Journey'}
          </h1>
          <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
            {isHydrated ? t('about.hero.subtitle') : 'Yeh platform sirf readings ke liye nahi bana… Yeh clarity dene ke liye bana hai jab life confusing lagti hai.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center mb-16"
        >
          <div className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <Image
                src="/tdt-v3/bharti.png"
                alt="Bharti Singh - Founder & Tarot Reader"
                fill
                className="object-contain rounded-full"
              />
              <div className="absolute inset-0 rounded-full border-2 border-gold/30" />
              <div className="absolute -bottom-4 -right-4 bg-gold/20 backdrop-blur-md rounded-full p-4 border border-gold/30">
                <Star className="h-6 w-6 text-gold" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
                Bharti Singh
              </h2>
              <p className="text-gold font-medium">{isHydrated ? t('about.founder.role') : 'Founder & Lead Tarot Reader'}</p>
            </div>

            <div className="space-y-4 text-foreground-secondary leading-relaxed">
              <p>
                {isHydrated ? t('about.founder.bio') : 'Over 10 years of experience guiding seekers through life\'s most confusing moments. What started as a personal journey into tarot evolved into a mission — making spiritual guidance accessible to everyone, anytime.'}
              </p>
              <p>
                {isHydrated ? t('about.founder.philosophy') : 'This platform isn\'t about predictions. It\'s about helping you see what you already feel deep inside. The cards don\'t tell you what to do — they help you understand what you already know.'}
              </p>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-2 text-foreground-secondary">
                <Heart className="h-5 w-5 text-gold/70" />
                <span>{isHydrated ? t('about.stats.readings') : '10,000+ Readings'}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground-secondary">
                <Compass className="h-5 w-5 text-gold/70" />
                <span>{isHydrated ? t('about.stats.since') : 'Since 2014'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-16"
        >
          <div className="bg-surface/30 border border-gold/10 rounded-3xl p-8 md:p-12">
            <h3 className="font-heading text-2xl text-foreground mb-6 text-center">
              {isHydrated ? t('about.philosophy.title') : 'The Philosophy'}
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex rounded-full p-3 bg-gold/10 mb-4">
                  <Sparkles className="h-6 w-6 text-gold" />
                </div>
                <h4 className="font-medium text-foreground mb-2">{isHydrated ? t('about.philosophy.clarity.title') : 'Clarity Over Prediction'}</h4>
                <p className="text-sm text-foreground-secondary">
                  {isHydrated ? t('about.philosophy.clarity.desc') : "We don't tell your future. We help you see your present more clearly."}
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex rounded-full p-3 bg-gold/10 mb-4">
                  <Heart className="h-6 w-6 text-gold" />
                </div>
                <h4 className="font-medium text-foreground mb-2">{isHydrated ? t('about.philosophy.personal.title') : 'Personal Over Generic'}</h4>
                <p className="text-sm text-foreground-secondary">
                  {isHydrated ? t('about.philosophy.personal.desc') : 'Every reading is unique. No templates, no copy-paste responses.'}
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex rounded-full p-3 bg-gold/10 mb-4">
                  <Compass className="h-6 w-6 text-gold" />
                </div>
                <h4 className="font-medium text-foreground mb-2">{isHydrated ? t('about.philosophy.guidance.title') : 'Guidance Over Advice'}</h4>
                <p className="text-sm text-foreground-secondary">
                  {isHydrated ? t('about.philosophy.guidance.desc') : 'We guide you to your own answers. The power was always within you.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="font-heading text-2xl text-foreground mb-6 text-center">
            {isHydrated ? t('about.why.title') : 'Why This Platform?'}
          </h3>
          
          <div className="space-y-4 text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            <p>
              {isHydrated ? t('about.why.p1') : 'Traditional tarot readings require appointments, waiting, and often come with a premium price tag. But clarity shouldn\'t wait — and it shouldn\'t cost a fortune.'}
            </p>
            <p>
              {isHydrated ? t('about.why.p2') : 'This platform combines ancient tarot wisdom with modern AI technology to create something truly unique: readings that feel personal, that understand your emotional context, and that give you insight when you need it most.'}
            </p>
            <p>
              {isHydrated ? t('about.why.p3') : "Whether you're at 2 AM with a racing mind or need a quick perspective before a big decision — the answers are here, waiting for you."}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-foreground-secondary mb-6">
            {isHydrated ? t('about.cta.text') : 'Ready to find your clarity?'}
          </p>
          <Link href="/reading">
            <Button size="lg">
              {isHydrated ? t('cta.startReading') : 'Continue'}
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
