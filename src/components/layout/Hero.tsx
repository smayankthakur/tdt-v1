'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkle, Moon, Star } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0B0F]">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
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
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, transparent 70%)',
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
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 50%)',
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
      </div>

      {/* Floating Stars */}
      <FloatingStars />

      {/* Main Content - Two Column Layout */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-heading text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6"
            >
              Your future is already written.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400">
                You just need to see it.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              Ask your question, pick your cards, and receive a deeply personal reading that reveals what&apos;s really going on.
            </motion.p>

            {/* CTA Button - Premium Polish */}
            <motion.div variants={itemVariants}>
              <Link href="/reading">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 px-10 py-4 text-lg font-semibold text-white overflow-hidden"
                  style={{
                    boxShadow: '0 4px 20px rgba(255, 100, 0, 0.3)',
                  }}
                >
                  {/* Pulsing glow */}
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      boxShadow: '0 0 20px rgba(255, 150, 0, 0.4)',
                    }}
                    animate={{
                      boxShadow: [
                        '0 0 15px rgba(255, 100, 0, 0.3)',
                        '0 0 30px rgba(255, 150, 0, 0.6)',
                        '0 0 15px rgba(255, 100, 0, 0.3)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  {/* Shine effect */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                  <Sparkle className="h-5 w-5 text-white relative z-10" />
                  <span className="relative z-10">Know Your Fortune</span>
                  <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              {/* Micro reassurance */}
              <p className="mt-4 text-sm text-gray-500 text-center">
                Takes 30 seconds &bull; No signup needed
              </p>
            </motion.div>

            {/* Trust indicator */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-500"
            >
              <Star className="h-4 w-4 text-purple-400 fill-purple-400" />
              <span>Trusted by 50,000+ seekers for love, career & life clarity</span>
              <Moon className="h-4 w-4 ml-2 text-indigo-400" />
            </motion.div>
          </motion.div>

          {/* Right Column - Stacked Image Composition */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center lg:justify-end"
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
                  <div className="absolute inset-0 z-[-1] bg-purple-500/20 blur-3xl rounded-full" />
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
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="h-10 w-6 rounded-full border border-purple-500/30 flex justify-center pt-2">
          <motion.div
            className="h-2 w-1 rounded-full bg-purple-500"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
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