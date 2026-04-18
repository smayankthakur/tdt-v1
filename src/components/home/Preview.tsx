'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Preview() {
  return (
    <section className="py-24 bg-[#0e0e0e]">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-[#EAEAEA]">
            A Glimpse Into Your Journey
          </h2>
          <p className="mt-4 text-[#7A7A7A]">
            What the cards might reveal for you
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-[#1a1a1a]/60 backdrop-blur-md border border-[#F4C542]/20 shadow-2xl shadow-black/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#F4C542]/5 via-[#1a1a1a] to-[#C1121F]/5" />
          
          <div className="relative p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#F4C542] to-[#FFD84D]">
                <Sparkles className="h-5 w-5 text-black" />
              </div>
              <span className="font-heading text-lg font-semibold text-[#EAEAEA]">
                Your Reading Preview
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-16 h-24 rounded-lg bg-gradient-to-br from-[#1a1a1a] to-[#2a1a1a] flex items-center justify-center border border-[#F4C542]/30">
                  <span className="font-heading text-xs text-[#EAEAEA]">The Fool</span>
                </div>
                <div className="flex-shrink-0 w-16 h-24 rounded-lg bg-gradient-to-br from-[#1a1a1a] to-[#2a1a1a] flex items-center justify-center border border-[#F4C542]/30">
                  <span className="font-heading text-xs text-[#EAEAEA]">The Lovers</span>
                </div>
                <div className="flex-shrink-0 w-16 h-24 rounded-lg bg-gradient-to-br from-[#1a1a1a] to-[#2a1a1a] flex items-center justify-center border border-[#F4C542]/30">
                  <span className="font-heading text-xs text-[#EAEAEA]">The Star</span>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-[#B0B0B0] leading-relaxed italic">
                  <span className="text-[#F4C542] font-semibold not-italic">The Past:</span> You&apos;ve been at a crossroads, feeling uncertain about which path to take. The decisions you&apos;ve made have led you here, but something still feels unresolved...
                </p>
                <p className="text-[#B0B0B0] leading-relaxed mt-4 italic">
                  <span className="text-[#F4C542] font-semibold not-italic">The Present:</span> There&apos;s a new opportunity approaching. The universe is aligning to bring clarity to your situation, but you need to trust your intuition...
                </p>
                <p className="text-[#B0B0B0] leading-relaxed mt-4 italic">
                  <span className="text-[#F4C542] font-semibold not-italic">The Guidance:</span> The cards speak of hope and new beginnings. Whatever you&apos;ve been worrying about, there&apos;s light at the end. Trust the process...
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#F4C542]/10">
                <p className="text-sm text-[#7A7A7A] text-center italic">
                  This is just a glimpse. Your full reading awaits...
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Link href="/reading">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F4C542] via-[#FFD84D] to-[#F4C542] px-8 py-4 font-semibold text-black shadow-lg shadow-[#F4C542]/20 transition-all hover:shadow-[0_0_30px_rgba(244,197,66,0.4)]"
            >
              Begin Your Reading
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </Link>
          <p className="mt-4 text-sm text-[#7A7A7A]">
            Takes less than 60 seconds
          </p>
        </motion.div>
      </div>
    </section>
  );
}