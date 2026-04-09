'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import CTAButton from '@/components/CTAButton';
import { Sparkles, Sparkle, Eye, Heart, ArrowRight, Star, MessageCircle, Compass, Moon } from 'lucide-react';

const emotionalHooks = [
  { icon: Moon, title: 'Feeling stuck?', description: 'When life feels motionless and unclear' },
  { icon: Heart, title: 'Confused in love?', description: 'Your heart deserves honest answers' },
  { icon: Compass, title: 'Unsure about your next move?', description: 'The universe has guidance for you' },
];

const steps = [
  { icon: Heart, title: 'Ask Your Question', description: 'Focus on what troubles your heart' },
  { icon: Sparkles, title: 'Draw Your Cards', description: 'Select three cards from the deck' },
  { icon: Eye, title: 'Receive Insight', description: 'Get your personalized reading' },
];

const testimonials = [
  { name: 'Sarah M.', text: 'The reading was eerily accurate. It helped me see my situation clearly.', role: 'Verified Reader' },
  { name: 'James L.', text: 'I was skeptical, but the insights were profound. Highly recommend.', role: 'Verified Reader' },
  { name: 'Emily R.', text: 'Beautiful experience. The cards revealed what I needed to hear.', role: 'Verified Reader' },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeInOut' }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

function FloatingCard({ delay, className }: { delay: number; className?: string }) {
  return (
    <motion.div
      className={`absolute rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 ${className}`}
      style={{ width: 100, height: 140 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: [0, -15, 0],
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        delay,
        ease: 'easeInOut'
      }}
    />
  );
}

function AnimatedOrb() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="relative w-64 h-64"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-200/20 via-purple-200/20 to-amber-200/20 blur-3xl" />
        <motion.div
          className="absolute inset-8 rounded-full bg-gradient-to-br from-amber-300/30 to-purple-300/30"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-16 rounded-full bg-gradient-to-br from-amber-400/40 to-purple-400/40 blur-xl"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFFDF8] via-[#FDF6FF] via-40% via-[#FFF7E6] to-[#F3F0FF] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,175,55,0.12),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(124,108,242,0.08),transparent)]" />
        </div>
        
        {/* Floating Cards */}
        <FloatingCard delay={0} className="top-20 left-[10%] hidden lg:block" />
        <FloatingCard delay={1} className="top-32 right-[15%] hidden lg:block" />
        <FloatingCard delay={2} className="bottom-32 left-[20%] hidden lg:block" />
        
        <AnimatedOrb />
        
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="mb-8 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="relative">
                <Sparkle className="h-10 w-10 text-amber-500" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkle className="h-10 w-10 text-amber-400" />
                </motion.div>
              </div>
            </motion.div>
            
            <h1 className="font-heading text-4xl leading-[1.2] text-[#1A1A1A] md:text-5xl lg:text-6xl">
              Confused about what&apos;s happening
              <br />
              <span className="bg-gradient-to-r from-amber-500 to-purple-500 bg-clip-text text-transparent">
                in your life?
              </span>
            </h1>
            
            <motion.p 
              className="mx-auto mt-8 max-w-xl text-lg text-[#6B6B6B] leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Get real answers from the universe in seconds. 
              Experience mystical readings that feel like they were made just for you.
            </motion.p>
            
            <motion.div
              className="mt-12 flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Link href="/reading">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CTAButton size="lg" className="px-10">
                    Start Your Reading
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </CTAButton>
                </motion.div>
              </Link>
              
              <motion.div 
                className="flex items-center gap-2 text-sm text-[#6B6B6B]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>Trusted by 10,000+ seekers</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="h-10 w-6 rounded-full border-2 border-amber-400/40 flex justify-center pt-2">
            <motion.div
              className="h-2 w-1 rounded-full bg-amber-500"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* EMOTIONAL HOOK SECTION */}
      <section className="py-24 bg-[#FFFDF8]">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl text-[#1A1A1A]">
                What&apos;s weighing on your mind?
              </h2>
              <p className="mt-4 text-[#6B6B6B]">
                The universe understands what words cannot express
              </p>
            </div>
          </ScrollReveal>
          
          <motion.div 
            className="grid gap-6 md:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {emotionalHooks.map((hook, index) => (
              <motion.div
                key={hook.title}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
                transition={{ delay: index * 0.15 }}
                className="group p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-amber-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <motion.div
                  className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-purple-100"
                  whileHover={{ scale: 1.1 }}
                >
                  <hook.icon className="h-7 w-7 text-purple-500" />
                </motion.div>
                <h3 className="font-heading text-xl text-[#1A1A1A] mb-2">{hook.title}</h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed">{hook.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 bg-gradient-to-br from-[#FDF6FF] via-[#FFF7E6] to-[#F3F0FF]">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl text-[#1A1A1A]">
                How It Works
              </h2>
              <p className="mt-4 text-[#6B6B6B]">
                Three simple steps to unlock your clarity
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <ScrollReveal key={step.title} delay={index * 0.2}>
                <motion.div
                  className="relative text-center p-8"
                  whileHover={{ y: -8 }}
                >
                  <div className="mb-6 flex justify-center">
                    <motion.div
                      className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-200/30 to-purple-200/30" />
                      <step.icon className="h-9 w-9 text-purple-500 relative z-10" />
                      <motion.div
                        className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold"
                      >
                        {index + 1}
                      </motion.div>
                    </motion.div>
                  </div>
                  <h3 className="font-heading text-xl text-[#1A1A1A] mb-2">{step.title}</h3>
                  <p className="text-[#6B6B6B] text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF SECTION */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl text-[#1A1A1A]">
                What Others Are Saying
              </h2>
            </div>
          </ScrollReveal>
          
          <motion.div 
            className="grid gap-6 md:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
                transition={{ delay: index * 0.15 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-amber-50/50 to-purple-50/50 border border-amber-100/50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[#6B6B6B] italic mb-6 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-200 to-purple-200 flex items-center justify-center">
                    <span className="text-purple-700 font-medium">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#1A1A1A]">{testimonial.name}</p>
                    <p className="text-xs text-[#6B6B6B]">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 bg-gradient-to-br from-[#FFFDF8] via-[#FDF6FF] to-[#FFF7E6]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <motion.div
              className="relative inline-block mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-12 w-12 text-amber-500" />
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-12 w-12 text-amber-400" />
              </motion.div>
            </motion.div>
            
            <h2 className="font-heading text-3xl md:text-4xl text-[#1A1A1A] mb-4">
              There&apos;s something waiting for you to discover...
            </h2>
            <p className="text-lg text-[#6B6B6B] mb-10 leading-relaxed">
              The cards have been laid out. Your guidance is ready.
            </p>
            
            <Link href="/reading">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <CTAButton size="lg" className="px-12">
                  Reveal My Cards
                  <ArrowRight className="ml-2 h-5 w-5" />
                </CTAButton>
              </motion.div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-[#FFFDF8] border-t border-amber-100/50">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm text-[#6B6B6B]">
            © 2024 Divine Tarot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}