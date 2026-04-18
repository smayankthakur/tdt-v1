'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-[#0e0e0e] via-[#1a1a1a] to-[#0e0e0e] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[#F4C542]/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[#C1121F]/10 blur-3xl"
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
            <Sparkles className="h-14 w-14 text-[#F4C542]" />
            <motion.div
              className="absolute inset-0"
              animate={{ 
                scale: [1, 1.5, 1.5, 1],
                opacity: [0.5, 0, 0.5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-14 w-14 text-[#FFD84D]" />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-full bg-[#F4C542]/20 blur-xl"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-[#EAEAEA] mb-6">
            Your answers are waiting...
          </h2>
          <p className="text-lg md:text-xl text-[#7A7A7A] mb-10 leading-relaxed">
            The cards have been laid out. Your guidance is ready. 
            Take the first step toward clarity today.
          </p>
          
          <Link href="/reading">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#F4C542] via-[#FFD84D] to-[#F4C542] px-10 py-5 font-semibold text-black shadow-xl shadow-[#F4C542]/20 transition-all hover:shadow-[0_0_40px_rgba(244,197,66,0.4)]"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F4C542] via-[#FFD84D] to-[#F4C542] opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ 
                  x: ['-100%', '100%'],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <span className="relative z-10 text-lg">Start Your Reading</span>
              <ArrowRight className="relative z-10 h-6 w-6 transition-transform group-hover:translate-x-1" />
              
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-full blur-md bg-[#F4C542]/50"
                animate={{ 
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </Link>
          
          <p className="mt-6 text-sm text-[#7A7A7A]">
            Takes less than 60 seconds &bull; Free to try
          </p>
        </motion.div>
      </div>
    </section>
  );
}