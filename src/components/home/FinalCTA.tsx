'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--background))] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[rgb(var(--gold))]/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[rgb(var(--secondary))]/10 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Sparkle Icon with Pulse */}
          <motion.div
            className="relative inline-block mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-14 w-14 text-[rgb(var(--gold))]" />
            <motion.div
              className="absolute inset-0"
              animate={{ 
                scale: [1, 1.5, 1.5, 1],
                opacity: [0.5, 0, 0.5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-14 w-14 text-[rgb(var(--gold-light))]" />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-full bg-[rgb(var(--gold))]/20 blur-xl"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-[rgb(var(--foreground))] mb-6">
            Tumhare answers wait kar rahe hain...
          </h2>
          <p className="text-lg md:text-xl text-[rgb(var(--foreground-muted))] mb-10 leading-relaxed">
            Cards fail jaane hain. Tumhara guidance ready hai. 
            Clarity ke liye pehla step lo.
          </p>
          
          <Link href="/reading">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[rgb(var(--gold-start))] via-[rgb(var(--gold))] to-[rgb(var(--gold-start))] px-10 py-5 font-semibold text-black shadow-xl shadow-[rgb(var(--gold))/20] transition-all hover:shadow-[0_0_40px_rgba(244,197,66,0.4)]"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[rgb(var(--gold-start))] via-[rgb(var(--gold))] to-[rgb(var(--gold-start))] opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ 
                  x: ['-100%', '100%'],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <span className="relative z-10 text-lg">Apna Reading Shuru Karein</span>
              <ArrowRight className="relative z-10 h-6 w-6 transition-transform group-hover:translate-x-1" />
              
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-full blur-md bg-[rgb(var(--gold))]/50"
                animate={{ 
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </Link>
          
          <p className="mt-6 text-sm text-[rgb(var(--foreground-muted))]">
            60 seconds se kam lagega &bull; Free try karo
          </p>
        </motion.div>
      </div>
    </section>
  );
}