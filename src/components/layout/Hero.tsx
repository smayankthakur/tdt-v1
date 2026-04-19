'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { shouldBlockContextMenu, shouldBlockDevTools, shouldBlockScreenshots } from '@/lib/securityConfig';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export default function Hero() {
  const { t, isHydrated } = useLanguage();

  useEffect(() => {
    const shouldProtect = shouldBlockContextMenu() || shouldBlockDevTools() || shouldBlockScreenshots();
    if (!shouldProtect) return;

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        e.key === 'PrintScreen' ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && ['I', 'J'].includes(e.key))
      ) {
        e.preventDefault();
      }
    };
    const handleVisibilityChange = () => {
      document.body.style.filter = document.hidden ? 'blur(10px)' : 'none';
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[rgb(var(--background))]">
       {/* Animated Background */}
       <div className="absolute inset-0">
         {/* Gold gradient orb - top left */}
         <motion.div
           className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
           style={{
             background: 'radial-gradient(circle, rgba(244, 197, 66, 0.08) 0%, transparent 70%)',
             filter: 'blur(60px)',
           }}
           animate={{
             scale: [1, 1.2, 1],
             opacity: [0.5, 0.8, 0.5],
           }}
           transition={{
             duration: 8,
             repeat: Infinity,
             ease: 'easeInOut',
           }}
         />
         {/* Deep red orb - bottom right */}
         <motion.div
           className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
           style={{
             background: 'radial-gradient(circle, rgba(193, 18, 31, 0.1) 0%, transparent 70%)',
             filter: 'blur(50px)',
           }}
           animate={{
             scale: [1.2, 1, 1.2],
             opacity: [0.4, 0.7, 0.4],
           }}
           transition={{
             duration: 6,
             repeat: Infinity,
             ease: 'easeInOut',
           }}
         />
         {/* Center subtle glow */}
         <motion.div
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
           style={{
             background: 'radial-gradient(circle, rgba(244, 197, 66, 0.05) 0%, transparent 50%)',
             filter: 'blur(80px)',
           }}
           animate={{
             rotate: [0, 360],
           }}
           transition={{
             duration: 30,
             repeat: Infinity,
             ease: 'linear',
           }}
         />
         {/* Soft gradient overlay */}
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgb(var(--background))]/30 to-transparent pointer-events-none" />
       </div>

      {/* Floating Stars */}
      <FloatingStars />

      {/* Main Content - Two Column Layout */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:py-20">
        {/* Subtle glow behind text area */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-full lg:w-1/2 h-full max-h-[600px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(244, 197, 66, 0.06) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Mobile: Image first, Desktop: Text first */}
          {/* Mobile: Image column shows first, Text column shows second */}
          {/* Right Column - Stacked Image Composition */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <div className="relative w-full max-w-[500px] aspect-[3/4]">
              {/* Layer 1 - Base Background (imgbg.png) */}
              <div className="absolute inset-0 z-10">
                <Image
                  src="/tdt-v3/imgbg.png"
                  alt="Tarot Reading Background"
                  fill
                  className="object-cover rounded-2xl"
                  priority
                />
              </div>

              {/* Layer 2 - Main Image (img.png) with floating animation */}
              <motion.div
                className="absolute inset-0 z-20 flex items-center justify-center px-8"
                animate={floatAnimation}
              >
                <div className="relative w-full max-w-[500px] aspect-[3/4]">
                  <Image
                    src="/tdt-v3/img.png"
                    alt="Tarot Reading"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                  {/* Soft glow effect */}
                  <div className="absolute inset-0 z-[-1] bg-[rgb(var(--gold))]/20 blur-3xl rounded-full" />
                </div>
              </motion.div>

              {/* Layer 3 - Logo (logo.png) at top-left */}
              <div className="absolute top-4 left-4 z-30">
                <Image
                  src="/tdt-v3/logo.png"
                  alt="The Devine Tarot"
                  width={60}
                  height={60}
                  className="w-12 h-12 lg:w-16 lg:h-16 object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Left Column - Text Content (Mobile: order 2 after image) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left order-2 lg:order-1"
          >
            {/* Micro Bio */}
            <motion.p
              variants={itemVariants}
              className="text-body text-textSecondary max-w-2xl mx-auto lg:mx-0 mb-6 leading-relaxed"
            >
              Yeh sirf tarot nahi hai…
              <br />
              Yeh woh clarity hai jo tum already feel kar rahe ho…
              <br />
              Bas ab usse words milne wale hain.
            </motion.p>

            {/* Powerful Quote (Hook) */}
            <motion.div variants={itemVariants} className="mb-8">
              <p className="font-serif text-hero text-textPrimary leading-tight" style={{
                textShadow: '0 0 30px rgba(244, 197, 66, 0.3), 0 0 60px rgba(244, 197, 66, 0.15)'
              }}>
                "Jo tum poochne wale ho… uska answer tum already feel kar rahe ho."
              </p>
            </motion.div>

            {/* Emotional Layer - Text below quote */}
            <motion.p
              variants={itemVariants}
              className="text-body-sm text-foreground-muted max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Agar tum yahan tak aaye ho… toh kuch toh hai jo tumhe yeh jaan na hai.
            </motion.p>

            {/* CTA Button - Red to Yellow Gradient with Pulse */}
            <motion.div variants={itemVariants}>
              <Link href="/reading">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-red-600 via-[rgb(var(--gold))] to-yellow-400 px-10 py-4 text-lg font-medium tracking-wide text-black overflow-hidden"
                  style={{
                    boxShadow: '0 0 30px rgba(244, 197, 66, 0.5), 0 4px 20px rgba(255, 0, 0, 0.3)',
                  }}
                >
                  {/* Pulsing glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(244, 197, 66, 0.6) 0%, transparent 70%)',
                      filter: 'blur(15px)',
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <span className="relative z-10">Know Your Fortune</span>
                </motion.button>
              </Link>
              {/* Subtext below CTA */}
              <p className="mt-4 text-sm text-foreground-muted text-center font-sans">
                Shayad yeh wahi answer hai jiska tum wait kar rahe the…
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FloatingStars() {
  const stars = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            width: star.size,
            height: star.size,
            left: star.left,
            top: star.top,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}