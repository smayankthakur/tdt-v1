'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Sparkle, Crown } from 'lucide-react';
import { usePersonalization, useHeroContent } from '@/hooks/usePersonalization';
import { useLanguage } from '@/hooks/useLanguage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

interface HeroProps {
  userId?: string | null;
}

export default function Hero({ userId }: HeroProps) {
  const { profile, rules, isLoading } = usePersonalization(userId ?? null);
  const heroContent = useHeroContent(rules);
  const { t, isHydrated, getHeroHeadline, getHeroSubheadline, getCTAText } = useLanguage();

  const headline = isHydrated ? getHeroHeadline(profile?.dominantIntent || 'default') : heroContent.headline;
  const subheadline = isHydrated ? getHeroSubheadline(profile?.dominantIntent || 'default') : heroContent.subheadline;
  const ctaPrimary = isHydrated ? getCTAText(heroContent.ctaPrimary) : heroContent.ctaPrimary;
  const ctaSecondary = isHydrated ? t('cta.talkToGinni') : heroContent.ctaSecondary;

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && ['u', 's', 'c'].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && ['i', 'j'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
      }
    };
    const handleVisibilityChange = () => {
      document.body.style.filter = document.hidden ? 'blur(8px)' : 'none';
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.body.style.filter = 'none';
    };
  }, []);

  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="flex items-center gap-2">
          <Sparkle className="h-6 w-6 text-amber-500 animate-pulse" />
          <span>{t('common.loading')}</span>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* LAYER 1: Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-20 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          {/* LAYER 3: Text Content (Left Side) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="mb-6 flex justify-center lg:justify-start">
              <div className="relative">
                <Sparkle className="h-10 w-10 text-amber-400" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkle className="h-10 w-10 text-amber-300" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-heading text-4xl leading-[1.2] text-white md:text-5xl lg:text-6xl drop-shadow-lg"
            >
              {headline.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && heroContent.showUrgency && (
                    <motion.span
                      className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-500/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-amber-200 border border-amber-400/30"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Sparkle className="h-3 w-3" />
                      {t('urgency.timeSensitive')}
                    </motion.span>
                  )}
                  <br />
                </span>
              ))}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-8 max-w-xl text-lg text-white/80 leading-relaxed lg:mx-0 drop-shadow"
            >
              {subheadline}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-col items-center gap-6 lg:items-start"
            >
              <div className="flex flex-wrap justify-center gap-4 lg:gap-4">
                {heroContent.showPremiumBadge && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 backdrop-blur-sm px-4 py-1 text-sm font-medium text-amber-200 border border-amber-400/30"
                  >
                    <Crown className="h-4 w-4" />
                    <span>{t('premium.badge')}</span>
                  </motion.div>
                )}

                <Link href="/reading">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                  >
                    <span className="relative z-10">{ctaPrimary}</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 via-purple-500 to-amber-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  </motion.div>
                </Link>

                <Link href="/booking">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 font-semibold text-white transition-all hover:bg-white/20"
                  >
                    {ctaSecondary}
                  </motion.div>
                </Link>
              </div>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 text-sm text-white/60"
              >
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>Trusted by 10,000+ seekers</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* LAYER 2: Foreground Image with Logo Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full max-w-md lg:max-w-lg"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  {/* Foreground Image */}
                  <Image
                    src="/img.png"
                    alt="The Devine Tarot Reading"
                    width={500}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  {/* LAYER 3: Logo (Top Left) */}
                  <div className="absolute top-4 left-4 z-20">
                    <Image
                      src="/tdt-v3/logo.png"
                      alt="The Devine Tarot Logo"
                      width={80}
                      height={80}
                      className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain drop-shadow-lg"
                      priority={false}
                    />
                  </div>
                  
                  {/* Name Overlay (Bottom Center) */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                    <span 
                      className="text-xl sm:text-2xl md:text-3xl text-white font-serif"
                      style={{
                        textShadow: '0 2px 4px rgba(0,0,0,0.7), 0 0 30px rgba(0,0,0,0.5)',
                        fontFamily: 'Playfair Display, serif'
                      }}
                    >
                      Bharti Singh
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Decorative glow effects */}
              <motion.div
                className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-amber-400/20 blur-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-purple-400/20 blur-3xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="h-10 w-6 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <motion.div
            className="h-2 w-1 rounded-full bg-white/50"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}