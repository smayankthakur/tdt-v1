'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Preview() {
  return (
    <section className="py-20 bg-[#0B0B0F]">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-purple-200">
            Experience the Magic
          </h2>
          <p className="mt-4 text-purple-300/60">
            See what a reading feels like
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-[#1A1A2E]/50 backdrop-blur-md border border-purple-800/30 shadow-2xl shadow-purple-900/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-[#1A1A2E] to-indigo-900/20" />
          
          <div className="relative p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading text-lg font-semibold text-purple-200">
                Your Reading Preview
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-16 h-20 rounded-lg bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center border border-purple-700/50">
                  <span className="font-heading text-xs text-purple-200">The Fool</span>
                </div>
                <div className="flex-shrink-0 w-16 h-20 rounded-lg bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center border border-purple-700/50">
                  <span className="font-heading text-xs text-purple-200">The Lovers</span>
                </div>
                <div className="flex-shrink-0 w-16 h-20 rounded-lg bg-gradient-to-br from-purple-900 to-amber-900 flex items-center justify-center border border-purple-700/50">
                  <span className="font-heading text-xs text-purple-200">The Star</span>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-purple-300/70 leading-relaxed">
                  <span className="font-semibold text-purple-400">The Past:</span> You&apos;ve been at a crossroads, feeling uncertain about which path to take. The decisions you&apos;ve made have led you here, but something still feels unresolved...
                </p>
                <p className="text-purple-300/70 leading-relaxed mt-4">
                  <span className="font-semibold text-purple-400">The Present:</span> There&apos;s a new opportunity approaching. The universe is aligning to bring clarity to your situation, but you need to trust your intuition...
                </p>
                <p className="text-purple-300/70 leading-relaxed mt-4">
                  <span className="font-semibold text-purple-400">The Guidance:</span> The cards speak of hope and new beginnings. Whatever you&apos;ve been worrying about, there&apos;s light at the end. Trust the process...
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-purple-800/30">
                <p className="text-sm text-purple-400/50 text-center italic">
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
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-900/40 transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]"
            >
              Try Your Own Reading
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </Link>
          <p className="mt-4 text-sm text-purple-400/50">
            Takes less than 60 seconds
          </p>
        </motion.div>
      </div>
    </section>
  );
}